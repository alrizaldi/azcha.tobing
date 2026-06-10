import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { deleteFileFromDrive } from '@/lib/google-drive/upload';

export async function PUT(request: NextRequest, { params }: { params: { id: string, photoId: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    const supabase = await createClient();
    
    // Verify the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (projectError) {
      throw new Error(projectError.message);
    }
    
    if (project.user_id !== user.id) {
      return createErrorResponse('Not authorized to update photos in this project', 403);
    }
    
    // Update the photo
    const { data, error } = await supabase
      .from('gallery') // Assuming project photos are stored in the gallery table
      .update({
        caption: body.caption,
        order_index: body.order_index
      })
      .eq('id', params.photoId)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update project photo', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string, photoId: string } }) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    // Verify the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (projectError) {
      throw new Error(projectError.message);
    }
    
    if (project.user_id !== user.id) {
      return createErrorResponse('Not authorized to delete photos from this project', 403);
    }
    
    // Get the photo to get the Google Drive file ID
    const { data: photo, error: photoError } = await supabase
      .from('gallery') // Assuming project photos are stored in the gallery table
      .select('google_drive_file_id')
      .eq('id', params.photoId)
      .eq('user_id', user.id)
      .single();
    
    if (photoError) {
      throw new Error(photoError.message);
    }
    
    // Delete from Google Drive
    await deleteFileFromDrive(photo.google_drive_file_id);
    
    // Delete from database
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', params.photoId)
      .eq('user_id', user.id);
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete project photo', 500);
  }
}
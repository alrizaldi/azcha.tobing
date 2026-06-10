import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getGalleryPhotoById, updateGalleryPhoto, deleteGalleryPhoto } from '@/lib/supabase/queries';
import { updateGallerySchema } from '@/lib/validators';
import { deleteFileFromDrive } from '@/lib/google-drive/upload';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const photo = await getGalleryPhotoById(params.id, user.id);
    
    return createResponse({ data: photo });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch photo', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Validate inputs
    const validationResult = updateGallerySchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const updatedPhoto = await updateGalleryPhoto(params.id, user.id, body);
    
    return createResponse({ data: updatedPhoto });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update photo', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    // Get the photo to get the Google Drive file ID
    const photo = await getGalleryPhotoById(params.id, user.id);
    
    // Delete from Google Drive
    await deleteFileFromDrive(photo.google_drive_file_id);
    
    // Delete from database
    await deleteGalleryPhoto(params.id, user.id);
    
    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete photo', 500);
  }
}
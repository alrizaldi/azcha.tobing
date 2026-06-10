import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getProjectById, createGalleryPhoto } from '@/lib/supabase/queries';
import { uploadFileToDrive } from '@/lib/google-drive/upload';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const project = await getProjectById(params.id, user.id);
    
    return createResponse({ 
      data: project.project_photos || []
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch project photos', 500);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const captionsString = formData.get('captions') as string;
    
    if (!files || files.length === 0) {
      return createErrorResponse('At least one file is required', 400);
    }
    
    // Limit to 20 files per request
    if (files.length > 20) {
      return createErrorResponse('Maximum 20 files allowed per request', 400);
    }
    
    // Validate file types and sizes
    for (const file of files) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return createErrorResponse(`Invalid file type: ${file.type}. Only images are allowed.`, 400);
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB in bytes
        return createErrorResponse(`File ${file.name} is too large. Maximum 50MB allowed.`, 413);
      }
    }
    
    // Parse captions if provided
    let captions: string[] = [];
    if (captionsString) {
      try {
        captions = JSON.parse(captionsString);
        if (!Array.isArray(captions)) {
          captions = Array(files.length).fill('');
        } else if (captions.length !== files.length) {
          // Pad with empty strings if caption count doesn't match file count
          while (captions.length < files.length) {
            captions.push('');
          }
          captions = captions.slice(0, files.length);
        }
      } catch {
        captions = Array(files.length).fill('');
      }
    } else {
      captions = Array(files.length).fill('');
    }
    
    // Upload files and save to database
    const uploadedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const caption = captions[i];
      
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Upload to Google Drive in the project folder
      const driveResult = await uploadFileToDrive(
        buffer,
        file.name,
        file.type,
        params.id // Using project ID as the parent folder ID
      );
      
      // Save to database as project photo
      const newPhoto = await createGalleryPhoto(user.id, {
        title: file.name,
        description: caption,
        category: 'project',
        featured: false,
        googleDriveFileId: driveResult.fileId,
        googleDriveUrl: driveResult.webViewLink,
      });
      
      uploadedPhotos.push(newPhoto);
    }
    
    return createResponse({ 
      data: uploadedPhotos 
    });
  } catch (error: any) {
    console.error('Error uploading project photos:', error);
    return createErrorResponse(error.message || 'Failed to upload project photos', 500);
  }
}
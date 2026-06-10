import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse, validateRequestBody } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getGalleryPhotos, createGalleryPhoto } from '@/lib/supabase/queries';
import { createGallerySchema } from '@/lib/validators';
import { uploadFileToDrive } from '@/lib/google-drive/upload';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const featuredStr = searchParams.get('featured');
    const featured = featuredStr ? featuredStr === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';

    const user = await requireAuth();
    
    const photos = await getGalleryPhotos(
      user.id,
      category,
      tag,
      featured,
      limit,
      offset,
      sort
    );

    return createResponse({
      data: photos,
      total: photos.length, // In a real app, you'd want to get the actual total
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch gallery photos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const tagsString = formData.get('tags') as string;
    const featuredStr = formData.get('featured') as string;
    
    if (!file) {
      return createErrorResponse('File is required', 400);
    }
    
    // Validate inputs
    const validationResult = createGallerySchema.safeParse({
      title,
      description,
      category,
      featured: featuredStr === 'true',
    });
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    // Convert tags string to array
    let tags: string[] = [];
    if (tagsString) {
      try {
        tags = JSON.parse(tagsString);
        if (!Array.isArray(tags)) {
          tags = [];
        }
      } catch {
        tags = [];
      }
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Google Drive
    const driveResult = await uploadFileToDrive(
      buffer,
      file.name,
      file.type
    );
    
    // Save to database
    const newPhoto = await createGalleryPhoto(user.id, {
      title,
      description,
      category,
      tags,
      featured: featuredStr === 'true',
      googleDriveFileId: driveResult.fileId,
      googleDriveUrl: driveResult.webViewLink,
    });
    
    return createResponse({ data: newPhoto });
  } catch (error: any) {
    console.error('Error creating gallery photo:', error);
    return createErrorResponse(error.message || 'Failed to upload photo', 500);
  }
}
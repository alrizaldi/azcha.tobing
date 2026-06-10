import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { uploadFileToDrive } from '@/lib/google-drive/upload';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const destination = formData.get('destination') as string;
    const parentId = formData.get('parentId') as string | null;
    
    if (!file) {
      return createErrorResponse('File is required', 400);
    }
    
    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse('Invalid file type. Only images are allowed.', 400);
    }
    
    // Validate file size (less than 100MB)
    if (file.size > 100 * 1024 * 1024) { // 100MB in bytes
      return createErrorResponse('File size too large. Maximum 100MB allowed.', 413);
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Google Drive
    const driveResult = await uploadFileToDrive(
      buffer,
      file.name,
      file.type,
      parentId || undefined
    );
    
    return createResponse({ 
      data: driveResult 
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return createErrorResponse(error.message || 'Failed to upload file', 500);
  }
}
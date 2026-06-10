import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getGalleryPhotoById, updateGalleryPhoto } from '@/lib/supabase/queries';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    if (typeof body.order_index !== 'number') {
      return createErrorResponse('Order index is required', 400);
    }
    
    // Verify the user owns this photo
    const photo = await getGalleryPhotoById(params.id, user.id);
    
    if (!photo) {
      return createErrorResponse('Photo not found or not authorized', 404);
    }
    
    const updatedPhoto = await updateGalleryPhoto(params.id, user.id, {
      order_index: body.order_index
    });
    
    return createResponse({ data: updatedPhoto });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to reorder photo', 500);
  }
}
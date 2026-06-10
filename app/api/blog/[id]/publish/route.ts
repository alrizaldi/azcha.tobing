import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getBlogPostById, updateBlogPost } from '@/lib/supabase/queries';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    if (typeof body.published !== 'boolean') {
      return createErrorResponse('Published status is required', 400);
    }
    
    // Verify the user owns this post
    const post = await getBlogPostById(params.id, user.id);
    
    if (!post) {
      return createErrorResponse('Post not found or not authorized', 404);
    }
    
    // Update the post with new published status
    const updatedPost = await updateBlogPost(params.id, user.id, {
      published: body.published,
      ...(body.published && !post.published_at ? { published_at: new Date().toISOString() } : {}) // Set published_at only if publishing for the first time
    });
    
    return createResponse({ data: updatedPost });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update post publishing status', 500);
  }
}
import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/supabase/queries';
import { updateBlogSchema } from '@/lib/validators';
import { slugify } from '@/lib/api-helpers';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Note: This would typically be a public endpoint, but for consistency with the protected route pattern
    // we'll require auth. In a real app, you might want to separate public and protected blog routes.
    const user = await requireAuth();
    
    const post = await getBlogPostById(params.id, user.id);
    
    return createResponse({ data: post });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch blog post', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Generate slug from title if not provided
    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }
    
    // Validate inputs
    const validationResult = updateBlogSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const updatedPost = await updateBlogPost(params.id, user.id, body);
    
    return createResponse({ data: updatedPost });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update blog post', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    await deleteBlogPost(params.id, user.id);
    
    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete blog post', 500);
  }
}
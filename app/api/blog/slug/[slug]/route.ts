import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { getBlogPostBySlug } from '@/lib/supabase/queries';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    
    return createResponse({ data: post });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch blog post', 500);
  }
}
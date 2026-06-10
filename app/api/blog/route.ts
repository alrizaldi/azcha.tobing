import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getBlogPosts, createBlogPost } from '@/lib/supabase/queries';
import { createBlogSchema } from '@/lib/validators';
import { slugify } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedStr = searchParams.get('published');
    const published = publishedStr ? publishedStr === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
    const search = searchParams.get('search') || undefined;

    const posts = await getBlogPosts(
      published,
      limit,
      offset,
      sort,
      search
    );

    return createResponse({
      data: posts,
      total: posts.length, // In a real app, you'd want to get the actual total
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch blog posts', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Generate slug from title if not provided
    if (!body.slug) {
      body.slug = slugify(body.title);
    }
    
    // Validate inputs
    const validationResult = createBlogSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const newPost = await createBlogPost(user.id, body);
    
    return createResponse({ data: newPost });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create blog post', 500);
  }
}
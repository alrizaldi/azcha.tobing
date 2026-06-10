import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getTestimonials, createTestimonial } from '@/lib/supabase/queries';
import { testimonialSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredStr = searchParams.get('featured');
    const featured = featuredStr ? featuredStr === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const testimonials = await getTestimonials(
      featured,
      limit
    );

    return createResponse({ data: testimonials });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch testimonials', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Validate inputs
    const validationResult = testimonialSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const newTestimonial = await createTestimonial(user.id, body);
    
    return createResponse({ data: newTestimonial });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create testimonial', 500);
  }
}
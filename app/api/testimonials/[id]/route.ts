import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch testimonial', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    const supabase = await createClient();
    
    // Validate the user owns this testimonial
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    if (existingTestimonial.user_id !== user.id) {
      return createErrorResponse('Not authorized to update this testimonial', 403);
    }
    
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        client_name: body.client_name,
        client_image_google_drive_id: body.client_image_google_drive_id,
        client_image_url: body.client_image_url,
        content: body.content,
        rating: body.rating,
        featured: body.featured
      })
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update testimonial', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    // Validate the user owns this testimonial
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    if (existingTestimonial.user_id !== user.id) {
      return createErrorResponse('Not authorized to delete this testimonial', 403);
    }
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete testimonial', 500);
  }
}
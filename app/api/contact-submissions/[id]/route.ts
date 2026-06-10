import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch contact submission', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    if (typeof body.read !== 'boolean') {
      return createErrorResponse('Read status is required', 400);
    }
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ read: body.read })
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ data });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update contact submission', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete contact submission', 500);
  }
}
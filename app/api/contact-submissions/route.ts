import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const readStr = searchParams.get('read');
    const read = readStr ? readStr === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';

    let query = supabase
      .from('contact_submissions')
      .select('*');
    
    if (typeof read === 'boolean') {
      query = query.eq('read', read);
    }
    
    query = query.range(offset, offset + limit - 1);
    
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: true });
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message);
    }

    return createResponse({ 
      data: data,
      total: data.length // In a real app, you'd want to get the actual total
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch contact submissions', 500);
  }
}
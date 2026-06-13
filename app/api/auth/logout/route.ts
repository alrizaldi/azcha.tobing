import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return createErrorResponse(error.message, 500);
    }
    
    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Logout failed', 500);
  }
}
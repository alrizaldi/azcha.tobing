import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      return createResponse({ user: null, session: null });
    }
    
    return createResponse({ 
      user: session.user,
      session 
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to get session', 500);
  }
}
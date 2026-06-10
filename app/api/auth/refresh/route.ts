import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    if (!body.refreshToken) {
      return createErrorResponse('Refresh token is required', 400);
    }
    
    // Note: Supabase handles token refresh automatically, 
    // but we'll include this endpoint as per the specification
    // In a real implementation, you would use the refresh token to get a new session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: body.refreshToken
    });
    
    if (error) {
      return createErrorResponse(error.message, 401);
    }
    
    return createResponse({ 
      token: data.session?.access_token,
      session: data.session
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to refresh token', 500);
  }
}
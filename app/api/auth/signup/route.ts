import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    if (!body.email || !body.password || !body.name) {
      return createErrorResponse('Email, password, and name are required', 400);
    }
    
    // First, create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          name: body.name
        }
      }
    });
    
    if (authError) {
      return createErrorResponse(authError.message, 400);
    }
    
    // If signup was successful, return the user and session
    return createResponse({ 
      user: authData.user,
      session: authData.session 
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Signup failed', 500);
  }
}
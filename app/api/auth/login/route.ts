import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    if (!body.email || !body.password) {
      return createErrorResponse('Email and password are required', 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    
    if (error) {
      return createErrorResponse(error.message, 401);
    }
    
    return createResponse({ 
      user: data.user,
      session: data.session 
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Login failed', 500);
  }
}
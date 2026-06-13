import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // This endpoint is kept for backward compatibility, but specific routes are preferred
    // Determine the action based on the body
    const action = body.action || 'login';
    
    if (action === 'login') {
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
    } else if (action === 'logout') {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return createErrorResponse(error.message, 500);
      }
      
      return createResponse({ success: true });
    } else if (action === 'signup') {
      if (!body.email || !body.password || !body.name) {
        return createErrorResponse('Email, password, and name are required', 400);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            name: body.name
          }
        }
      });
      
      if (error) {
        return createErrorResponse(error.message, 400);
      }
      
      return createResponse({ 
        user: data.user,
        session: data.session 
      });
    } else {
      return createErrorResponse('Invalid auth action', 400);
    }
  } catch (error: any) {
    return createErrorResponse(error.message || 'Authentication failed', 500);
  }
}
import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    if (!body.currentPassword || !body.newPassword) {
      return createErrorResponse('Current password and new password are required', 400);
    }
    
    if (body.newPassword.length < 6) {
      return createErrorResponse('New password must be at least 6 characters', 400);
    }
    
    const supabase = await createClient();
    
    // Attempt to sign in with current password to verify it's correct
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email || '',
      password: body.currentPassword,
    });
    
    if (signInError) {
      return createErrorResponse('Current password is incorrect', 401);
    }
    
    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: body.newPassword,
    });
    
    if (updateError) {
      return createErrorResponse(updateError.message, 500);
    }

    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to change password', 500);
  }
}
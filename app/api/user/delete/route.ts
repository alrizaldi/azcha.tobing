import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    // Note: In a real implementation, you would need to delete all related data
    // for the user (projects, gallery photos, blog posts, etc.) before deleting the user
    // This is a simplified version
    
    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (authError) {
      return createErrorResponse(authError.message, 500);
    }

    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete user', 500);
  }
}
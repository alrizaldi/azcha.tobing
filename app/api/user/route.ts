import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getUserById, updateUser } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const userData = await getUserById(user.id);
    
    return createResponse({ data: userData });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch user data', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    const updatedUser = await updateUser(user.id, body);
    
    return createResponse({ data: updatedUser });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update user', 500);
  }
}
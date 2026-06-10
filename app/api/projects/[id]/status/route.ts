import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { updateProjectStatus } from '@/lib/supabase/queries';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    if (!body.status) {
      return createErrorResponse('Status is required', 400);
    }
    
    const updatedProject = await updateProjectStatus(params.id, user.id, body.status);
    
    return createResponse({ data: updatedProject });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update project status', 500);
  }
}
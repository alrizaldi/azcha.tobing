import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject } from '@/lib/supabase/queries';
import { updateProjectSchema } from '@/lib/validators';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const project = await getProjectById(params.id, user.id);
    
    return createResponse({ data: project });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch project', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Validate inputs
    const validationResult = updateProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const updatedProject = await updateProject(params.id, user.id, body);
    
    return createResponse({ data: updatedProject });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to update project', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    
    await deleteProject(params.id, user.id);
    
    return createResponse({ success: true });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to delete project', 500);
  }
}
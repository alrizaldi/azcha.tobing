import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { getProjects, createProject } from '@/lib/supabase/queries';
import { createProjectSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';

    const projects = await getProjects(
      user.id,
      status,
      startDate,
      endDate,
      limit,
      offset,
      sort
    );

    return createResponse({
      data: projects,
      total: projects.length, // In a real app, you'd want to get the actual total
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch projects', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const body = await request.json();
    
    // Validate inputs
    const validationResult = createProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.errors.map(err => err.message).join(', '), 
        400
      );
    }
    
    const newProject = await createProject(user.id, body);
    
    return createResponse({ data: newProject });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to create project', 500);
  }
}
import { NextRequest } from 'next/server';
import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    const supabase = await createClient();
    
    // Get the date range from query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    
    // Get total projects count
    const { count: totalProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (projectsError) {
      throw new Error(projectsError.message);
    }
    
    // Get completed projects count
    const { count: completedProjects, error: completedError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');
    
    if (completedError) {
      throw new Error(completedError.message);
    }
    
    // Get total photos count
    const { count: totalPhotos, error: photosError } = await supabase
      .from('gallery')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (photosError) {
      throw new Error(photosError.message);
    }
    
    // Get total blog posts count
    const { count: totalPosts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (postsError) {
      throw new Error(postsError.message);
    }
    
    // Get recent submissions count
    const { count: recentSubmissions, error: submissionsError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    
    if (submissionsError) {
      throw new Error(submissionsError.message);
    }

    return createResponse({ 
      data: {
        totalProjects: totalProjects || 0,
        completedProjects: completedProjects || 0,
        totalPhotos: totalPhotos || 0,
        totalPosts: totalPosts || 0,
        recentSubmissions: recentSubmissions || 0,
      } 
    });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch analytics', 500);
  }
}
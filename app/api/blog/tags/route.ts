import { createResponse, createErrorResponse } from '@/lib/api-helpers';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get all blog posts with tags
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true);
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Count occurrences of each tag
    const tagCount: Record<string, number> = {};
    
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
    
    // Convert to array format
    const tags = Object.entries(tagCount).map(([tag, count]) => ({
      tag,
      count
    }));

    return createResponse({ data: tags });
  } catch (error: any) {
    return createErrorResponse(error.message || 'Failed to fetch blog tags', 500);
  }
}
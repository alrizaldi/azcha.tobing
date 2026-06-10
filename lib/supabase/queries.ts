import { createClient } from './server';

// Gallery Queries
export async function getGalleryPhotos(
  userId: string,
  category?: string,
  tag?: string,
  featured?: boolean,
  limit: number = 20,
  offset: number = 0,
  sort: 'newest' | 'oldest' = 'newest'
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('user_id', userId);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (tag) {
    query = query.contains('tags', [tag]);
  }
  
  if (typeof featured === 'boolean') {
    query = query.eq('featured', featured);
  }
  
  query = query.range(offset, offset + limit - 1);
  
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getGalleryPhotoById(photoId: string, userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', photoId)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createGalleryPhoto(userId: string, photoData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('gallery')
    .insert([{
      user_id: userId,
      title: photoData.title,
      description: photoData.description,
      google_drive_file_id: photoData.googleDriveFileId,
      google_drive_url: photoData.googleDriveUrl,
      category: photoData.category,
      tags: photoData.tags || [],
      featured: photoData.featured || false,
      order_index: photoData.orderIndex || 999
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateGalleryPhoto(photoId: string, userId: string, photoData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('gallery')
    .update({
      title: photoData.title,
      description: photoData.description,
      category: photoData.category,
      tags: photoData.tags,
      featured: photoData.featured,
      order_index: photoData.orderIndex
    })
    .eq('id', photoId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteGalleryPhoto(photoId: string, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', photoId)
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

// Projects Queries
export async function getProjects(
  userId: string,
  status?: string,
  startDate?: string,
  endDate?: string,
  limit: number = 50,
  offset: number = 0,
  sort: 'newest' | 'oldest' = 'newest'
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (startDate) {
    query = query.gte('start_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('end_date', endDate);
  }
  
  query = query.range(offset, offset + limit - 1);
  
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getProjectById(projectId: string, userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_photos (*)
    `)
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createProject(userId: string, projectData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      user_id: userId,
      title: projectData.title,
      client_name: projectData.clientName,
      description: projectData.description,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
      budget: projectData.budget,
      notes: projectData.notes,
      status: projectData.status || 'planning'
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateProject(projectId: string, userId: string, projectData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: projectData.title,
      client_name: projectData.clientName,
      description: projectData.description,
      status: projectData.status,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
      budget: projectData.budget,
      notes: projectData.notes
    })
    .eq('id', projectId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteProject(projectId: string, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

export async function updateProjectStatus(projectId: string, userId: string, status: string) {
  const validStatuses = ['planning', 'in-progress', 'completed', 'on-hold'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Blog Queries
export async function getBlogPosts(
  published?: boolean,
  limit: number = 10,
  offset: number = 0,
  sort: 'newest' | 'oldest' = 'newest',
  search?: string
) {
  const supabase = await createClient();
  
  let query = supabase
    .from('blog_posts')
    .select('*');
  
  if (typeof published === 'boolean') {
    query = query.eq('published', published);
  }
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  
  query = query.range(offset, offset + limit - 1);
  
  if (sort === 'newest') {
    query = query.order('published_at', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getBlogPostById(postId: string, userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', postId)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createBlogPost(userId: string, postData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{
      user_id: userId,
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      featured_image_google_drive_id: postData.featuredImageId,
      featured_image_url: postData.featuredImageUrl,
      seo_description: postData.seoDescription,
      tags: postData.tags || [],
      published: postData.published || false,
      slug: postData.slug
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateBlogPost(postId: string, userId: string, postData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      featured_image_google_drive_id: postData.featuredImageId,
      featured_image_url: postData.featuredImageUrl,
      seo_description: postData.seoDescription,
      tags: postData.tags,
      published: postData.published,
      slug: postData.slug
    })
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteBlogPost(postId: string, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

// Testimonials Queries
export async function getTestimonials(featured?: boolean, limit: number = 10) {
  const supabase = await createClient();
  
  let query = supabase
    .from('testimonials')
    .select('*');
  
  if (typeof featured === 'boolean') {
    query = query.eq('featured', featured);
  }
  
  query = query.range(0, limit - 1);
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createTestimonial(userId: string, testimonialData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      user_id: userId,
      client_name: testimonialData.clientName,
      client_image_google_drive_id: testimonialData.clientImageId,
      client_image_url: testimonialData.clientImageUrl,
      content: testimonialData.content,
      rating: testimonialData.rating,
      featured: testimonialData.featured || false
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Contact Queries
export async function submitContactForm(contactData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([{
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// User Queries
export async function getUserById(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateUser(userId: string, userData: any) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .update({
      name: userData.name,
      bio: userData.bio,
      profile_image_url: userData.profileImageUrl,
      phone: userData.phone,
      website: userData.website
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}
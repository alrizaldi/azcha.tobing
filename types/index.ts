// User types
export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  profile_image_url?: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

// Photo types
export interface Photo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  google_drive_file_id: string;
  google_drive_url: string;
  category: string;
  tags: string[];
  featured: boolean;
  order_index: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  client_name: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  start_date: string;
  end_date: string;
  budget?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithPhotos extends Project {
  photos: Photo[];
}

// Blog post types
export interface BlogPost {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_google_drive_id?: string;
  featured_image_url?: string;
  seo_description?: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  user_id: string;
  client_name: string;
  client_image_google_drive_id?: string;
  client_image_url?: string;
  content: string;
  rating: number;
  featured: boolean;
  created_at: string;
}

// Contact submission types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// API request types
export interface ApiRequestQuery {
  [key: string]: string | undefined;
}

export interface GalleryQuery extends ApiRequestQuery {
  category?: string;
  tag?: string;
  featured?: string;
  limit?: string;
  offset?: string;
  sort?: string;
}

export interface ProjectsQuery extends ApiRequestQuery {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  offset?: string;
  sort?: string;
}

export interface BlogQuery extends ApiRequestQuery {
  published?: string;
  limit?: string;
  offset?: string;
  sort?: string;
  search?: string;
}
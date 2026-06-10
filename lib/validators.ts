import { z } from 'zod';

// Gallery validation schemas
export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
});

export const updateGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order_index: z.number().optional(),
});

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  client_name: z.string().min(1, 'Client name is required'),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  budget: z.union([z.number(), z.null()]).optional(),
  notes: z.string().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  client_name: z.string().min(1, 'Client name is required').optional(),
  description: z.string().optional(),
  status: z.enum(['planning', 'in-progress', 'completed', 'on-hold']).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  budget: z.union([z.number(), z.null()]).optional(),
  notes: z.string().optional(),
});

// Blog validation schemas
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  seo_description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  seo_description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  slug: z.string().optional(),
});

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  subject: z.string().optional(),
  phone: z.string().optional(),
});

// Testimonial validation schema
export const testimonialSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5),
  featured: z.boolean().optional(),
});
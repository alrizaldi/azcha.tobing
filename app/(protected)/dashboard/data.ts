'use server';

export async function getDashboardStats() {
  // In a real app, this would fetch from the API
  return {
    projects: 12,
    completed: 8,
    photos: 156,
    posts: 5
  };
}

export async function getRecentActivity() {
  // In a real app, this would fetch from the API
  return [
    { id: 1, title: 'Summer Wedding Photoshoot', date: '2 hours ago', type: 'Project', href: '/dashboard/projects/1' },
    { id: 2, title: 'Mountain Landscape Collection', date: '1 day ago', type: 'Photo', href: '/dashboard/gallery' },
    { id: 3, title: 'Tips for Outdoor Photography', date: '2 days ago', type: 'Post', href: '/dashboard/blog/1' },
    { id: 4, title: 'Corporate Event Coverage', date: '3 days ago', type: 'Project', href: '/dashboard/projects/2' },
    { id: 5, title: 'Portrait Session', date: '4 days ago', type: 'Photo', href: '/dashboard/gallery' },
  ];
}
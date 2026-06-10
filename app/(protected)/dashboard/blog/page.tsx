'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  published: boolean;
  views: number;
  slug: string;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Tips for Outdoor Portrait Photography',
        excerpt: 'Learn essential techniques for capturing stunning outdoor portraits in natural lighting conditions.',
        date: '2023-06-10',
        published: true,
        views: 124,
        slug: 'outdoor-portrait-photography-tips'
      },
      {
        id: '2',
        title: 'The Art of Wedding Photography',
        excerpt: 'Discover how to capture authentic emotions and timeless moments during a wedding celebration.',
        date: '2023-05-28',
        published: true,
        views: 89,
        slug: 'art-of-wedding-photography'
      },
      {
        id: '3',
        title: 'Understanding Camera Settings for Beginners',
        excerpt: 'A comprehensive guide to mastering aperture, shutter speed, and ISO for new photographers.',
        date: '2023-05-15',
        published: false,
        views: 0,
        slug: 'camera-settings-for-beginners'
      },
      {
        id: '4',
        title: 'Post-Processing Workflow for Landscape Photos',
        excerpt: 'Step-by-step tutorial on editing landscape photos to enhance colors and details.',
        date: '2023-04-30',
        published: true,
        views: 210,
        slug: 'landscape-post-processing-workflow'
      }
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const filteredPosts = filter === 'all' 
    ? posts 
    : filter === 'published' 
      ? posts.filter(post => post.published) 
      : posts.filter(post => !post.published);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-700">
            Manage your blog content
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/dashboard/blog/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
            New Post
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Filter by status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <li key={post.id}>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-500">
                          {post.published ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{post.views} views</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaEye className="-ml-0.5 mr-1 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/blog/${post.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaEdit className="-ml-0.5 mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaTrash className="-ml-0.5 mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li>
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/blog/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                      New post
                    </Link>
                  </div>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
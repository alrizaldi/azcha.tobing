'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaImages } from 'react-icons/fa';

interface Photo {
  id: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  date: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockPhotos: Photo[] = [
      {
        id: '1',
        title: 'Mountain Landscape',
        description: 'Beautiful mountain landscape at sunset',
        category: 'landscape',
        featured: true,
        date: '2023-06-10',
        imageUrl: '/placeholder-landscape.jpg'
      },
      {
        id: '2',
        title: 'Portrait Session',
        description: 'Professional portrait session',
        category: 'portrait',
        featured: false,
        date: '2023-06-08',
        imageUrl: '/placeholder-portrait.jpg'
      },
      {
        id: '3',
        title: 'Wedding Ceremony',
        description: 'Candid wedding ceremony moment',
        category: 'wedding',
        featured: true,
        date: '2023-06-05',
        imageUrl: '/placeholder-wedding.jpg'
      },
      {
        id: '4',
        title: 'Street Photography',
        description: 'Urban street photography',
        category: 'street',
        featured: false,
        date: '2023-06-03',
        imageUrl: '/placeholder-street.jpg'
      }
    ];
    
    setPhotos(mockPhotos);
    setLoading(false);
  }, []);

  const filteredPhotos = filter === 'all' 
    ? photos 
    : filter === 'featured' 
      ? photos.filter(photo => photo.featured) 
      : photos.filter(photo => photo.category === filter);

  const categories = ['all', 'landscape', 'portrait', 'wedding', 'street', 'featured'];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-700">
            Manage your portfolio photos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/dashboard/gallery/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
            Upload Photos
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-gray-50">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-2">Filter by category:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="wedding">Wedding</option>
                <option value="street">Street</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {filteredPhotos.length > 0 ? (
              filteredPhotos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <FaImages className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{photo.title}</h3>
                      {photo.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{photo.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(photo.date).toLocaleDateString()}</p>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FaEdit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <FaTrash className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading your first photo.</p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/gallery/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                    Upload photos
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
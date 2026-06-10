'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  description: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'planning': return 'bg-gray-100 text-gray-800';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'on-hold': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Summer Wedding Photoshoot',
        clientName: 'Johnson Wedding',
        status: 'completed',
        startDate: '2023-06-01',
        endDate: '2023-06-02',
        description: 'Full day wedding coverage for the Johnson family'
      },
      {
        id: '2',
        title: 'Corporate Event',
        clientName: 'Tech Innovations Inc.',
        status: 'in-progress',
        startDate: '2023-06-15',
        endDate: '2023-06-16',
        description: 'Annual conference photography'
      },
      {
        id: '3',
        title: 'Portrait Session',
        clientName: 'Smith Family',
        status: 'planning',
        startDate: '2023-07-10',
        endDate: '2023-07-10',
        description: 'Family portrait session'
      },
      {
        id: '4',
        title: 'Product Photography',
        clientName: 'ABC Company',
        status: 'on-hold',
        startDate: '2023-06-20',
        endDate: '2023-06-22',
        description: 'E-commerce product shots'
      }
    ];
    
    setProjects(mockProjects);
    setLoading(false);
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-700">
            Manage your photography projects and productions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/dashboard/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
            New Project
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
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
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
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <li key={project.id}>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {project.title}
                      </div>
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>Client: {project.clientName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaEye className="-ml-0.5 mr-1 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/projects/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                      New project
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
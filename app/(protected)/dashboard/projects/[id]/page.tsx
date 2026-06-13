'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface Project {
  id: string;
  title: string;
  client_name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  notes: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  created_at: string;
  updated_at: string;
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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setProject(result.data);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to update status');
      }

      // Update the local state
      setProject(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to delete project');
      }
      
      router.push('/dashboard/projects');
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert(err.message || 'Failed to delete project');
    }
  };

  const startEditing = () => {
    if (project) {
      setEditData({
        title: project.title,
        client_name: project.client_name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
        budget: project.budget,
        notes: project.notes
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to update project');
      }

      const result = await response.json();
      setProject(result.data);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving project:', err);
      alert(err.message || 'Failed to save project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/dashboard/projects" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
          </div>
          
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Error: {error || 'Project not found'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/projects" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your photography project information</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaTrash className="mr-1 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">Client Name</label>
                <input
                  type="text"
                  id="client_name"
                  value={editData.client_name}
                  onChange={(e) => setEditData({...editData, client_name: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    value={editData.start_date.split('T')[0]}
                    onChange={(e) => setEditData({...editData, start_date: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    value={editData.end_date.split('T')[0]}
                    onChange={(e) => setEditData({...editData, end_date: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget ($)</label>
                <input
                  type="number"
                  id="budget"
                  value={editData.budget || ''}
                  onChange={(e) => setEditData({...editData, budget: e.target.value ? parseFloat(e.target.value) : null})}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  id="notes"
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelEditing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaTimes className="mr-1 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaSave className="mr-1 h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>Client: {project.client_name}</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Project Dates</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Budget</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>${project.budget ? project.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-gray-900">Description</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{project.description || 'No description provided.'}</p>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-gray-900">Notes</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{project.notes || 'No notes provided.'}</p>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-gray-900">Status Management</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['planning', 'in-progress', 'completed', 'on-hold'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(status)}
                        disabled={project.status === status}
                        className={`px-3 py-1 text-sm rounded-md ${
                          project.status === status
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {status.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaEdit className="mr-1 h-4 w-4" />
                  Edit Project
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading dashboard...</p>
    </div>
  );
}
import { Suspense } from 'react';
import Link from 'next/link';
import { FaProjectDiagram, FaImages, FaBlog, FaUserAlt } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

function StatCard({ title, value, icon, color, href }: StatCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className={`inline-flex items-center justify-center p-3 rounded-md ${color}`}>
              {icon}
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface RecentItemProps {
  title: string;
  date: string;
  type: string;
  href: string;
}

function RecentItem({ title, date, type, href }: RecentItemProps) {
  let typeColor = '';
  switch (type) {
    case 'Project':
      typeColor = 'bg-blue-100 text-blue-800';
      break;
    case 'Photo':
      typeColor = 'bg-green-100 text-green-800';
      break;
    case 'Post':
      typeColor = 'bg-purple-100 text-purple-800';
      break;
    default:
      typeColor = 'bg-gray-100 text-gray-800';
  }

  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {title.charAt(0)}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            <Link href={href}>{title}</Link>
          </p>
          <p className="text-sm text-gray-500 truncate">{date}</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
            {type}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function DashboardPage() {
async function getDashboardStats() {
  // In a real app, this would fetch from the API
  return {
    projects: 12,
    completed: 8,
    photos: 156,
    posts: 5
  };
}

async function getRecentActivity() {
  // In a real app, this would fetch from the API
  return [
    { id: 1, title: 'Summer Wedding Photoshoot', date: '2 hours ago', type: 'Project', href: '/dashboard/projects/1' },
    { id: 2, title: 'Mountain Landscape Collection', date: '1 day ago', type: 'Photo', href: '/dashboard/gallery' },
    { id: 3, title: 'Tips for Outdoor Photography', date: '2 days ago', type: 'Post', href: '/dashboard/blog/1' },
    { id: 4, title: 'Corporate Event Coverage', date: '3 days ago', type: 'Project', href: '/dashboard/projects/2' },
    { id: 5, title: 'Portrait Session', date: '4 days ago', type: 'Photo', href: '/dashboard/gallery' },
  ];
}

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Projects" 
          value={stats.projects.toString()} 
          icon={<FaProjectDiagram className="h-6 w-6 text-white" />} 
          color="bg-blue-500"
          href="/dashboard/projects"
        />
        <StatCard 
          title="Completed Projects" 
          value={stats.completed.toString()} 
          icon={<FaProjectDiagram className="h-6 w-6 text-white" />} 
          color="bg-green-500"
          href="/dashboard/projects"
        />
        <StatCard 
          title="Photos Uploaded" 
          value={stats.photos.toString()} 
          icon={<FaImages className="h-6 w-6 text-white" />} 
          color="bg-purple-500"
          href="/dashboard/gallery"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.posts.toString()} 
          icon={<FaBlog className="h-6 w-6 text-white" />} 
          color="bg-yellow-500"
          href="/dashboard/blog"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentItems.map(item => (
              <RecentItem 
                key={item.id} 
                title={item.title} 
                date={item.date} 
                type={item.type} 
                href={item.href} 
              />
            ))}
          </ul>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link href="/dashboard/projects/create" className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-2">
                    <FaProjectDiagram className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">New Project</h4>
                    <p className="text-sm text-gray-500">Create a new project</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/gallery/upload" className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-2">
                    <FaImages className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Upload Photos</h4>
                    <p className="text-sm text-gray-500">Add to your gallery</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/blog/create" className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-2">
                    <FaBlog className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Write Post</h4>
                    <p className="text-sm text-gray-500">Create a new blog post</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/settings" className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-500 rounded-md p-2">
                    <FaUserAlt className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Settings</h4>
                    <p className="text-sm text-gray-500">Manage your profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Header mounted, checking auth status...');
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log('Fetching auth session from header...');
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        console.log('Auth session response from header:', data);
        
        const authenticated = !!data.data?.user;
        console.log('Setting auth status in header to:', authenticated);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed in header:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('Header auth check completed, loading set to false');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    console.log('Logout clicked, calling API...');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        console.log('Logout successful, redirecting to home');
        // Clear any local state and redirect to home
        setIsAuthenticated(false);
        window.location.href = '/';
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  console.log('Header render - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              PhotoPort
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/portfolio" className="text-gray-700 hover:text-blue-600 transition-colors">Portfolio</Link></li>
              <li><Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link></li>
              
              {!loading && isAuthenticated && (
                <>
                  <li>
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="space-y-3">
              <li><Link href="/" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/portfolio" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Portfolio</Link></li>
              <li><Link href="/blog" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
              <li><Link href="/contact" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
              
              {!loading && (
                isAuthenticated ? (
                  <>
                    <li><Link href="/dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                    <li>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block text-gray-700 hover:text-blue-600 transition-colors font-medium w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : null // Don't show login link for mobile
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
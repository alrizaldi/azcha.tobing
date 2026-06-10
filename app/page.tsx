'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import GalleryGrid from '@/components/portfolio/GalleryGrid';
import TestimonialCarousel from '@/components/portfolio/TestimonialCarousel';

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface Testimonial {
  id: string;
  clientName: string;
  content: string;
  rating: number;
}

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockPhotos: Photo[] = [
      {
        id: '1',
        title: 'Mountain Landscape',
        description: 'Beautiful mountain landscape at sunset',
        imageUrl: '/images/placeholder-landscape.jpg', // Updated path
        category: 'landscape'
      },
      {
        id: '2',
        title: 'Portrait Session',
        description: 'Professional portrait session',
        imageUrl: '/images/placeholder-portrait.jpg', // Updated path
        category: 'portrait'
      },
      {
        id: '3',
        title: 'Wedding Ceremony',
        description: 'Candid wedding ceremony moment',
        imageUrl: '/images/placeholder-wedding.jpg', // Updated path
        category: 'wedding'
      },
      {
        id: '4',
        title: 'Street Photography',
        description: 'Urban street photography',
        imageUrl: '/images/placeholder-street.jpg', // Updated path
        category: 'street'
      }
    ];
    
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        clientName: 'John Doe',
        content: 'Absolutely amazing work! Captured our special day perfectly.',
        rating: 5
      },
      {
        id: '2',
        clientName: 'Jane Smith',
        content: 'Professional, creative, and delivered stunning photos.',
        rating: 5
      }
    ];
    
    setPhotos(mockPhotos);
    setFeaturedPhotos(mockPhotos.slice(0, 4));
    setTestimonials(mockTestimonials);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-black/70 to-black/50">
          <div className="absolute inset-0 overflow-hidden">
            <Image 
              src="/images/hero-bg.jpg" // Updated path
              alt="Photography Hero"
              layout="fill"
              objectFit="cover"
              quality={100}
              onError={(e) => {
                // Fallback to a generic image if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Capturing Life's Beautiful Moments
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Professional photography services specializing in weddings, portraits, and landscapes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                View Portfolio
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                Contact Me
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600">150+</div>
                <div className="text-gray-600 mt-2">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">5+</div>
                <div className="text-gray-600 mt-2">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600 mt-2">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600 mt-2">Photos Taken</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Work</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A selection of my finest photographs showcasing various styles and subjects
              </p>
            </div>
            
            <GalleryGrid photos={featuredPhotos} />
            
            <div className="text-center mt-8">
              <Link href="/portfolio" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional photography services tailored to your needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wedding Photography</h3>
                <p className="text-gray-600">
                  Capture every precious moment of your special day with professional wedding photography services.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Portrait Sessions</h3>
                <p className="text-gray-600">
                  Professional portrait sessions for individuals, families, and corporate headshots.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Coverage</h3>
                <p className="text-gray-600">
                  Document your special events, parties, and celebrations with professional event photography.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                What my clients say about working with me
              </p>
            </div>
            
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
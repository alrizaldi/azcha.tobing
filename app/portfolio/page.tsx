"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import GalleryGrid from "@/components/portfolio/GalleryGrid";
import CategoryFilter from "@/components/portfolio/CategoryFilter";
import Lightbox from "@/components/portfolio/Lightbox";

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const categories = [
  "all",
  "landscape",
  "portrait",
  "wedding",
  "street",
  "nature",
];

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gallery/public?limit=50");
        if (response.ok) {
          const data = await response.json();
          const photos = data.data || [];
          setPhotos(photos);
          setFilteredPhotos(photos);
        } else {
          // Fallback to placeholder data if API fails
          const fallbackPhotos: Photo[] = [
            {
              id: "1",
              title: "Mountain Landscape",
              description: "Beautiful mountain landscape at sunset",
              imageUrl: "https://via.placeholder.com/400x300?text=Landscape",
              category: "landscape",
            },
            {
              id: "2",
              title: "Portrait Session",
              description: "Professional portrait session",
              imageUrl: "https://via.placeholder.com/400x300?text=Portrait",
              category: "portrait",
            },
            {
              id: "3",
              title: "Wedding Ceremony",
              description: "Candid wedding ceremony moment",
              imageUrl: "https://via.placeholder.com/400x300?text=Wedding",
              category: "wedding",
            },
            {
              id: "4",
              title: "Street Photography",
              description: "Urban street photography",
              imageUrl: "https://via.placeholder.com/400x300?text=Street",
              category: "street",
            },
            {
              id: "5",
              title: "Nature Scene",
              description: "Peaceful nature scene with lake",
              imageUrl: "https://via.placeholder.com/400x300?text=Nature",
              category: "nature",
            },
            {
              id: "6",
              title: "Beach Sunset",
              description: "Spectacular beach sunset",
              imageUrl: "https://via.placeholder.com/400x300?text=Sunset",
              category: "landscape",
            },
            {
              id: "7",
              title: "Family Portrait",
              description: "Happy family portrait session",
              imageUrl: "https://via.placeholder.com/400x300?text=Family",
              category: "portrait",
            },
            {
              id: "8",
              title: "Cityscape",
              description: "Modern city skyline at night",
              imageUrl: "https://via.placeholder.com/400x300?text=Cityscape",
              category: "street",
            },
          ];
          setPhotos(fallbackPhotos);
          setFilteredPhotos(fallbackPhotos);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
        // Fallback to placeholder data on error
        const fallbackPhotos: Photo[] = [
          {
            id: "1",
            title: "Mountain Landscape",
            description: "Beautiful mountain landscape at sunset",
            imageUrl: "https://via.placeholder.com/400x300?text=Landscape",
            category: "landscape",
          },
          {
            id: "2",
            title: "Portrait Session",
            description: "Professional portrait session",
            imageUrl: "https://via.placeholder.com/400x300?text=Portrait",
            category: "portrait",
          },
          {
            id: "3",
            title: "Wedding Ceremony",
            description: "Candid wedding ceremony moment",
            imageUrl: "https://via.placeholder.com/400x300?text=Wedding",
            category: "wedding",
          },
          {
            id: "4",
            title: "Street Photography",
            description: "Urban street photography",
            imageUrl: "https://via.placeholder.com/400x300?text=Street",
            category: "street",
          },
          {
            id: "5",
            title: "Nature Scene",
            description: "Peaceful nature scene with lake",
            imageUrl: "https://via.placeholder.com/400x300?text=Nature",
            category: "nature",
          },
          {
            id: "6",
            title: "Beach Sunset",
            description: "Spectacular beach sunset",
            imageUrl: "https://via.placeholder.com/400x300?text=Sunset",
            category: "landscape",
          },
          {
            id: "7",
            title: "Family Portrait",
            description: "Happy family portrait session",
            imageUrl: "https://via.placeholder.com/400x300?text=Family",
            category: "portrait",
          },
          {
            id: "8",
            title: "Cityscape",
            description: "Modern city skyline at night",
            imageUrl: "https://via.placeholder.com/400x300?text=Cityscape",
            category: "street",
          },
        ];
        setPhotos(fallbackPhotos);
        setFilteredPhotos(fallbackPhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(
        photos.filter((photo) => photo.category === selectedCategory),
      );
    }
  }, [selectedCategory, photos]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore my collection of photography work spanning various genres
            and styles
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <GalleryGrid
            photos={filteredPhotos}
            onPhotoClick={handlePhotoClick}
          />
        )}
      </main>

      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={closeLightbox} />
      )}

      <Footer />
    </div>
  );
}

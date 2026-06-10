import Image from 'next/image';
import PhotoCard from './PhotoCard';

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface GalleryGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export default function GalleryGrid({ photos, onPhotoClick }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard 
          key={photo.id} 
          photo={photo} 
          onClick={() => onPhotoClick && onPhotoClick(photo)} 
        />
      ))}
    </div>
  );
}
// components/VideoCard.tsx
import { useState } from 'react';
import Image from 'next/image';

// Type local pour les vidéos
interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
 
const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Formats possibles d'URL YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    // Ajout des paramètres origin et enablejsapi pour améliorer la compatibilité
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1`;
  }
  
  return url;
};
 
  const startVideo = (): void => {
    setIsPlaying(true);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white mb-5">
      {!isPlaying ? (
        // Affichage de la miniature
        <div className="relative w-full pb-[56.25%] cursor-pointer" onClick={startVideo}>
          {video.thumbnailUrl ? (
            <img 
              src={video.thumbnailUrl}
              alt={video.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold">
              <span>{video.title}</span>
            </div>
          )}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
            aria-label="Lire la vidéo"
          >
            <svg viewBox="0 0 24 24" width="64" height="64">
              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
              <path d="M10 8l6 4-6 4V8z" fill="white" />
            </svg>
          </button>
        </div>
      ) : (
        // Affichage de la vidéo
        <div className="relative w-full pb-[56.25%]">
          {video.videoUrl ? (
            <iframe
              src={getYoutubeEmbedUrl(video.videoUrl) || undefined}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            ></iframe>
          ) : (
            <div className="absolute w-full h-full flex items-center justify-center bg-gray-100 text-gray-600">
              Aucune vidéo disponible
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <h3 className="mt-0 mb-2 text-lg font-semibold">{video.title}</h3>
        {video.description && <p className="text-gray-600 text-sm mb-2">{video.description}</p>}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
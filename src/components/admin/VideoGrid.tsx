// components/VideoGrid.tsx
import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';

// Type local pour les vidéos (car IVideo importe Document de mongoose qui n'est pas valide côté client)
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

interface VideoGridProps {
  category?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ category }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      
      try {
        // Construire l'URL en fonction de la présence d'une catégorie
        let url = '/api/videos';
        if (category) {
          url = `/api/videos/category/${encodeURIComponent(category)}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de la récupération des vidéos');
        }
        
        setVideos(result.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des vidéos:', err);
        setError('Impossible de charger les vidéos');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, [category]);

  if (loading) {
    return <div>Chargement des vidéos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (videos.length === 0) {
    return <div>
      {category 
        ? `Aucune vidéo disponible dans la catégorie "${category}"`
        : 'Aucune vidéo disponible'}
    </div>;
  }

  return (
    <div>
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
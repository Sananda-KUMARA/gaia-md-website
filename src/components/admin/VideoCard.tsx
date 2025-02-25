// components/VideoCard.tsx
import { useState } from 'react';
import Image from 'next/image';

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

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Fonction pour extraire l'ID YouTube si c'est une URL YouTube
  const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // Formats possibles d'URL YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url; // Retourne l'URL originale si ce n'est pas YouTube
  };
  
  const startVideo = (): void => {
    setIsPlaying(true);
  };

  return (
    <div className={styles.videoCard}>
      {!isPlaying ? (
        <div className={styles.thumbnailContainer}>
          {video.thumbnailUrl ? (
            <Image 
              src={video.thumbnailUrl} 
              alt={video.title}
              layout="fill"
              objectFit="cover"
              className={styles.thumbnail}
            />
          ) : (
            <div className={styles.placeholderThumb}>
              <span>{video.title}</span>
            </div>
          )}
          <button 
            className={styles.playButton}
            onClick={startVideo}
            aria-label="Lire la vidéo"
          >
            <svg viewBox="0 0 24 24" width="64" height="64">
              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
              <path d="M10 8l6 4-6 4V8z" fill="white" />
            </svg>
          </button>
        </div>
      ) : (
        <div className={styles.videoContainer}>
          <iframe
            src={getYoutubeEmbedUrl(video.videoUrl)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
          ></iframe>
        </div>
      )}
      <div className={styles.videoInfo}>
        <h3>{video.title}</h3>
        {video.description && <p>{video.description}</p>}
        {video.tags && video.tags.length > 0 && (
          <div className={styles.tags}>
            {video.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
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
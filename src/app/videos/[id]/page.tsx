// src/app/videos/[id]/page.tsx
import { notFound } from 'next/navigation';

async function getVideo(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/api/videos/${id}`, {
      next: { revalidate: 60 } // Revalider chaque minute
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    return null;
  }
}

// Fonction utilitaire pour extraire l'ID YouTube
function getYoutubeVideoId(url: string): string {
  try {
    // Pour les URL au format youtu.be (court)
    if (url.includes('youtu.be')) {
      return url.split('/').pop() || '';
    }
    // Pour les URL complètes avec paramètre v
    else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v') || '';
    }
    // Cas où l'ID est déjà fourni
    else {
      return url;
    }
  } catch (e) {
    return url; // Retourne l'URL d'origine en cas d'erreur
  }
}

interface VideoPageProps {
  params: { id: string }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideo(params.id);
 
  if (!video) {
    notFound();
  }
 
  const youtubeId = getYoutubeVideoId(video.videoUrl);
 
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <div className="relative pb-[56.25%] h-0 overflow-hidden mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          title={video.title}
        />
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="whitespace-pre-line">{video.description}</p>
      </div>
      <div className="mt-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
          {video.category}
        </span>
        {Array.isArray(video.tags) && video.tags.map(tag => (
          <span key={tag} className="bg-gray-100 px-2 py-1 rounded mr-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
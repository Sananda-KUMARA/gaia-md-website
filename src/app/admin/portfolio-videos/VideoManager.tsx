'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// Interface pour les données vidéo
interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface pour le formulaire de vidéo
interface VideoForm {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string;
  active: boolean;
}

// Fonction pour extraire l'ID YouTube d'une URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Patterns pour les différents formats d'URL YouTube
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^/?]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Fonction pour générer l'URL de la miniature YouTube
const getYouTubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`; // "0.jpg" est la miniature haute qualité
};

// Composant pour l'image avec état de chargement
const ThumbnailImage = ({ src, alt }: { src: string, alt: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="w-20 h-12 relative">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-20 h-12 object-cover rounded ${imageLoaded ? 'block' : 'invisible'}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)}
      />
    </div>
  );
};

const VideoManager: React.FC = () => {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<VideoForm>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    tags: '',
    active: true
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isYouTubeVideo, setIsYouTubeVideo] = useState<boolean>(false);

  // Récupérer les vidéos
  const fetchVideos = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erreur lors de la récupération des vidéos');
      }
      
      const result = await response.json();
      setVideos(result.data || result);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Charger les vidéos au chargement du composant
  useEffect(() => {
    if (status === 'authenticated') {
      fetchVideos();
    }
  }, [status]);

  // Détecter si l'URL est YouTube et mettre à jour la miniature
  useEffect(() => {
    const youtubeId = extractYouTubeId(currentVideo.videoUrl);
    const isYoutube = !!youtubeId;
    
    setIsYouTubeVideo(isYoutube);
    
    if (isYoutube) {
      const thumbnailUrl = getYouTubeThumbnailUrl(youtubeId);
      setCurrentVideo(prev => ({
        ...prev,
        thumbnailUrl: thumbnailUrl
      }));
    }
  }, [currentVideo.videoUrl]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentVideo(prev => ({ ...prev, [name]: value }));
  };
  
  // Gérer spécifiquement le changement d'URL de miniature
  const handleThumbnailUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Seulement si ce n'est pas une vidéo YouTube, sinon la miniature est automatique
    if (!isYouTubeVideo) {
      handleChange(e);
    }
  };

  // Gérer le changement du switch active
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVideo(prev => ({ ...prev, active: e.target.checked }));
  };

  // Ouvrir le modal pour ajouter une nouvelle vidéo
  const handleAddNew = () => {
    setCurrentVideo({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: '',
      tags: '',
      active: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour éditer une vidéo existante
  const handleEdit = (video: VideoData) => {
    setCurrentVideo({
      _id: video._id,
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      category: video.category || '',
      tags: video.tags ? video.tags.join(', ') : '',
      active: video.active
    });
    
    // Vérifier si c'est une vidéo YouTube
    setIsYouTubeVideo(!!extractYouTubeId(video.videoUrl));
    
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Enregistrer une vidéo (création ou mise à jour)
  const handleSave = async () => {
    try {
      // Convertir les tags de chaîne en tableau
      const tagsArray = currentVideo.tags
        ? currentVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const videoData = {
        ...currentVideo,
        tags: tagsArray
      };
      
      const url = isEditing ? `/api/videos/${currentVideo._id}` : '/api/videos';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Erreur lors de ${isEditing ? 'la mise à jour' : 'la création'} de la vidéo`);
      }
      
      await fetchVideos();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    }
  };

  // Supprimer une vidéo
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      try {
        const response = await fetch(`/api/videos/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Erreur lors de la suppression de la vidéo');
        }
        
        await fetchVideos();
      } catch (err) {
        console.error('Erreur de suppression:', err);
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMessage);
      }
    }
  };

  // Filtrer les vidéos en fonction du terme de recherche
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.category && video.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="w-full">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher des vidéos..."
            className="w-full sm:max-w-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={handleAddNew}
          >
            Ajouter une vidéo
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des vidéos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miniature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 px-6 text-gray-500">
                      {searchTerm 
                        ? 'Aucune vidéo trouvée pour cette recherche' 
                        : 'Aucune vidéo disponible. Commencez par en ajouter une !'}
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video) => (
                    <tr key={video._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {video.thumbnailUrl ? (
                          <ThumbnailImage 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                          />
                        ) : (
                          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            Aucune
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 max-w-xs truncate">
                          {video.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {video.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          video.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {video.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            onClick={() => handleEdit(video)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                            onClick={() => handleDelete(video._id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Modal pour ajouter/éditer une vidéo */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black" >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Modifier la vidéo' : 'Ajouter une nouvelle vidéo'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Titre *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentVideo.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                    URL de la vidéo *
                  </label>
                  <input
                    id="videoUrl"
                    name="videoUrl"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentVideo.videoUrl}
                    onChange={handleChange}
                    required
                  />
                  {isYouTubeVideo && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Vidéo YouTube détectée - miniature automatiquement récupérée
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="thumbnailUrl" className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>URL de la miniature {isYouTubeVideo && <span className="text-xs text-gray-500">(générée automatiquement)</span>}</span>
                    {currentVideo.thumbnailUrl && (
                      <button 
                        type="button"
                        className="text-xs text-blue-500 hover:text-blue-700"
                        onClick={() => window.open(currentVideo.thumbnailUrl, '_blank')}
                      >
                        Aperçu
                      </button>
                    )}
                  </label>
                  <input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    type="text"
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isYouTubeVideo ? 'bg-gray-100' : ''}`}
                    value={currentVideo.thumbnailUrl}
                    onChange={handleThumbnailUrlChange}
                    readOnly={isYouTubeVideo}
                    disabled={isYouTubeVideo}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentVideo.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Catégorie
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentVideo.category}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      id="tags"
                      name="tags"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentVideo.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={currentVideo.active}
                    onChange={handleSwitchChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">
                    Vidéo active
                  </label>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={handleSave}
                >
                  {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManager;
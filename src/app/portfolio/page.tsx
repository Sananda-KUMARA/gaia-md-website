'use client'

import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Définition actualisée pour correspondre à votre API
type Video = {
  id: string;
  title: string;
  description: string;
  video?: string; 
  youtubeId?: string;
  category: string;
  isYouTube?: boolean;
  thumbnailUrl?: string;
}

const Portfolio: NextPage = () => {
  // État pour stocker tous les projets et la catégorie sélectionnée
  const [videoProjects, setVideoProjects] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer les projets depuis MongoDB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/videos');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des vidéos ...');
        }
        
        const data = await response.json();
        console.log('Données reçues de l\'API:', data);
        
        // Transformer les données pour les rendre compatibles avec notre interface Video
        const transformVideoData = (apiData: any): Video[] => {
          // Vérifier si l'API a un tableau 'data' ou si c'est directement un tableau
          const videos = apiData.data || apiData;
          
          if (!Array.isArray(videos)) {
            console.error("Impossible de trouver un tableau de vidéos dans la réponse", apiData);
            return [];
          }
          
          return videos.map(item => {
            // Extraire l'ID YouTube de l'URL si disponible
            let youtubeId = null;
            let isYouTube = false;
            
            if (item.videoUrl) {
              // Extraire l'ID YouTube de différents formats d'URL possibles
              const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
              const match = item.videoUrl.match(youtubeRegex);
              
              if (match && match[1]) {
                youtubeId = match[1];
                isYouTube = true;
              }
            }
            
            // Créer un objet compatible avec notre interface Video
            return {
              id: item._id || String(Math.random()),
              title: item.title || "Sans titre",
              description: item.description || "",
              video: !isYouTube ? item.videoUrl : undefined,
              youtubeId: youtubeId,
              category: item.category || "Non classé",
              isYouTube: isYouTube,
              thumbnailUrl: item.thumbnailUrl
            };
          });
        };
        
        const transformedVideos = transformVideoData(data);
        
        if (transformedVideos.length > 0) {
          setVideoProjects(transformedVideos);
          setError(null);
        } else {
          console.warn('Aucune vidéo trouvée dans la réponse:', data);
          setVideoProjects([]);
          setError('Aucune vidéo trouvée');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des vidéos:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  // Extraire toutes les catégories uniques
  const categories = Array.isArray(videoProjects) 
    ? Array.from(new Set(videoProjects.map(video => video.category))) 
    : [];
  
  // Filtrer les projets selon la catégorie sélectionnée
  const filteredVideos = Array.isArray(videoProjects) 
    ? (selectedCategory 
        ? videoProjects.filter(video => video.category === selectedCategory) 
        : videoProjects)
    : [];

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.9
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.25)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }
    }
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-3xl font-bold text-center mb-8 text-black">Notre Portfolio</h1>
          
          {/* Barre de filtres par catégorie avec animation */}
          <motion.div 
            className="flex flex-wrap justify-center mb-8 gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            <motion.button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${selectedCategory === null 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setSelectedCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Tous
            </motion.button>
            
            {categories.map((category) => (
              <motion.button 
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedCategory === category 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
          
          {/* Affichage des vidéos filtrées avec animation */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video) => (
                <motion.div
                  layout
                  key={video.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative aspect-video">
                    {video.isYouTube && video.youtubeId ? (
                      <div className="relative w-full h-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&controls=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                    ) : video.video ? (
                      <video 
                        src={video.video} 
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <p className="text-gray-500">Vidéo non disponible</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">
                        {video.category}
                      </span>
                      {video.isYouTube && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
                          YouTube
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-gray-600">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Message si aucun projet ne correspond au filtre */}
          {filteredVideos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-12 col-span-full"
            >
              <p className="text-gray-500 text-lg">Aucun projet ne correspond à cette catégorie.</p>
            </motion.div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Portfolio;
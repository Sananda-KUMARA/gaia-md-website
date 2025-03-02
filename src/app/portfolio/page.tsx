'use client'

import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search } from 'lucide-react'; // Import de l'icône de recherche

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
  const [searchQuery, setSearchQuery] = useState<string>(''); // Nouvel état pour la recherche par titre
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
  
  // Filtrer les projets selon la catégorie sélectionnée ET la recherche par titre
  const filteredVideos = Array.isArray(videoProjects) 
    ? videoProjects.filter(video => {
        // Filtre par catégorie
        const categoryMatch = selectedCategory ? video.category === selectedCategory : true;
        
        // Filtre par titre (recherche insensible à la casse)
        const titleMatch = searchQuery 
          ? video.title.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        // Retourner seulement les vidéos qui correspondent aux deux filtres
        return categoryMatch && titleMatch;
      })
    : [];

  // Gérer la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

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
      <div className="bg-[url('/photos/background_portfolio.png')] bg-cover bg-center bg-no-repeat min-h-screen bg-opacity-10">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-3xl font-bold text-center mb-8 text-black">Notre Portfolio </h1>
            {/* Affichage des résultats du filtre */}
          {filteredVideos.length > 0 ? (
            <p className="text-center mb-6 text-gray-900">
              {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} trouvée{filteredVideos.length > 1 ? 's' : ''}
              {searchQuery && <span> contenant "<strong>{searchQuery}</strong>"</span>}
              {selectedCategory && <span> dans la catégorie <strong>{selectedCategory}</strong></span>}
            </p>
          ) : null}
          
          {/* Barre de filtres et recherche */}
          <div className="mb-8">
          
            {/* Barre de recherche */}
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par titre..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={resetFilters}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </motion.div>
            
            {/* Boutons de filtres par catégorie */}
            <motion.div 
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.1
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
          </div>
          
          
          
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
                  className="bg-white rounded-lg shadow-lg overflow-hidden text-black"
                >
                  <div className="relative aspect-video" >
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
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <p className="text-gray-500 text-black">Vidéo non disponible</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2 text-black">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded text-black">
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
          
          {/* Message si aucun projet ne correspond aux filtres */}
          {filteredVideos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-12 col-span-full"
            >
              <p className="text-gray-500 text-lg">
                Aucun projet ne correspond à vos critères de recherche.
                {searchQuery && <span> Essayez de modifier votre recherche "<strong>{searchQuery}</strong>".</span>}
                {selectedCategory && <span> Essayez une autre catégorie que "<strong>{selectedCategory}</strong>".</span>}
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Portfolio;
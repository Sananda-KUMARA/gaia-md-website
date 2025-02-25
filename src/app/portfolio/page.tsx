'use client'

import type { NextPage } from 'next'
import { useState } from 'react'
import Video from 'next-video';
import { motion, AnimatePresence } from 'framer-motion';
import { YouTubeEmbed } from '@next/third-parties/google';
// Importation des vidéos
import video1 from '../../../videos/video1.mp4';
import video2 from '../../../videos/video2.mp4';
import video3 from '../../../videos/video3.mp4';
import video4 from '../../../videos/video4.mp4';
import video5 from '../../../videos/video5.mp4';
import Header from '@/components/homePage/Header';
import Footer from '@/components/homePage/Footer';

type VideoProject = {
  id: number;
  title: string;
  description: string;
  video?: typeof video1 | string; // Vidéo locale (optionnelle pour YouTube)
  youtubeId?: string; // ID YouTube (optionnel pour les vidéos locales)
  category: string;
  isYouTube?: boolean; // Propriété pour identifier les vidéos YouTube
}

// Ajout des catégories aux projets vidéo avec un mélange de vidéos locales et YouTube
const videoProjects: VideoProject[] = [
  {
    id: 1,
    title: "Projet 1",
    description: "Description du projet 1",
    video: video1,
    category: "Entreprise"
  },
  {
    id: 2,
    title: "Projet 2",
    description: "Description du projet 2",
    video: video2,
    category: "Événement"
  },
  {
    id: 3,
    title: "Projet 3",
    description: "Description du projet 3",
    video: video3,
    category: "Entreprise"
  },
  {
    id: 4,
    title: "Projet 4",
    description: "Description du projet 4",
    video: video4,
    category: "Produit"
  },
  {
    id: 5,
    title: "Projet 5",
    description: "Description du projet 5",
    video: video5,
    category: "Événement"
  },
  // Vidéos YouTube
  {
    id: 6,
    title: "Vidéo YouTube 1",
    description: "Description de la vidéo YouTube 1",
    video: "", // Valeur vide pour respecter le type
    youtubeId: "dQw4w9WgXcQ", // Exemple d'ID YouTube
    category: "YouTube",
    isYouTube: true
  },
  {
    id: 7,
    title: "Vidéo YouTube 2",
    description: "Description de la vidéo YouTube 2",
    video: "", // Valeur vide pour respecter le type
    youtubeId: "9bZkp7q19f0", // Exemple d'ID YouTube
    category: "YouTube",
    isYouTube: true
  },
  {
    id: 8,
    title: "Vidéo YouTube 3",
    description: "Tutoriel vidéo",
    video: "", // Valeur vide pour respecter le type
    youtubeId: "jNQXAC9IVRw", // Exemple d'ID YouTube
    category: "Tutoriel",
    isYouTube: true
  }
];

const Portfolio: NextPage = () => {
  // État pour stocker la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extraire toutes les catégories uniques
  const categories = Array.from(new Set(videoProjects.map(project => project.category)));
  
  // Filtrer les projets selon la catégorie sélectionnée
  const filteredProjects = selectedCategory 
    ? videoProjects.filter(project => project.category === selectedCategory) 
    : videoProjects;

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

  return (
    <>
      <div className="bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-3xl font-bold text-center mb-8">Notre Portfolio</h1>
          
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
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative aspect-video">
                    {project.isYouTube ? (
                      // Utilisation de YouTubeEmbed pour les vidéos YouTube
                      <YouTubeEmbed 
                        videoid={project.youtubeId || ""}
                        height={225}
                        params="controls=1&rel=0"
                      />
                    ) : (
                      // Vidéos locales avec next-video
                      <Video
                        src={project.video}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">
                        {project.category}
                      </span>
                      {project.isYouTube && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">
                          YouTube
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Message si aucun projet ne correspond au filtre */}
          {filteredProjects.length === 0 && (
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
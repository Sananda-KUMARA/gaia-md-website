
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Images d'exemple (remplacez par vos propres images)
  const images = [
    { id: 1, src: "/photos/african-video-editor-working-with-footage-and-soun-2025-02-20-07-16-08-utc.jpg", alt: "Image 1", caption: "" },
    { id: 2, src: "/photos/artist-pointing-at-musical-sheet-notation-to-expla-2025-02-20-00-23-57-utc.jpg", alt: "Image 2", caption: "" },
    { id: 3, src: "/photos/behind-the-scenes-2023-11-27-05-37-23-utc.jpg", alt: "Image 3", caption: "" },
    { id: 4, src: "/photos/camera-at-a-live-media-conference-2024-10-18-14-07-51-utc.jpg", alt: "Image 3", caption: "" },
    { id: 5, src: "/photos/colorist-examining-script-at-office-2023-11-27-05-28-16-utc.jpg", alt: "Image 5", caption: "" },
    { id: 6, src: "/photos/man-using-computer-with-photo-editing-software-2023-11-27-05-01-30-utc.png", alt: "Image 6", caption: "" },
    { id: 7, src: "/photos/two-photographers-working-on-the-computers-in-the-2023-11-27-04-58-01-utc.jpg", alt: "Image 7", caption: "" },
    { id: 8, src: "/photos/young-musician-or-producer-showing-african-man-gro-2023-11-27-05-29-14-utc.png", alt: "Image 8", caption: "" },
    { id: 9, src: "/photos/photo-studio-with-lighting-equipment-and-fan-2024-11-17-15-41-34-utc.jpg", alt: "Image 9", caption: "" },
  ];

 // Note: Pour que Next.js optimise les images externes, ajoutez-les à next.config.js:
  /*
  module.exports = {
    images: {
      domains: ['votredomaine.com', 'autredomaine.com'],
    },
  }
  */

  // Navigation vers l'image précédente
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  // Navigation vers l'image suivante
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Navigation vers une image spécifique
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
    }
  };

  // Défilement automatique
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Changement d'image toutes les 5 secondes
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [images.length]);

  // Réinitialisation de l'état de transition une fois l'animation terminée
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Durée de l'animation en ms
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Gestion des interactions tactiles
  useEffect(() => {
    const carousel = carouselRef.current;
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      // Seuil de détection du swipe
      const swipeThreshold = 50;
      
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe vers la gauche - image suivante
        nextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe vers la droite - image précédente
        prevSlide();
      }
    };

    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
      carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden mt-28" ref={carouselRef}>
      {/* Conteneur principal du carousel
          - relative: pour positionner les éléments enfants en absolute
          - w-full: prend 100% de la largeur disponible
          - max-w-full: ne dépasse jamais la largeur de son parent
          - mx-auto: centré horizontalement
          - overflow-hidden: masque tout ce qui dépasse */}
      
      <div className="relative h-80 md:h-128 lg:h-160 xl:h-192 2xl:h-screen overflow-hidden">
      {/* Conteneur des slides
            - relative: pour le positionnement des images
            - h-64: hauteur de 16rem sur mobile
            - md:h-96: hauteur de 24rem sur tablette et plus
            - overflow-hidden: masque les images qui dépassent */}
        
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 translate-x-0' 
                : index < currentIndex 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
            /* Classes pour chaque slide:
              - absolute: positionnement absolu dans le conteneur
              - w-full h-full: occupe tout l'espace du parent
              - transition-all duration-500 ease-in-out: animation douce
              - opacity et translate conditionnels:
                  - slide active: visible et centrée
                  - slides précédentes: masquées et décalées à gauche
                  - slides suivantes: masquées et décalées à droite */
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
              className="object-cover"
              /* Le composant Image de Next.js:
                - fill: remplit tout le conteneur parent
                - sizes: aide Next.js à optimiser la taille des images selon l'écran
                - priority: charge en priorité la première image
                - object-cover: redimensionne l'image pour couvrir tout l'espace */
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
              {/* Légende de l'image
                  - absolute bottom-0 left-0 right-0: fixé en bas et s'étend sur toute la largeur
                  - bg-black bg-opacity-50: fond noir semi-transparent
                  - text-white: texte blanc
                  - p-2: padding de 0.5rem
                  - text-center: texte centré */}
              {image.caption}
            </div>
          </div>
        ))}
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Image précédente"
        /* Classes du bouton précédent:
          - absolute: positionnement absolu
          - left-2: 0.5rem depuis la gauche
          - top-1/2 -translate-y-1/2: centré verticalement
          - bg-black bg-opacity-50: fond noir semi-transparent
          - text-white: icône blanche
          - p-2: padding de 0.5rem
          - rounded-full: entièrement arrondi (cercle)
          - hover:bg-opacity-75: plus opaque au survol
          - focus:outline-none: pas de bordure au focus */
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        aria-label="Image suivante"
        /* Classes du bouton suivant:
          - absolute: positionnement absolu
          - right-2: 0.5rem depuis la droite
          - autres classes identiques au bouton précédent */
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {/* Conteneur des indicateurs:
            - absolute bottom-4: 1rem depuis le bas
            - left-1/2 transform -translate-x-1/2: centré horizontalement
            - flex: disposition en ligne
            - space-x-2: espace de 0.5rem entre les indicateurs */}
        
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
            /* Classes pour chaque indicateur:
              - w-3 h-3: largeur et hauteur de 0.75rem
              - rounded-full: entièrement arrondi (cercle)
              - focus:outline-none: pas de bordure au focus
              - bg-white: blanc pour l'indicateur actif
              - bg-white bg-opacity-50: blanc semi-transparent pour les autres */
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
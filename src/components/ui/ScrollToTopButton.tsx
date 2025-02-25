'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fonction pour vérifier la position de défilement
  const checkScrollPosition = () => {
    // Affiche le bouton quand l'utilisateur a défilé de 300px
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300);
  };

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Animation de défilement fluide
    });
  };

  useEffect(() => {
    // Ajoute l'écouteur d'événement au montage du composant
    window.addEventListener('scroll', checkScrollPosition);
    
    // Nettoie l'écouteur d'événement lors du démontage
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  return (
    <button
      className={`fixed z-50 p-3 bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
        isVisible ? 'opacity-100 right-6 bottom-6' : 'opacity-0 right-6 bottom-6 pointer-events-none'
      }`}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
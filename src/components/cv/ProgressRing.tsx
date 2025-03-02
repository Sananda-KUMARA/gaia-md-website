import React, { useState, useEffect, useRef } from 'react';

// Mappage des couleurs pour contourner les limitations de Tailwind
const COLOR_VARIANTS = {
  green: { stroke: 'stroke-green-900', text: 'text-green-800' },
  blue: { stroke: 'stroke-blue-900', text: 'text-blue-800' },
  gray: { stroke: 'stroke-gray-900', text: 'text-gray-800' },
  red: { stroke: 'stroke-red-900', text: 'text-red-800' },
  orange: { stroke: 'stroke-orange-900', text: 'text-orange-500' }
};



// Types pour le composant ProgressRing
export interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // Rendre 'progress' obligatoire
  primaryColor?: 'green' | 'blue' | 'gray' | 'red' | 'orange' ;
  backgroundColor?: 'green' | 'blue' | 'gray' | 'red'| 'orange' ;
  animationDuration?: number;
  showPercentage?: boolean;
  resetOnHover?: boolean;
  resetDelay?: number;
}


const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 200,
  strokeWidth = 15,
  progress = 0,
  primaryColor = 'green',
  backgroundColor = 'gray',
  animationDuration = 2000,
  showPercentage = true,
  resetOnHover = true,
  resetDelay = 3000 // Délai avant réinitialisation (3 secondes)
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sécurisation du choix de couleur
  const colorVariant = COLOR_VARIANTS[primaryColor] || COLOR_VARIANTS.green;
  const bgColorVariant = COLOR_VARIANTS[backgroundColor] || COLOR_VARIANTS.gray;

  // Calculs géométriques
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  // Fonction d'animation
  const animateProgress = (startProgress: number, targetProgress: number, duration: number) => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const animationProgress = Math.min(elapsed / duration, 1);
     
      // Courbe d'animation personnalisée
      const easedProgress = animationProgress < 0.5
        ? 2 * animationProgress * animationProgress
        : -1 + (4 - 2 * animationProgress) * animationProgress;
     
      const currentProgress = startProgress + ((targetProgress - startProgress) * easedProgress);
      setAnimatedProgress(currentProgress);

      if (animationProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Effet principal pour l'animation de progression
  useEffect(() => {
    // Nettoyer les animations précédentes
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const targetProgress = Math.max(0, Math.min(100, progress));
    animateProgress(animatedProgress, targetProgress, animationDuration);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress, animationDuration]);

  // Gestion du survol et de la réinitialisation
  const handleMouseEnter = () => {
    if (!resetOnHover) return;
    
    setIsHovering(true);

    // Annuler le timer précédent s'il existe
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Programmer la réinitialisation
    timerRef.current = setTimeout(() => {
      // Réinitialiser à 0 avec animation
      animateProgress(animatedProgress, 0, animationDuration);
      setIsHovering(false);
    }, resetDelay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsHovering(false);
  };

  return (
    <div 
      className="relative flex items-center justify-center" 
      aria-label="Progress Ring"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="img"
        aria-hidden="true"
      >
        {/* Cercle d'arrière-plan */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          className={`${bgColorVariant.stroke}`}
        />
       
        {/* Cercle de progression */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className={`${colorVariant.text} transition-all duration-300 ease-in-out ${
            isHovering ? 'opacity-50' : 'opacity-100'
          }`}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Cercle intérieur avec pourcentage */}
      {showPercentage && (
        <div
          className={`absolute w-3/4 h-3/4 bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
            isHovering ? 'scale-90 opacity-70' : 'scale-100 opacity-100'
          }`}
        >
          <span className="text-2xl font-bold text-gray-700">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
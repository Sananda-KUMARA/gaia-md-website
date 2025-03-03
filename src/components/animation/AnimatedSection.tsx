// components/animations/AnimatedSection.tsx
import { ReactNode } from 'react';
import { motion, Variant } from 'framer-motion';

type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce';
type DirectionType = 'left' | 'right' | 'up' | 'down';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  direction?: DirectionType;
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedSection = ({
  children,
  animation = 'fade',
  direction = 'right',
  delay = 0,
  duration = 0.7,
  className = '',
}: AnimatedSectionProps): JSX.Element => {
  // Définir les animations
  const getAnimationVariants = (): {
    initial: Variant;
    whileInView: Variant;
    transition: any;
  } => {
    switch (animation) {
      case 'slide':
        return {
          initial: {
            opacity: 0,
            x: direction === 'left' ? -70 : direction === 'right' ? 70 : 0,
            y: direction === 'up' ? 70 : direction === 'down' ? -70 : 0,
          },
          whileInView: { opacity: 1, x: 0, y: 0 },
          transition: { 
            duration,
            delay, 
            ease: 'easeOut'
          },
        };
      
      case 'zoom':
        return {
          initial: { 
            opacity: 0, 
            scale: direction === 'up' ? 0.8 : 1.2 
          },
          whileInView: { opacity: 1, scale: 1 },
          transition: { 
            duration, 
            delay, 
            ease: 'easeOut'
          },
        };
        
      case 'flip':
        return {
          initial: { 
            opacity: 0, 
            rotateX: direction === 'up' || direction === 'down' ? 90 : 0,
            rotateY: direction === 'left' || direction === 'right' ? 90 : 0,
          },
          whileInView: { 
            opacity: 1, 
            rotateX: 0,
            rotateY: 0,
          },
          transition: { 
            duration, 
            delay, 
            ease: 'easeOut'
          },
        };
        
      case 'bounce':
        return {
          initial: {
            opacity: 0,
            x: direction === 'left' ? -70 : direction === 'right' ? 70 : 0,
            y: direction === 'up' ? 70 : direction === 'down' ? -70 : 0,
          },
          whileInView: { opacity: 1, x: 0, y: 0 },
          transition: { 
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay,
          },
        };

      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          transition: { duration, delay },
        };
    }
  };

  const animationProps = getAnimationVariants();

  return (
    <motion.div
      className={className}
      initial={animationProps.initial}
      whileInView={animationProps.whileInView}
      viewport={{ once: true, margin: '-50px' }}
      transition={animationProps.transition}
    >
      {children}
    </motion.div>
  );
};
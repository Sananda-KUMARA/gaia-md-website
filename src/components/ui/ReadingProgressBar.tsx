// components/layout/ReadingProgressBar.tsx
'use client'
import { useState, useEffect } from 'react';

export const ReadingProgressBar = (): JSX.Element => {
  const [progress, setProgress] = useState<number>(0);
  
  useEffect(() => {
    const updateProgress = (): void => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div 
      className="fixed left-0 w-full h-1 bg-transparent z-50" 
      style={{ top: 'var(--header-height, 80px)' }}
    >
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
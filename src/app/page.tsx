// app/page.tsx
'use client'
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { AnimatedSection } from '@/components/animation/AnimatedSection';
import HeroSection from '@/components/sections/HeroSection';
import LogoCloud from '@/components/sections/LogoCloud';
import TeamSection from '@/components/sections/TeamSection';
import BlogSection from '@/components/sections/BlogSection';
import Footer from '@/components/layout/Footer';

export default function Home(): JSX.Element {
  useEffect(() => {
    const updateHeaderHeight = (): void => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        document.documentElement.style.setProperty('--header-header', `${headerHeight}px`);
      }
    };
    
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">      
      <div className="relative">
        <Header />
        <ReadingProgressBar />
        
        {/* Section héro sans animation */}
          <AnimatedSection animation="slide" direction="down" className="my-8">
        <HeroSection />
        </AnimatedSection>
        
        {/* Logo Cloud avec animation de zoom */}
        <AnimatedSection animation="zoom" direction="up" className="my-8">
          <LogoCloud />
        </AnimatedSection>
        
        {/* Section équipe avec glissement latéral */}
        <AnimatedSection animation="slide" direction="left" className="my-8">
          <TeamSection />
        </AnimatedSection>
        
        {/* Section blog avec effet flip */}
        <AnimatedSection animation="flip" direction="right" delay={0.1} className="my-8">
          <BlogSection />
        </AnimatedSection>
        
        {/* Footer avec rebond */}
        <AnimatedSection animation="bounce" direction="up" delay={0.2} className="my-8">
          <Footer />
        </AnimatedSection>
      </div>
    </div>
  );
}
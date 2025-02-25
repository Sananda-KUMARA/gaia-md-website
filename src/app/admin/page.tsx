'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import VideoGrid from '../../components/admin/VideoGrid';
import CategoryFilter from '../../components/admin/CategoryFilter';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/videos/categories');
        const result = await response.json();
        
        if (response.ok) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    }
    
    fetchCategories();
  }, []);
  
  return (
    <div>
      <Head>
        <title>Portfolio Vidéo</title>
        <meta name="description" content="Portfolio de vidéos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Portfolio Vidéo</h1>
        
        <CategoryFilter categories={categories} />
        
        <section>
          <VideoGrid />
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Votre Nom</p>
      </footer>
    </div>
  );
};

export default Home;
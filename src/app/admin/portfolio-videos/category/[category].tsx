// pages/category/[category].tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import VideoGrid from '../../components/VideoGrid';
import CategoryFilter from '../../components/CategoryFilter';
import styles from '../../styles/Home.module.css';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;
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
  
  // Si la page est en cours de génération côté serveur ou la catégorie n'est pas encore disponible
  if (!category || typeof category !== 'string') {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{category} - Portfolio Vidéo</title>
        <meta name="description" content={`Vidéos dans la catégorie ${category}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{category}</h1>
        
        <CategoryFilter categories={categories} />
        
        <section className={styles.videoSection}>
          <VideoGrid category={category} />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Votre Nom</p>
      </footer>
    </div>
  );
};

export default CategoryPage;
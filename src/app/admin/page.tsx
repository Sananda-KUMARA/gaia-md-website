'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import VideoGrid from '../../components/admin/VideoGrid';
import CategoryFilter from '../../components/admin/CategoryFilter';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
 
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // On vérifie le rôle seulement si on est authentifié
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'admin') {
        router.push('/');
      }
    }
  }, [session, status, router]);

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
 
  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

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
    </div>
  );
}
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from 'next-sanity'; // Assurez-vous que next-sanity est installé

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Détection de l'environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl = isDevelopment 
    ? 'http://localhost:3000'
    : (process.env.NEXT_PUBLIC_DOMAIN || 'https://gaia.movie');
  
  console.log('Environnement:', process.env.NODE_ENV);
  console.log('Base URL utilisée pour le sitemap:', baseUrl);
  
  // Pages statiques
  const staticPages = [
    '',
    '/services',
    '/portfolio',
    '/team',
    '/blog',
    '/contact'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
  
  // Récupération des vidéos
  let videoPages: MetadataRoute.Sitemap = [];
  try {
    const videoResponse = await fetch(`${baseUrl}/api/videos`, { 
      next: { revalidate: 3600 }
    });
    
    if (videoResponse.ok) {
      const videos = await videoResponse.json();
      
      if (videos.data && Array.isArray(videos.data)) {
        videoPages = videos.data.map(video => ({
          url: `${baseUrl}/videos/${video._id}`,
          lastModified: new Date(video.updatedAt || video.createdAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos pour le sitemap:', error);
  }
  
  // Récupération des articles de blog de Sanity
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: false,
    });
    
    const blogs = await client.fetch(`*[_type == "post"] {
      slug,
      _updatedAt
    }`);
    
    if (Array.isArray(blogs)) {
      blogPages = blogs.map(blog => ({
        url: `${baseUrl}/blog/${blog.slug.current}`,
        lastModified: new Date(blog._updatedAt).toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des articles de blog:', error);
  }
  
  // Combinez toutes les pages
  return [...staticPages, ...videoPages, ...blogPages];
}
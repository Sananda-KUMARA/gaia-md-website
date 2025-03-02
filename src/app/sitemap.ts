// app/sitemap.ts
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic';  // Force un rendu côté serveur à chaque requête

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Utilisez le nouveau domaine
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://gaia.movie';
  
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
  
  // Pages dynamiques
  let dynamicPages: Array<{
    url: string;
    lastModified: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }> = [];
  
  // Cette partie s'exécutera à la demande (au moment où quelqu'un accède au sitemap)
  // et non pendant le build, ce qui évite l'erreur
  try {
    // Utilisez le domaine de base pour l'appel API
    const response = await fetch(`${baseUrl}/api/videos`, { 
      next: { revalidate: 3600 } // Revalider les données chaque heure
    });
    
    if (response.ok) {
      const videos = await response.json();
      
      if (videos.data && Array.isArray(videos.data)) {
        dynamicPages = videos.data.map(video => ({
          url: `${baseUrl}/videos/${video._id}`,
          lastModified: new Date(video.updatedAt || video.createdAt).toISOString(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour le sitemap:', error);
    // L'erreur n'empêchera pas la génération du sitemap de base
  }
  
  return [...staticPages, ...dynamicPages];
}
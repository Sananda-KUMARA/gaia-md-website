import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Utilisez la même variable d'environnement que pour le sitemap
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_DOMAIN || 'https://gaia.movie'
    : 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login/', '/admin/', '/private/'],
      },
      {
        userAgent: 'BadBot',
        disallow: ['/'],
      }
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
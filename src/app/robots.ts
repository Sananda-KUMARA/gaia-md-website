export default function robots() {
  const baseUrl = 'https://gaia.movie';

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
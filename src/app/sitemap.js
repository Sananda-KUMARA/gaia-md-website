export default async function sitemap() {
  // Utilisez le nouveau domaine
  const baseUrl = 'https://gaia.movie';
  
  // Pages statiques (cela fonctionne sans problème)
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
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
  
  // Pas d'appel API pour le moment
  // Nous nous contentons des pages statiques
  
  return staticPages;
}
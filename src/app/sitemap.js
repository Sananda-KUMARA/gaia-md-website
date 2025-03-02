export default async function sitemap() {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_DOMAIN
    : 'http://localhost:3000';

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
    lastModified: new Date(),
    changeFrequency: 'weekly', //- 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
    priority: route === '' ? 1 : 0.8, //valeur entre 0.0 et 1.0
  }));

  // Pour les pages dynamiques (exemple avec des articles de blog)
  // Vous devrez ajuster cette partie selon votre propre logique de données
  let dynamicPages = [];
  try {
    // Exemple: récupération de vos contenus dynamiques
    // Remplacez cette partie par votre propre code de récupération de données
    const videos = await fetch(`${baseUrl}/api/videos`).then(res => res.json());
    
    dynamicPages = videos.data.map(video => ({
      url: `${baseUrl}/video/${video._id}`,
      lastModified: new Date(video.updatedAt || video.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des données pour le sitemap:', error);
    // Continuez avec un tableau vide si la récupération échoue
  }

  return [...staticPages, ...dynamicPages];
}
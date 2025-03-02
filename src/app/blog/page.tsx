'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/client';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

// Types
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  mainImage?: {
    alt?: string;
    asset: {
      _ref: string;
    };
  };
  excerpt?: string;
  author?: string;
  categories?: { title: string }[];
}

// Requête GROQ pour récupérer les articles et les catégories
const query = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "excerpt": pt::text(body),
    "author": author->name,
    "categories": categories[]->{
      title
    }
  },
  "categories": *[_type == "category"].title
}`;

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function BlogPage() {
  // États pour les données
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Charger les données au montage
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const data = await client.fetch(query);
        
        setPosts(data.posts);
        setCategories(data.categories);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du blog :', error);
      }
    };

    fetchBlogData();
  }, []);

  // État pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // État pour la recherche par titre
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrer les articles par catégorie et titre
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filtrage par catégorie
      const categoryMatch = selectedCategory 
        ? post.categories?.some(cat => cat.title === selectedCategory)
        : true;

      // Filtrage par titre (insensible à la casse)
      const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && titleMatch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <>
    <Header />
    <div className="container mx-auto mt-20 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Notre Blog</h1>

      {/* Champ de recherche */}
      <div className="flex justify-center mb-8">
        <input 
          type="text" 
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filtres de catégories */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* Bouton Tous */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Tous les articles
          </button>

          {/* Boutons de catégories */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Compteur d'articles */}
      <div className="text-center mb-8 text-gray-600">
        <p>
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} 
          {selectedCategory ? ` dans la catégorie "${selectedCategory}"` : ''}
          {searchQuery ? ` correspondant à "${searchQuery}"` : ''}
        </p>
      </div>

      {/* Grille d'articles */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <div 
              key={post._id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image de couverture */}
              {post.mainImage && (
                <Link href={`/blog/${post.slug.current}`}>
                  <div className="relative h-56 w-full">
                    <Image
                      src={urlFor(post.mainImage).width(600).height(400).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}

              {/* Contenu de l'article */}
              <div className="p-6">
                {/* Catégories */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories?.map(category => (
                    <span
                      key={category.title}
                      onClick={() => setSelectedCategory(category.title)}
                      className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                        category.title === selectedCategory
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {category.title}
                    </span>
                  ))}
                </div>

                {/* Titre */}
                <h2 className="text-xl font-bold mb-3 hover:text-blue-600">
                  <Link href={`/blog/${post.slug.current}`}>
                    {post.title}
                  </Link>
                </h2>

                {/* Extrait */}
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                )}

                {/* Métadonnées */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  
                  {post.author && (
                    <span>Par {post.author}</span>
                  )}
                </div>

                {/* Lien de lecture */}
                <div className="mt-4">
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Lire l'article
                    <svg 
                      className="w-4 h-4 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Message si aucun article ne correspond au filtre
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Aucun article trouvé 
            {selectedCategory ? ` dans la catégorie "${selectedCategory}"` : ''}
            {searchQuery ? ` correspondant à "${searchQuery}"` : ''}
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
    <Footer />
</>
  );
}
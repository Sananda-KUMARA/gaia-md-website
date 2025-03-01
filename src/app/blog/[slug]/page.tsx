// src/app/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PortableText } from '@portabletext/react'
import { clientFetch, urlFor } from '@/sanity/lib/client'

// Requête pour récupérer un article spécifique
const query = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  body,
  publishedAt,
  "author": author->{name, image, slug},
  "categories": categories[]->title
}`

// Fonction pour formater la date
function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Configuration simplifiée de PortableText
const portableTextComponents = {
  block: {
    // Styles par défaut pour chaque type de bloc
    normal: ({children}: any) => <p className="mb-4">{children}</p>,
    h1: ({children}: any) => <h1 className="text-3xl font-bold my-6">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-bold my-5">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-bold my-4">{children}</h3>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-gray-500 pl-4 my-4 italic">{children}</blockquote>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc pl-5 my-4">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal pl-5 my-4">{children}</ol>,
  },
  listItem: {
    bullet: ({children}: any) => <li className="mb-1">{children}</li>,
    number: ({children}: any) => <li className="mb-1">{children}</li>,
  },
  marks: {
    strong: ({children}: any) => <strong>{children}</strong>,
    em: ({children}: any) => <em>{children}</em>,
    code: ({children}: any) => <code className="bg-gray-100 px-1 rounded">{children}</code>,
    link: ({value, children}: any) => {
      const target = (value?.blank) ? '_blank' : undefined
      return (
        <a 
          href={value?.href || '#'} 
          target={target} 
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({value}: any) => {
      if (!value?.asset?._ref) return null;
      
      return (
        <figure className="my-8">
          <div className="relative w-full h-64 md:h-96">
            <Image 
              src={urlFor(value).width(800).url()}
              alt={value.alt || ''}
              fill
              className="object-contain"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Récupération de l'article
    const post = await clientFetch(query, { slug: params.slug });
    
    if (!post) {
      return (
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Article non trouvé</h1>
          <p>L'article avec le slug "{params.slug}" n'existe pas.</p>
          <Link href="/blog" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retour au blog
          </Link>
        </div>
      );
    }
    
    return (
      <>
        <Header />
        <div className="pt-24">
          <article className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Lien de retour au blog */}
            <div className="mb-6">
              <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour à tous les articles
              </Link>
            </div>
            
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(post.publishedAt)}
                  </time>
                )}
                
                {post.author && (
                  <div className="flex items-center">
                    {post.author.image && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image 
                          src={urlFor(post.author.image).width(80).height(80).url()}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span>Par {post.author.name}</span>
                  </div>
                )}
                
                {post.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map(category => (
                      <span 
                        key={category} 
                        className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {post.mainImage && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-10">
                  <Image 
                    src={urlFor(post.mainImage).width(1200).height(675).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}
            </header>
            
            <main className="prose max-w-none">
              {post.body ? (
                <PortableText 
                  value={post.body} 
                  components={portableTextComponents} 
                />
              ) : (
                <p>Cet article n'a pas encore de contenu.</p>
              )}
            </main>
            
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  {post.author && (
                    <p className="text-gray-600 mb-2 sm:mb-0">
                      <span className="font-semibold">Par:</span> {post.author.name}
                    </p>
                  )}
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <p className="text-gray-600">
                    <span className="font-semibold">Publié le:</span> {post.publishedAt ? formatDate(post.publishedAt) : 'Non publié'}
                  </p>
                </div>
              </div>
              
              {/* Lien de retour en bas de page */}
              <div className="mt-8">
                <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour au blog
                </Link>
              </div>
            </footer>
          </article>
        </div>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Erreur lors du rendu de l'article:", error);
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Erreur</h1>
        <p>Une erreur s'est produite lors du chargement de l'article.</p>
        <pre className="bg-gray-100 p-4 mt-4 rounded overflow-auto">
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </pre>
        <Link href="/blog" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retour au blog
        </Link>
      </div>
    );
  }
}
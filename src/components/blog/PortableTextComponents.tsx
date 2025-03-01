import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/client'
import { PortableTextComponents } from '@portabletext/react'

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      
      // Déterminer la classe en fonction de la mise en page
      let containerClass = 'my-8'
      if (value.layout === 'alignLeft') {
        containerClass += ' float-left mr-8 w-1/3'
      } else if (value.layout === 'alignRight') {
        containerClass += ' float-right ml-8 w-1/3'
      } else if (value.layout === 'center') {
        containerClass += ' mx-auto'
      }
      
      return (
        <figure className={containerClass}>
          <div className="relative w-full h-auto aspect-w-16 aspect-h-9">
            <Image 
              src={urlFor(value).width(800).url()}
              alt={value.alt || ''}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-center text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    
    youtube: ({ value }) => {
      const { url, caption } = value
      // Extraire l'ID de la vidéo YouTube
      const id = url?.split('v=')[1]?.split('&')[0]
      
      if (!id) return null
      
      return (
        <div className="my-8">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
            />
          </div>
          {caption && (
            <p className="text-sm text-center text-gray-500 mt-2">{caption}</p>
          )}
        </div>
      )
    },
    
    code: ({ value }) => {
      return (
        <div className="my-8 rounded-lg overflow-hidden">
          {value.filename && (
            <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono">
              {value.filename}
            </div>
          )}
          <pre className="bg-gray-900 p-4 overflow-x-auto">
            <code className={`language-${value.language || 'text'} text-gray-100`}>
              {value.code}
            </code>
          </pre>
        </div>
      )
    },
    
    callout: ({ value }) => {
      const typeStyles: Record<string, string> = {
        info: 'bg-blue-50 border-blue-300 text-blue-800',
        tip: 'bg-green-50 border-green-300 text-green-800',
        warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
        error: 'bg-red-50 border-red-300 text-red-800'
      }
      
      const icons: Record<string, string> = {
        info: 'ℹ️',
        tip: '💡',
        warning: '⚠️',
        error: '❌'
      }
      
      return (
        <div className={`my-8 p-4 border-l-4 rounded-r-lg ${typeStyles[value.type] || typeStyles.info}`}>
          <div className="flex items-start">
            <span className="mr-2 text-xl">{icons[value.type]}</span>
            <div>
              {/* Le contenu de l'alerte sera rendu ici */}
              {value.body && 'Contenu de l\'alerte'}
            </div>
          </div>
        </div>
      )
    },
    
    divider: ({ value }) => {
      const styles: Record<string, string> = {
        simple: 'border-t',
        dashed: 'border-t border-dashed',
        thick: 'border-t-4',
        asterisks: 'text-center text-2xl'
      }
      
      return value.style === 'asterisks' ? (
        <div className="my-8 text-center text-2xl text-gray-400">* * *</div>
      ) : (
        <hr className={`my-8 ${styles[value.style] || styles.simple} border-gray-300`} />
      )
    }
  },
  
  marks: {
    link: ({ value, children }) => {
      const target = (value?.blank) ? '_blank' : undefined
      return (
        <Link
          href={value?.href || '#'}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </Link>
      )
    },
    color: ({ value, children }) => {
      return (
        <span style={{ color: value?.value?.hex || 'inherit' }}>
          {children}
        </span>
      )
    },
    fontFamily: ({ value, children }) => {
      return (
        <span style={{ fontFamily: value?.value || 'inherit' }}>
          {children}
        </span>
      )
    }
  },
  
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-10 mb-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mt-8 mb-4">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-1 my-6 italic text-gray-700">
        {children}
      </blockquote>
    )
  },
  
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-6 space-y-2">{children}</ol>
    )
  },
  
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

// app/blog/[slug]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { clientFetch, urlFor } from '@/sanity/lib/client'
import { portableTextComponents } from '@/components/PortableTextComponents'

// Types
interface PostDetail {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: any
  body?: any
  publishedAt?: string
  author?: {
    name: string
    image?: any
    slug?: { current: string }
  }
  categories?: string[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

// Requête pour récupérer les slugs pour generateStaticParams
export async function generateStaticParams() {
  const slugs = await clientFetch<string[]>(`*[_type == "post"].slug.current`)
  return slugs.map(slug => ({ slug }))
}

// Requête pour récupérer un article spécifique
const query = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  body,
  publishedAt,
  "author": author->{name, image, slug},
  "categories": categories[]->title,
  seo
}`

// Fonction pour générer les métadonnées de la page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await clientFetch<PostDetail>(query, { slug: params.slug })
  
  if (!post) return { title: 'Article non trouvé' }
  
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || `Article: ${post.title}`,
    keywords: post.seo?.keywords || [],
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription,
      type: 'article',
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : []
    }
  }
}

// Fonction pour formater la date
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await clientFetch<PostDetail>(query, { slug: params.slug })
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
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
            {post.mainImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 text-sm">
                {post.mainImage.caption}
              </div>
            )}
          </div>
        )}
      </header>
      
      <main className="prose prose-lg max-w-none">
        <PortableText 
          value={post.body} 
          components={portableTextComponents} 
        />
      </main>
    </article>
  )
}
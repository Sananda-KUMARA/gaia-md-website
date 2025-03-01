// components/SimplePortableText.tsx
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/client'

// Composants simplifiés pour le rendu du contenu
const simpleComponents = {
  // Blocs de base (paragraphes, titres)
  block: {
    h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6 italic">
        {children}
      </blockquote>
    ),
  },
  
  // Pour les types de contenu spéciaux
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      
      return (
        <figure className="my-8">
          <div className="relative w-full h-64">
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
  
  // Pour les listes
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6">{children}</ol>,
  },
  
  // Pour les items de liste
  listItem: {
    bullet: ({ children }: any) => <li className="mb-1">{children}</li>,
    number: ({ children }: any) => <li className="mb-1">{children}</li>,
  },
  
  // Pour les décorations de texte
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <Link 
        href={value?.href || '#'} 
        className="text-blue-600 hover:underline"
        target={value?.blank ? '_blank' : undefined}
      >
        {children}
      </Link>
    ),
  },
};

// Composant d'affichage
export function SimplePortableText({ value }: { value: any }) {
  return <PortableText value={value} components={simpleComponents} />;
}
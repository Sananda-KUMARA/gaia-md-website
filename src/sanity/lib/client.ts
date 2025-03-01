// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { cache } from 'react'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

// Version du client avec cache React pour optimiser les performances
export const clientFetch = cache(client.fetch.bind(client))

// Utilitaire pour générer les URL d'images
const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

// src/sanity/structure.ts
import { StructureBuilder } from 'sanity/structure'
import { BiPencil, BiUser, BiCategory, BiCog } from 'react-icons/bi'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu du Blog')
    .items([
      // Articles de blog
      S.listItem()
        .title('Articles')
        .icon(BiPencil)
        .child(
          S.documentTypeList('post')
            .title('Articles')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),
      
      // Auteurs
      S.listItem()
        .title('Auteurs')
        .icon(BiUser)
        .child(S.documentTypeList('author').title('Auteurs')),
      
      // Catégories
      S.listItem()
        .title('Catégories')
        .icon(BiCategory)
        .child(S.documentTypeList('category').title('Catégories')),
      
      // Séparateur
      S.divider(),
      
      // Singleton pour les paramètres globaux (optionnel)
      S.listItem()
        .title('Paramètres')
        .icon(BiCog)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])
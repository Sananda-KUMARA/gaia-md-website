// src/app/admin/studio/[[...tool]]/layout.tsx
// Ce fichier gère les métadonnées (côté serveur)
export { metadata, viewport } from 'next-sanity/studio'
export const dynamic = 'force-static'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
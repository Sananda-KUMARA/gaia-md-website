'use client';
import { NextStudio } from 'next-sanity/studio'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import config from '../../../../../sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
 
  useEffect(() => {
    // Rediriger si non authentifié
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
   
    // Vérification de sécurité pour le rôle admin
    const userRole = (session?.user as any)?.role;
    if (status === 'authenticated' && userRole !== 'admin') {
      router.push('/login');
    }
  }, [session, status, router]);
 
  // Si non authentifié, afficher le message avec bouton de retour
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
          <p className="text-gray-600">Vous devez être connecté pour accéder à Sanity Studio.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          >
            Retour à l'administration
          </Link>
        </div>
      </div>
    );
  }
 
  // Vérifier le rôle admin
  const isAdmin = (session.user as any)?.role === 'admin';
 
  // Si connecté mais pas admin, afficher message d'erreur
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions d'administrateur nécessaires.</p>
        </div>
        <Link
          href="/admin"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
        >
          Retour à l'administration
        </Link>
      </div>
    );
  }
 
  // Afficher le studio seulement si authentifié et admin
  return <NextStudio config={config} />;
}
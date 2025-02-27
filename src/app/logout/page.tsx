'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut({ redirect: false });
        router.push('/');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Déconnexion</h1>
        {isLoading ? (
          <p className="text-center">Déconnexion en cours...</p>
        ) : (
          <div className="text-center">
            <p>Vous avez été déconnecté avec succès.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
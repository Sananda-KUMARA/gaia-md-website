// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoManager from './portfolio-videos/VideoManager';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('videos');
  const [stats, setStats] = useState({
    totalVideos: 0,
    activeVideos: 0,
    totalViews: 0
  });

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Récupérer les statistiques
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/admin/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data.data || {
              totalVideos: 0,
              activeVideos: 0,
              totalViews: 0
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des statistiques:', error);
        }
      };

      fetchStats();
    }
  }, [status]);

  // Affichage pendant le chargement de la session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher
  // (la redirection sera gérée par useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Connecté en tant que <span className="font-medium">{session?.user?.name || session?.user?.email}</span>
              </div>
              <Link href="/api/auth/signout">
                <button className="inline-flex items-center border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 transition-colors">
                  Déconnexion
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total des vidéos
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalVideos}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Vidéos actives
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.activeVideos}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total des vues
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {/* {stats.totalViews.toLocaleString()} */} À implémenter ...
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* Onglets */}
<div className="mb-6 border-b border-gray-200">
  <nav className="-mb-px flex space-x-8">
    <button
      onClick={() => setActiveTab('videos')}
      className={`${
        activeTab === 'videos'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      Vidéos
    </button>
    
    <button
      onClick={() => setActiveTab('users')}
      className={`${
        activeTab === 'users'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      Utilisateurs
    </button>

    <button
      onClick={() => setActiveTab('blog')}
      className={`${
        activeTab === 'blog'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      Blog
    </button>

    <button
      onClick={() => setActiveTab('settings')}
      className={`${
        activeTab === 'settings'
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      Paramètres
    </button>
  </nav>
</div>

        {/* Contenu des onglets */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'videos' && (
            <div>
              <VideoManager />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Gestion des utilisateurs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ce module est en cours de développement.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Paramètres de l&lsquo;application</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ce module est en cours de développement.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
          <div className="p-6 text-center">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Studio de gestion du blog</h3>
            <p className="text-gray-600 mb-6">Accédez à l'interface complète de Sanity Studio pour gérer votre contenu</p>
            <a 
              href="/admin/studio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Ouvrir Sanity Studio
            </a>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
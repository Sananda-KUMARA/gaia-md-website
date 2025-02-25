'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';

// Interface pour les données vidéo
interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchVideos();
    }
  }, [status, router]);
  
  const fetchVideos = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la récupération des vidéos');
      }
      
      setVideos(result.data);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteVideo = async (id: string): Promise<void> => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
      
      // Actualiser la liste après suppression
      fetchVideos();
    } catch (err) {
      console.error('Erreur de suppression:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      alert(`Erreur: ${errorMessage}`);
    }
  };
  
  // Affichage pendant le chargement de la session
  if (status === 'loading') {
    return <div>Chargement...</div>;
  }
  
  // Si l'utilisateur n'est pas authentifié, ne rien afficher
  // (la redirection sera gérée par useEffect)
  if (status === 'unauthenticated') {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Administration des vidéos</h1>
        <div className={styles.headerActions}>
          <span className={styles.userInfo}>
            Connecté en tant que {session?.user?.name || session?.user?.email}
          </span>
          <Link href="/api/auth/signout">
            <a className={styles.signOutButton}>Déconnexion</a>
          </Link>
        </div>
      </header>
      
      <div className={styles.actions}>
        <Link href="/admin/videos/new">
          <a className={styles.addButton}>Ajouter une vidéo</a>
        </Link>
      </div>
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
      
      {loading ? (
        <div className={styles.loading}>Chargement des vidéos...</div>
      ) : (
        <div className={styles.videoList}>
          {videos.length === 0 ? (
            <div className={styles.empty}>
              Aucune vidéo disponible. Commencez par en ajouter une !
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Miniature</th>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id}>
                    <td className={styles.thumbnail}>
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          width={80} 
                          height={45}
                        />
                      ) : (
                        <div className={styles.noThumb}>Aucune</div>
                      )}
                    </td>
                    <td>{video.title}</td>
                    <td>{video.category || '-'}</td>
                    <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <Link href={`/admin/videos/edit/${video._id}`}>
                        <a className={styles.editButton}>Modifier</a>
                      </Link>
                      <button
                        onClick={() => deleteVideo(video._id)}
                        className={styles.deleteButton}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
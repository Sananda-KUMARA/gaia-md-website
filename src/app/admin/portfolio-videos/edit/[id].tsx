// pages/admin/videos/edit/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../../../styles/VideoForm.module.css';

// Interface pour les données du formulaire
interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

const EditVideo: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    tags: [],
  });
  
  const [tagInput, setTagInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && id && typeof id === 'string') {
      fetchVideo(id);
    }
  }, [status, router, id]);
  
  const fetchVideo = async (videoId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/videos/${videoId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la récupération de la vidéo');
      }
      
      setFormData({
        title: result.data.title || '',
        description: result.data.description || '',
        videoUrl: result.data.videoUrl || '',
        thumbnailUrl: result.data.thumbnailUrl || '',
        category: result.data.category || '',
        tags: result.data.tags || [],
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const addTag = (): void => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl) {
      setError('Le titre et l\'URL de la vidéo sont obligatoires');
      return;
    }
    
    if (!id || typeof id !== 'string') {
      setError('ID de vidéo invalide');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de la vidéo');
      }
      
      // Redirection vers le dashboard admin
      router.push('/admin');
      
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Affichage pendant le chargement de la session
  if (status === 'loading' || (status === 'authenticated' && loading)) {
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
        <h1>Modifier la vidéo</h1>
        <Link href="/admin">
          <a className={styles.backLink}>Retour au tableau de bord</a>
        </Link>
      </header>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="videoUrl">URL de la vidéo *</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="thumbnailUrl">URL de la miniature</label>
          <input
            type="url"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="category">Catégorie</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Tags</label>
          <div className={styles.tagInput}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={loading}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={loading}
              className={styles.addTagButton}
            >
              Ajouter
            </button>
          </div>
          
          <div className={styles.tagList}>
            {formData.tags.map((tag) => (
              <div key={tag} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={loading}
                  className={styles.removeTagButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.formActions}>
          <Link href="/admin">
            <a className={styles.cancelButton}>
              Annuler
            </a>
          </Link>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Mettre à jour la vidéo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVideo;
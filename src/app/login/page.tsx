'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Importez de next/navigation et non next/router
import styles from './login.module.css'; // Ajustez le chemin selon votre structure

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
   
    if (!email || !password) {
      setError('Veuillez saisir votre email et votre mot de passe');
      return;
    }
   
    try {
      setLoading(true);
      setError('');
     
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
     
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirection vers le dashboard admin
        router.push('/admin', { scroll: false });
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Administration</h1>
       
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
       
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
         
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
         
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
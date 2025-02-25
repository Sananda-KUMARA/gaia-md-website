import mongoose from 'mongoose';

// URL de connexion à partir des variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/votre_base_de_donnees';

// Type pour la connexion globale
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// Extension du type global
declare global {
  var mongooseCache: MongooseCache;
}

// Fonction de connexion
export const dbConnect = async () => {
  // Si une connexion existe déjà, on la retourne
  if (global.mongooseCache?.conn) {
    return global.mongooseCache.conn;
  }

  // Initialisation du cache si nécessaire
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }

  // Si pas de promesse de connexion en cours, on en crée une
  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connexion à MongoDB établie');
        return mongoose;
      })
      .catch((error) => {
        console.error('Erreur de connexion à MongoDB :', error);
        throw error;
      });
  }

  try {
    // Attendre la connexion
    const mongooseInstance = await global.mongooseCache.promise;
    global.mongooseCache.conn = mongooseInstance.connection;
    return global.mongooseCache.conn;
  } catch (e) {
    // Réinitialiser en cas d'erreur
    global.mongooseCache = { conn: null, promise: null };
    throw e;
  }
};

// Export par défaut pour la compatibilité
export default dbConnect;
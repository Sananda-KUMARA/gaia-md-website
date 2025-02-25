// scripts/create-admin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant dans les variables d'environnement");
  process.exit(1);
}

// Interface utilisateur
interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Schema pour l'utilisateur
const UserSchema = new mongoose.Schema<IUser>({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Paramètres pour le nouvel administrateur
const adminEmail = 'admin@votredomaine.com'; // Remplacez par votre email
const adminPassword = 'votre_mot_de_passe_admin'; // Remplacez par votre mot de passe souhaité

// Connexion à MongoDB et création de l'administrateur
async function createAdmin(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    // Créer ou récupérer le modèle User
    const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
    
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Un administrateur existe déjà');
      process.exit(0);
    }
    
    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Créer l'administrateur
    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    
    await admin.save();
    console.log('Administrateur créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter la fonction
createAdmin();
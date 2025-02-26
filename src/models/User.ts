// models/User.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface définissant la structure d'un utilisateur
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  createdAt: Date;
}

// Schema pour le modèle utilisateur
const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Création du modèle s'il n'existe pas déjà
let UserModel: Model<IUser>;

try {
  // Essayer d'obtenir le modèle existant pour éviter le problème de redéfinition
  UserModel = mongoose.model<IUser>('User');
} catch {
  // Si le modèle n'existe pas encore, le créer
  UserModel = mongoose.model<IUser>('User', UserSchema);
}

export default UserModel;
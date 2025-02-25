// models/Video.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface définissant la structure d'une vidéo
export interface IVideo extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema pour le modèle vidéo
const VideoSchema: Schema = new Schema<IVideo>({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'L\'URL de la vidéo est obligatoire'],
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [String],
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mise à jour de la date de modification à chaque modification
VideoSchema.pre('save', function(this: IVideo, next) {
  this.updatedAt = new Date();
  next();
});

// Création du modèle s'il n'existe pas déjà
let VideoModel: Model<IVideo>;

try {
  // Essayer d'obtenir le modèle existant pour éviter le problème de redéfinition
  VideoModel = mongoose.model<IVideo>('Video');
} catch {
  // Si le modèle n'existe pas encore, le créer
  VideoModel = mongoose.model<IVideo>('Video', VideoSchema);
}

export default VideoModel;
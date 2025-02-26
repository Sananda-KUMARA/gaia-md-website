// pages/api/videos/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import VideoModel from '../../../models/Video';

// Types pour la réponse API
interface ApiResponse {
  success: boolean;
  data?: string[];
  message?: string;
  error?: any; // Pour debugging
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;
  
  try {
    // Connecter à la base de données avant toute opération
    await dbConnect();
    
    if (method === 'GET') {
      try {
        // Vérifier d'abord si la collection existe et contient des documents
        const count = await VideoModel.countDocuments();
        console.log(`Nombre de vidéos trouvées: ${count}`);
        
        // Récupérer toutes les catégories uniques qui sont utilisées
        const result = await VideoModel.distinct('category', { 
          category: { $exists: true, $ne: '' }, 
          active: true 
        });
        
        console.log('Catégories trouvées:', result);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.error('Erreur dans la requête MongoDB:', error);
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        res.status(500).json({ 
          success: false, 
          message: errorMessage,
          error: JSON.stringify(error) // Pour le debugging
        });
      }
    } else {
      res.status(405).json({ success: false, message: 'Méthode non prise en charge' });
    }
  } catch (dbError) {
    console.error('Erreur de connexion à la base de données:', dbError);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur de connexion à la base de données',
      error: JSON.stringify(dbError) // Pour le debugging
    });
  }
}
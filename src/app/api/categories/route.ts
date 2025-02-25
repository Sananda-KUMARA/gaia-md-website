// pages/api/videos/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import VideoModel from '../../../models/Video';

// Types pour la réponse API
interface ApiResponse {
  success: boolean;
  data?: string[];
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      // Récupérer toutes les catégories uniques qui sont utilisées
      const result = await VideoModel.find(
        { category: { $exists: true, $ne: '' }, active: true },
        'category'
      ).distinct('category');
      
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      res.status(400).json({ success: false, message: errorMessage });
    }
  } else {
    res.status(400).json({ success: false, message: 'Méthode non prise en charge' });
  }
}
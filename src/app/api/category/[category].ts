import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import VideoModel from '@/models/Video';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await dbConnect();

    // Gestion spéciale pour la requête des catégories
    if (id === 'categories') {
      const categories = await VideoModel.distinct('category');
      return NextResponse.json(categories, { status: 200 });
    }

    // Validation de l'ID pour s'assurer que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de vidéo invalide' }, 
        { status: 400 }
      );
    }

    // Recherche de la vidéo par son ID
    const video = await VideoModel.findById(id);

    if (!video) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(video, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
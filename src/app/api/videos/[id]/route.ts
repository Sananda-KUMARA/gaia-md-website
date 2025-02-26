import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import VideoModel from '@/models/Video';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Attendre les paramètres avant de les utiliser
  const params = await context.params;
  const { id } = params;

  try {
    await dbConnect();

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

// Ajouter cette fonction à votre fichier app/api/videos/[id]/route.ts
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Attendre les paramètres avant de les utiliser
  const params = await context.params;
  const { id } = params;

  try {
    await dbConnect();

    // Validation de l'ID pour s'assurer que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de vidéo invalide' },
        { status: 400 }
      );
    }

    // Récupérer les données du corps de la requête
    const body = await request.json();

    // Mise à jour de la vidéo avec les nouvelles données
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Attendre les paramètres avant de les utiliser
  const params = await context.params;
  const { id } = params;

  try {
    await dbConnect();

    // Validation de l'ID pour s'assurer que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de vidéo invalide' },
        { status: 400 }
      );
    }

    // Supprimer la vidéo
    const deletedVideo = await VideoModel.findByIdAndDelete(id);

    if (!deletedVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Vidéo supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo :', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

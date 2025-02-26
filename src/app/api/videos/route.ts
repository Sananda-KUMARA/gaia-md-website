// app/api/videos/route.ts
import dbConnect from '@/lib/mongodb';
import VideoModel, { IVideo } from '@/models/Video';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// Interface pour la réponse standardisée
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// GET - Récupérer toutes les vidéos
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<IVideo[]>>> {
  try {
    // Vérifier l'authentification pour les routes d'administration
    const session = await getServerSession(authOptions);
    const isAdmin = request.nextUrl.pathname.startsWith('/api/admin');
    
    if (isAdmin && !session) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Construire la requête
    const query: any = {};
    
    // Pour les utilisateurs non-admin, ne montrer que les vidéos actives
    if (!isAdmin && !session) {
      query.active = true;
    }
    
    const videos = await VideoModel.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: videos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur GET videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle vidéo
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<IVideo>>> {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    await dbConnect();
    
    const video = await VideoModel.create(body);
    
    return NextResponse.json(
      { success: true, data: video },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur POST video:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }
}
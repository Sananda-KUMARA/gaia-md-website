// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VideoModel from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Récupérer le nombre total de vidéos
    const totalVideos = await VideoModel.countDocuments();
    
    // Récupérer le nombre de vidéos actives
    const activeVideos = await VideoModel.countDocuments({ active: true });
    
    // Dans un système réel, vous auriez probablement un modèle View
    // qui stockerait le nombre de vues par vidéo
    // Ici on simule avec un nombre calculé
    //const totalViews = totalVideos * Math.floor(Math.random() * 1000) + 100;
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          totalVideos,
          activeVideos,
         //totalViews
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur GET admin stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
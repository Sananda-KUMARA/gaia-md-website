import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VideoModel from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const videos = await VideoModel.find({ active: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error('Erreur API /videos:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur serveur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const video = await VideoModel.create(body);
    
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST /videos:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur serveur inconnue'
      },
      { status: 500 }
    );
  }
}
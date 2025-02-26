// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si le chemin commence par /admin (mais exclure /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Si pas de token (non authentifié), rediriger vers la page de login
    if (!token) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Si le token existe mais que l'utilisateur n'a pas le rôle admin
    if (token && token.role !== 'admin') {
      // Rediriger vers une page d'accès refusé ou la page d'accueil
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ['/admin/:path*']
};
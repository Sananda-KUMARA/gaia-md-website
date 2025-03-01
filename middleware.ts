// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  // Vérifier explicitement si nous sommes sur /admin/studio ou un autre chemin admin
  if (pathname.startsWith('/admin')) {
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
      // Rediriger vers une page login
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
 
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
// Ajouter explicitement /admin/studio ainsi que le pattern générique
export const config = {
  matcher: ['/admin/:path*', '/admin/studio']
};
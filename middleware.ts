// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si nous sommes sur une route admin
  const isAdminRoute = pathname === '/admin' || 
                        pathname.startsWith('/admin/') || 
                        pathname.startsWith('/admin/studio');
  
  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Rediriger vers login si non authentifié
    if (!token) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Rediriger vers login si pas le rôle admin
    if (token.role !== 'admin') {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Matcher plus précis pour capturer tous les chemins, y compris les routes captives
export const config = {
  matcher: [
    // Routes admin de base
    '/admin',
    
    // Route captive pour studio et tous ses sous-chemins
    '/admin/studio/:path*',
    '/admin/studio',
    
    // Autres routes admin
    '/admin/:path*',
  ]
};
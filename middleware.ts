import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

/**
 * Middleware de Next.js:
 * 1. Redirige colegioacropolis.cl → www.colegioacropolis.net (301 permanente)
 * 2. Protege rutas /admin/* con autenticación JWT.
 * 
 * Dominio canónico: www.colegioacropolis.net
 * (El dominio raíz se redirige desde cPanel de HostGator)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // ============================================================
  // 1. Redirección de dominio: .cl → www.colegioacropolis.net
  // ============================================================
  if (
    hostname.includes('colegioacropolis.cl') ||
    hostname.includes('www.colegioacropolis.cl')
  ) {
    const newUrl = new URL(request.url);
    newUrl.hostname = 'www.colegioacropolis.net';
    newUrl.port = '';
    return NextResponse.redirect(newUrl, 301);
  }

  // ============================================================
  // 2. Protección de rutas admin (excepto login)
  // ============================================================
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('acropolis_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};


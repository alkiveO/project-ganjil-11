// middleware.js (letakkan di ROOT project, bukan di src/)
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // === 1. Halaman publik (boleh diakses tanpa login) ===
  const publicPaths = ['/login', '/api/auth', '/_next', '/favicon.ico'];
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // === 2. Harus login ===
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // === 3. Redirect berdasarkan ROLE ===
  const role = token.role;

  // Dashboard utama
  if (pathname === '/dashboard') {
    if (role === 'siswa') return NextResponse.redirect(new URL('/dashboard/siswa', req.url));
    if (role === 'guru') return NextResponse.redirect(new URL('/dashboard/guru', req.url));
    if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', req.url));
  }

  // Proteksi akses dashboard
  if (pathname.startsWith('/dashboard')) {
    const allowed = (
      (role === 'siswa' && pathname.startsWith('/dashboard/siswa')) ||
      (role === 'guru' && pathname.startsWith('/dashboard/guru')) ||
      (role === 'admin' && pathname.startsWith('/dashboard/admin'))
    );

    if (!allowed) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // === 4. Lolos semua ===
  return NextResponse.next();
}

// === CONFIG: Jalankan middleware di path ini ===
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/api/((?!auth).*)' // API selain auth butuh login kalo akses data sensitif
  ]
};
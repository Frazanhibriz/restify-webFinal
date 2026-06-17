import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — Route-Based Role Guard
 *
 * Melindungi halaman berdasarkan role:
 * - /home/*      → hanya untuk role 'user'
 * - /admin/*     → hanya untuk role 'admin'
 * - /receptionist/* → hanya untuk role 'receptionist'
 *
 * Token disimpan di localStorage (client-side only), sehingga middleware ini
 * hanya bisa membaca cookie jika ada. Sebagai lapisan pertama perlindungan,
 * kita simpan role di cookie saat login dan baca di sini.
 */

// Route protection map
const ROLE_ROUTES: Record<string, string> = {
  '/home': 'user',
  '/admin': 'admin',
  '/receptionist': 'receptionist',
};

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/landing2', '/welcome', '/detail', '/map'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '?'));
  if (isPublic) return NextResponse.next();

  // Read role from cookie (set during login)
  const userRole = request.cookies.get('user_role')?.value;
  const authToken = request.cookies.get('auth_token')?.value;

  // Determine required role for this path
  let requiredRole: string | null = null;
  for (const [routePrefix, role] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      requiredRole = role;
      break;
    }
  }

  // If no required role, allow through
  if (!requiredRole) return NextResponse.next();

  // If not authenticated at all, redirect to login
  if (!authToken && !userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but wrong role, redirect to correct panel
  if (userRole && userRole !== requiredRole) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'receptionist') {
      return NextResponse.redirect(new URL('/receptionist', request.url));
    } else {
      // Regular user trying to access admin/receptionist
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home/:path*',
    '/admin/:path*',
    '/receptionist/:path*',
  ],
};

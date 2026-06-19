import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string> = {
  '/home': 'user',
  '/admin': 'admin',
  '/receptionist': 'receptionist',
};

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/landing2', '/welcome', '/detail', '/map'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '?'));
  if (isPublic) return NextResponse.next();

  const userRole = request.cookies.get('user_role')?.value;
  const authToken = request.cookies.get('auth_token')?.value;

  let requiredRole: string | null = null;
  for (const [routePrefix, role] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(routePrefix)) {
      requiredRole = role;
      break;
    }
  }

  if (!requiredRole) return NextResponse.next();

  if (!authToken && !userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (userRole && userRole !== requiredRole) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'receptionist') {
      return NextResponse.redirect(new URL('/receptionist', request.url));
    } else {
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

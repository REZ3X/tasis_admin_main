import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication middleware for TASIS admin panel
 * Handles redirection based on authentication status
 * - Redirects to login page if no token is present
 * - Redirects to home if already authenticated and trying to access login
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken');
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
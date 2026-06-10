import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect all routes under /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // In a real app, you would check for authentication here
    // For now, we'll allow all requests (this is frontend only)
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
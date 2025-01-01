// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  '/signin',
  '/signup',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images'  // if you have a public images directory
];

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    
    // Check if the current path is a public route
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;
    const isAuthenticated = !!token;
    const isAdmin = token?.role === "admin";

    // If not authenticated and not on a public route, redirect to signin
    if (!isAuthenticated) {
      const signInUrl = new URL('/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Protect admin routes
    if (pathname.startsWith("/voting") && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Skip auth check for public routes
        if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: '/signin',
    }
  }
);

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
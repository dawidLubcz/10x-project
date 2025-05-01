import { defineMiddleware, sequence } from 'astro:middleware';

import { supabaseClient } from '../db/supabase.client';

// Middleware for handling Supabase client in context
const supabaseMiddleware = defineMiddleware(async (context, next) => {
  // Add supabase client to context for use in Astro components
  context.locals.supabase = supabaseClient;
  
  return next();
});

// Middleware for authentication protection
const authMiddleware = defineMiddleware(async (context, next) => {
  // Get the URL path
  const url = new URL(context.request.url);
  const path = url.pathname;

  // List of protected routes that require authentication
  const protectedRoutes = [
    '/cards',
    '/profile',
    '/settings'
  ];

  // Skip auth checks for the auth page
  if (path.startsWith('/auth')) {
    // For auth pages, we just continue without redirect
    // In a real app, we'd check if user is already logged in
    return next();
  }

  // Check if the user is authenticated using cookies
  const isAuthenticated = context.cookies.has('auth_token');
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login page with redirect parameter
    return Response.redirect(`${url.origin}/auth?redirect=${path}`, 302);
  }

  // Continue with the request
  return next();
});

// Export the middleware sequence
export const onRequest = sequence(supabaseMiddleware, authMiddleware); 
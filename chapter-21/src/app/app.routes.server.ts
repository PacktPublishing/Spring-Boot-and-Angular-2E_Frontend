import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public content route — server-rendered for SEO and performance
  {
    path: 'books',
    renderMode: RenderMode.Server,
  },
  // Static pages — pre-rendered at build time
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'terms',
    renderMode: RenderMode.Prerender,
  },
  // Authenticated and interactive routes — client-rendered
  {
    path: 'auth/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  // Catch-all fallback for any remaining routes
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];

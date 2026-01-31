import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const isProduction = import.meta.env.PROD && !import.meta.env.VERCEL_ENV?.includes('preview');

  const robotsTxt = isProduction
    ? `User-agent: *
Disallow:

Sitemap: https://www.messie-hilfe.de/sitemap-index.xml`
    : `User-agent: *
Disallow: /`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

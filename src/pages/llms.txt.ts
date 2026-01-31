import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const llmsTxt = `# llms.txt
User-agent: *
Allow: /

Preferred-Language: de
Site-Name: Messie-Hilfe`;

  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

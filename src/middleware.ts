import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname === '/anfrage/danke' || pathname === '/anfrage/danke/') {
    const cookie = context.cookies.get('form_submitted');

    if (!cookie || cookie.value !== 'true') {
      return context.redirect('/', 302);
    }

    context.cookies.delete('form_submitted', { path: '/' });
  }

  return next();
});

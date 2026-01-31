import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CONTACT_RECIPIENT_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.cookieyes.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "img-src 'self' data: https:",
          "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.cookieyes.com https://log.cookieyes.com https://*.supabase.co",
          "frame-src 'self' https://www.googletagmanager.com https://*.cookieyes.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join('; ')
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.debug'],
          passes: 2,
        },
        format: {
          comments: false,
        },
      },
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split large dependencies for better caching and parallel loading
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('resend')) return 'resend';
            if (id.includes('@vercel/speed-insights')) return 'analytics';
            if (id.includes('node_modules')) return 'vendor';
          },
          compact: true,
        },
      },
    },
  },
});

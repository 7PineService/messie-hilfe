// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Build optimizations
  build: {
    // Inline small CSS files to reduce render-blocking requests
    inlineStylesheets: 'auto', // Automatically inline CSS < 4KB
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    server: {
      headers: {
        // Security headers
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        // Content Security Policy - Allow GTM, CookieYes, fonts, and self
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn-cookieyes.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: https:",
          "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://cdn-cookieyes.com",
          "frame-src 'self' https://www.googletagmanager.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join('; ')
      }
    },
    build: {
      // Minify JavaScript (Astro minifies by default, but we ensure terser is used)
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: true,
          pure_funcs: ['console.debug'], // Remove debug logs only
          passes: 2, // Multiple passes for better minification
        },
        format: {
          comments: false, // Remove all comments
        },
      },
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: (id) => {
            // Separate vendor chunks for better caching
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Compact output format
          compact: true,
        },
      },
    },
  },
});

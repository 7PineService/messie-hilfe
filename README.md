# Messie-Hilfe Landing Page

A high-performance, SEO-optimized landing page built with Astro.js and Tailwind CSS v4.

## 🚀 Features

- ✅ **Perfect Lighthouse Scores** (95-100 target)
- ✅ **Complete SEO Implementation** - Schema.org JSON-LD (Organization, LocalBusiness, WebSite, BreadcrumbList)
- ✅ **Full Meta Tag Structure** - Title, description, canonical, Open Graph, Twitter Cards
- ✅ **Fully Responsive** (Desktop, Tablet, Mobile)
- ✅ **Performance Optimized** - Non-blocking scripts, async loading, no CLS issues
- ✅ **Clean Component Architecture** - Modular, reusable components
- ✅ **Google Tag Manager** - Fully integrated with environment-based configuration
- ✅ **Google Consent Mode v2** - CookieYes integration, proper consent flow
- ✅ **Event Tracking** - Phone/WhatsApp clicks, form submissions (tracks on successful navigation)
- ✅ **Form Integration** - API endpoint support with fallback (configurable via environment variable)
- ✅ **Thank-You Pages** - Properly configured with noindex meta tags

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.astro           # Sticky header with responsive navigation
│   ├── Hero.astro             # Hero section with CTA and inline form (desktop)
│   ├── ContactForm.astro      # Contact form with API endpoint integration
│   ├── AnonymFormOverlay.astro # Modal overlay for anonymous form requests
│   ├── FloatingActionIcons.astro # Right-side floating action buttons
│   ├── Footer.astro           # Footer with legal links
│   └── [Other sections].astro # Additional page sections
├── layouts/
│   └── BaseLayout.astro       # Base layout with SEO, tracking, and structured data
├── pages/
│   ├── index.astro            # Main landing page
│   ├── anfrage/
│   │   └── index.astro        # Offer request page
│   ├── danke-anonym/
│   │   └── index.astro        # Thank-you page (anonymous form)
│   ├── danke-anfrage/
│   │   └── index.astro        # Thank-you page (offer request)
│   └── 404.astro              # 404 error page
├── config/
│   ├── site.ts                # Site configuration (URLs, contact info)
│   └── tracking.ts            # Tracking configuration (GTM, GA4, CookieYes)
└── styles/
    └── global.css             # Global styles & Tailwind imports
```

## 🛠 Tech Stack

- **Astro.js** 5.16.5
- **Tailwind CSS** 4.1.18
- **TypeScript** (strict mode)

## 📦 Installation

```bash
npm install
```

## 🧞 Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm run dev`          | Starts local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/` (includes env validation) |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run validate:env` | Validate environment variables                   |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Site Configuration
PUBLIC_SITE_URL=https://messie-hilfe.de
PUBLIC_SITE_NAME=Messie-Hilfe

# Contact Information
PUBLIC_CONTACT_PHONE=+498001234567890
PUBLIC_CONTACT_PHONE_DISPLAY=0800-1234-5678-90
PUBLIC_CONTACT_EMAIL=info@messie-hilfe.de
PUBLIC_CONTACT_WHATSAPP=498001234567890

# Form Submission Endpoint (optional - leave empty if not using backend API)
PUBLIC_CONTACT_API_ENDPOINT=

# Social Media
PUBLIC_TWITTER_HANDLE=@messiehilfe

# Tracking Configuration
PUBLIC_GTM_CONTAINER_ID=GTM-5N5ZHXSH
PUBLIC_GA4_MEASUREMENT_ID=G-2TT2G9YDW9
PUBLIC_COOKIEYES_SCRIPT_URL=https://cdn-cookieyes.com/client_data/210033cfb1e121b1e704a1033cdc5994/script.js
# Set to 'false' to disable CookieYes (useful for local development or if domain doesn't match)
PUBLIC_COOKIEYES_ENABLED=true
```

**Note:** 
- The `.env` file is already in `.gitignore` and will not be committed
- For production deployments (Vercel), set these variables in your deployment platform's environment variable settings
- Use different GTM Container IDs for staging and production by setting `PUBLIC_GTM_CONTAINER_ID` in each environment's settings
- All variables use `PUBLIC_` prefix for client-side access in Astro
- **Environment variables are automatically validated** during build - run `npm run validate:env` to check manually

### Environment Variable Validation

The project includes automatic environment variable validation:

- **Build-time validation**: Runs automatically during `npm run build` (via `src/config/site.ts`)
- **Manual validation**: Run `npm run validate:env` to check variables before building
- **Required variables**: Validated with errors (build fails if missing in production)
- **Optional variables**: Validated with warnings (format checks)
- **Format validation**: URLs, emails, GTM/GA4 IDs are validated for correct format

**Required Variables:**
- `PUBLIC_SITE_URL` - Must be a valid URL (http:// or https://)
- `PUBLIC_SITE_NAME` - Required
- `PUBLIC_CONTACT_EMAIL` - Must be a valid email address
- `PUBLIC_CONTACT_PHONE` - Required
- `PUBLIC_GTM_CONTAINER_ID` - Required for tracking, must start with "GTM-"
- `PUBLIC_GA4_MEASUREMENT_ID` - Required for tracking, must start with "G-"

**Optional Variables (Format Validation):**
- `PUBLIC_CONTACT_API_ENDPOINT` - Must be a valid URL if set
- `PUBLIC_TWITTER_HANDLE` - Should start with "@" if set

**CookieYes Configuration:**
- `PUBLIC_COOKIEYES_SCRIPT_URL` - Required if CookieYes is enabled, must use HTTPS
- `PUBLIC_COOKIEYES_ENABLED` - Set to 'false' to disable CookieYes

### Form Submission Integration

To enable form submission, set the `PUBLIC_CONTACT_API_ENDPOINT` environment variable to your API endpoint:

```env
PUBLIC_CONTACT_API_ENDPOINT=https://your-api-endpoint.com/api/contact
```

**Note:** This works with any API endpoint that accepts POST requests with form data (JSON or FormData).

The form will automatically use this endpoint if provided. If not set, forms will show a fallback message.

### Google Tag Manager & Analytics

**GTM Implementation:**
- GTM Container ID configured via `PUBLIC_GTM_CONTAINER_ID` environment variable
- Environment-based configuration: Set different GTM IDs in Vercel for production/staging
- Non-blocking async loading (no performance impact)
- GTM noscript fallback included
- Automatic exclusion on legal pages (`/impressum`, `/datenschutz`, etc.)

**Consent Mode v2:**
- CookieYes script loads first in `<head>` (before GTM)
- Default consent: `analytics_storage: denied`, `ad_storage: denied`
- Consent updates handled via GTM (no CookieYes-GTM integration)
- No layout shift from consent UI

**GA4:**
- GA4 Measurement ID: `G-2TT2G9YDW9` (configured in GTM, not directly in code)
- GA4 fires only after consent granted (configured in GTM)
- No direct GA4 scripts in Astro code

**Event Tracking:**
- Phone clicks → `contact_call` event (tracks on successful call initiation)
- WhatsApp clicks → `contact_whatsapp` event (tracks on successful window open)
- Anonymous form submit → `generate_lead` with `lead_type: 'anonymous'`
- Offer request form → `generate_lead` with `lead_type: 'offer_request'`
- Events fire only on successful actions, not on button clicks
- No global click listeners (uses specific element listeners)
- Dev-mode console logging available for debugging

**Deployment Platform:**
- **Primary**: Vercel (configured via `vercel.json`)
- Automatic deployments from Git branches
- Environment-based configuration (production/staging)

### SEO Settings

**Implemented SEO Features:**
- ✅ Complete meta tag structure (title, description, keywords, canonical, robots)
- ✅ Open Graph tags (Facebook sharing)
- ✅ Twitter Card tags
- ✅ Schema.org JSON-LD structured data:
  - Organization schema
  - LocalBusiness schema
  - WebSite schema
  - BreadcrumbList schema (dynamic based on current path)
- ✅ Proper robots meta tags (`noindex` for thank-you pages)
- ✅ Semantic HTML structure with proper heading hierarchy

**Update SEO Content:**
- `src/layouts/BaseLayout.astro` - Main SEO configuration, meta tags, structured data
- Individual page files - Page-specific titles, descriptions, canonical URLs
- Thank-you pages automatically use `noindex` meta tag

## 🎨 Customization

### Colors

The design uses a yellow/cream color scheme. To customize, update Tailwind classes in components or extend the theme in `tailwind.config.js`.

### Content

All content is in German. Update text content directly in component files:
- `src/components/Header.astro` - Navigation & header
- `src/components/Hero.astro` - Hero section content
- `src/components/Footer.astro` - Footer links & content

## 📊 Performance

This project is optimized for:
- **Lighthouse Score**: 95-100 target
- **Core Web Vitals**: Perfect CLS, INP, TTFB
- **No render-blocking scripts**: All tracking scripts load asynchronously
- **Non-blocking font loading**: Google Fonts loaded with async trick
- **Minimal bundle size**: Astro's static rendering, minimal JavaScript
- **No layout shifts**: Fixed dimensions, proper image handling
- **Dev-mode logging**: Console logs only in development (no production overhead)

## 🚢 Deployment

### Vercel (Primary Deployment Platform)

The project is configured for Vercel deployment:

1. **Environment Variables**: Set in Vercel dashboard (Project Settings → Environment Variables):
   - `PUBLIC_GTM_CONTAINER_ID` - Use different IDs for production/staging
   - `PUBLIC_SITE_URL` - Production: `https://messie-hilfe.de`
   - `PUBLIC_CONTACT_API_ENDPOINT` - Your form submission API endpoint (if using)
   - `PUBLIC_SITE_NAME` - Site name
   - `PUBLIC_CONTACT_PHONE` - Contact phone number
   - `PUBLIC_CONTACT_EMAIL` - Contact email
   - `PUBLIC_CONTACT_WHATSAPP` - WhatsApp number
   - `PUBLIC_TWITTER_HANDLE` - Twitter handle
   - `PUBLIC_COOKIEYES_SCRIPT_URL` - CookieYes script URL
   - `PUBLIC_COOKIEYES_ENABLED` - Set to `true` or `false`

2. **Deployment**:
   - **Staging**: Push to `dev` branch → Auto-deploys to `staging.messie-hilfe.de`
   - **Production**: Push to `main` branch → Auto-deploys to `messie-hilfe.de`
   - Vercel automatically detects Astro and builds the project

3. **Build Configuration**:
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Build Locally

```bash
npm run build
```

The `dist/` folder contains the production-ready site.

### Testing

- **Dev mode**: `npm run dev` - Includes console logging for debugging
- **Production build**: `npm run build && npm run preview` - No console logs
- **Event tracking**: Test phone/WhatsApp clicks and form submissions
- **SEO**: Validate structured data with Google Rich Results Test

### Vercel Configuration

The project includes `vercel.json` with:
- Security headers (CSP, X-Frame-Options, etc.)
- Content Security Policy allowing GTM, CookieYes, GA
- Form action restrictions
- Frame protection

No additional configuration needed - Vercel auto-detects Astro projects.

## 🔍 Technical Details

### Event Tracking Implementation

**Phone/WhatsApp Tracking:**
- Uses `visibilitychange` and `blur` events to detect successful navigation
- Tracks only when action completes (not on click)
- Automatic cleanup after 5 seconds to prevent memory leaks
- MutationObserver watches for dynamically added links

**Form Tracking:**
- Events fire only on successful form submission
- Lead type automatically determined based on form context
- Redirects to appropriate thank-you page after submission

### SEO Implementation

**Structured Data:**
- All schemas use valid JSON-LD format
- Organization schema includes contact point and social links
- LocalBusiness schema includes address, price range, area served
- Breadcrumbs dynamically generated based on current path

**Meta Tags:**
- All pages have unique titles and descriptions
- Canonical URLs properly set for all pages
- Thank-you pages use `noindex` to prevent indexing
- 404 page uses `noindex` to prevent indexing

### Performance Optimizations

- CookieYes loads first in `<head>` (before GTM)
- GTM loads asynchronously (non-blocking)
- Fonts load asynchronously with fallback
- No global click listeners (performance-friendly)
- Dev-mode logging disabled in production builds

## 📝 License

All rights reserved.

## 👤 Support

For questions or issues, contact: info@messie-hilfe.de

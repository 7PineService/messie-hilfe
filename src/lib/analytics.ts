export interface TrackingConfig {
  debug?: boolean;
  scrollThreshold?: number;
  ctaSelector?: string;
}

export interface ScrollDepthData {
  percent: number;
}

export interface CTAClickData {
  cta_type: string;
  cta_text?: string;
  cta_url?: string;
}

export type TrackingEventData =
  | ScrollDepthData
  | CTAClickData
  | Record<string, string | number | boolean>;

export const TRACKING_EVENTS = {
  CONTACT_CALL: 'contact_call',
  CONTACT_WHATSAPP: 'contact_whatsapp',
  CTA_CLICK: 'cta_click',
  SCROLL_DEPTH: 'scroll_depth',
} as const;

const DEFAULT_CONFIG: Required<TrackingConfig> = {
  debug: false,
  scrollThreshold: 75,
  ctaSelector: '[data-cta]',
};

function pushToDataLayer(event: string, data?: TrackingEventData, debug = false): void {
  if (typeof window === 'undefined' || !window.dataLayer) {
    if (debug) console.warn('[Analytics] dataLayer not available');
    return;
  }

  window.dataLayer.push({ event, ...data });
  if (debug) console.log('[Analytics]', event, data);
}

export function trackEvent(
  event: string,
  data?: TrackingEventData,
  debug = false
): void {
  pushToDataLayer(event, data, debug);
}

export function trackPhoneCall(debug = false): void {
  trackEvent(TRACKING_EVENTS.CONTACT_CALL, undefined, debug);
}

export function trackWhatsApp(debug = false): void {
  trackEvent(TRACKING_EVENTS.CONTACT_WHATSAPP, undefined, debug);
}

export function trackCTAClick(data: CTAClickData, debug = false): void {
  trackEvent(TRACKING_EVENTS.CTA_CLICK, data, debug);
}

export function trackScrollDepth(percent: number, debug = false): void {
  trackEvent(TRACKING_EVENTS.SCROLL_DEPTH, { percent }, debug);
}

function setupPhoneTracking(debug: boolean): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => trackPhoneCall(debug));
  });
}

function setupWhatsAppTracking(debug: boolean): void {
  const selector = 'a[href*="wa.me"], a[href*="api.whatsapp.com"]';
  document.querySelectorAll<HTMLAnchorElement>(selector).forEach(link => {
    link.addEventListener('click', () => trackWhatsApp(debug));
  });
}

function setupCTATracking(selector: string, debug: boolean): void {
  document.querySelectorAll<HTMLElement>(selector).forEach(el => {
    el.addEventListener('click', () => {
      const ctaType = el.getAttribute('data-cta-type') || 'primary';
      const ctaText = el.textContent?.trim();
      const ctaUrl = el instanceof HTMLAnchorElement ? el.href : undefined;

      trackCTAClick({
        cta_type: ctaType,
        ...(ctaText && { cta_text: ctaText }),
        ...(ctaUrl && { cta_url: ctaUrl }),
      }, debug);
    });
  });
}

function setupScrollTracking(threshold: number, debug: boolean): (() => void) {
  let scrollTracked = false;
  let rafId: number;

  const checkScroll = () => {
    if (scrollTracked) return;

    const scrolled = window.pageYOffset + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const percent = (scrolled / total) * 100;

    if (percent >= threshold) {
      scrollTracked = true;
      trackScrollDepth(threshold, debug);
    }
  };

  const handleScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(checkScroll);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    cancelAnimationFrame(rafId);
  };
}

export function initEventTracking(config: TrackingConfig = {}): () => void {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { debug, scrollThreshold, ctaSelector } = mergedConfig;

  if (typeof window === 'undefined') {
    if (debug) console.warn('[Analytics] Not in browser environment');
    return () => {};
  }

  if (!window.dataLayer) {
    if (debug) console.warn('[Analytics] dataLayer not available');
    return () => {};
  }

  setupPhoneTracking(debug);
  setupWhatsAppTracking(debug);
  setupCTATracking(ctaSelector, debug);
  const cleanupScroll = setupScrollTracking(scrollThreshold, debug);

  if (debug) console.log('[Analytics] Event tracking initialized', mergedConfig);

  return () => {
    cleanupScroll();
    if (debug) console.log('[Analytics] Event tracking cleaned up');
  };
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, any>>;
    gtmLoaded?: boolean;
    trackingInitialized?: boolean;
    getCkyConsent?: () => {
      activeLaw: string;
      categories: {
        necessary: boolean;
        functional: boolean;
        analytics: boolean;
        performance: boolean;
        advertisement: boolean;
      };
      isUserActionCompleted: boolean;
      consentID: string;
      languageCode: string;
    };
  }
}

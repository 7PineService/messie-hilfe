export function initEventTracking(isDev: boolean = false) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    if (isDev) console.warn('[Tracking] dataLayer not available');
    return;
  }

  function trackEvent(event: string, data?: Record<string, any>) {
    window.dataLayer.push({ event, ...data });
    if (isDev) console.log('[Tracking]', event, data);
  }

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('contact_call'), { once: false });
  });

  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('contact_whatsapp'), { once: false });
  });

  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => trackEvent('cta_click', { cta_type: 'primary' }), { once: false });
  });

  let scrollTracked = false;
  const checkScroll = () => {
    if (scrollTracked) return;
    const percent = ((window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight) * 100;
    if (percent >= 75) {
      scrollTracked = true;
      trackEvent('scroll_depth', { percent: 75 });
    }
  };

  let rafId: number;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(checkScroll);
  }, { passive: true });

  if (isDev) console.log('[Tracking] Event tracking initialized');
}

declare global {
  interface Window {
    dataLayer: any[];
    gtmLoaded: boolean;
    trackingInitialized: boolean;
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

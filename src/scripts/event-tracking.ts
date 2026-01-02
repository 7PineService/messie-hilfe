export function initEventTracking(isDev: boolean = false) {
  if (typeof window === 'undefined') return;

  if (!window.dataLayer) {
    if (isDev) console.warn('[Tracking] dataLayer not available - tracking disabled');
    return;
  }

  const trackedLinks = new WeakSet();

  function setupPhoneLink(link: HTMLAnchorElement) {
    if (trackedLinks.has(link)) return;
    trackedLinks.add(link);

    if (isDev) console.log('[Tracking] Setting up phone link:', link.href);

    link.addEventListener('click', function () {
      if (isDev) console.log('[Tracking] Phone link clicked:', link.href);

      let eventTracked = false;

      const trackCall = function () {
        if (!eventTracked && (document.hidden || document.visibilityState === 'hidden')) {
          eventTracked = true;
          if (isDev) {
            console.log('[Tracking] ✅ Phone call event fired - page visibility changed');
            console.log('[Tracking] Event data:', { event: 'contact_call', href: link.href });
          }
          window.dataLayer.push({
            'event': 'contact_call'
          });
          cleanup();
        } else if (isDev && !eventTracked) {
          console.log('[Tracking] Page visibility changed but still visible - waiting...');
        }
      };

      const trackCallFallback = function () {
        if (!eventTracked) {
          eventTracked = true;
          if (isDev) {
            console.log('[Tracking] ✅ Phone call event fired - pagehide/blur fallback');
            console.log('[Tracking] Event data:', { event: 'contact_call', href: link.href });
          }
          window.dataLayer.push({
            'event': 'contact_call'
          });
          cleanup();
        }
      };

      function cleanup() {
        document.removeEventListener('visibilitychange', trackCall);
        window.removeEventListener('pagehide', trackCallFallback);
        window.removeEventListener('blur', trackCallFallback);
        if (isDev) console.log('[Tracking] Phone call listeners removed');
      }

      document.addEventListener('visibilitychange', trackCall);
      window.addEventListener('pagehide', trackCallFallback);
      window.addEventListener('blur', trackCallFallback);

      setTimeout(function () {
        if (!eventTracked) {
          eventTracked = true;
          if (isDev) {
            console.log('[Tracking] ✅ Phone call event fired - dialer launch detected (fallback)');
            console.log('[Tracking] Event data:', { event: 'contact_call', href: link.href });
          }
          window.dataLayer.push({
            'event': 'contact_call'
          });
          cleanup();
        }
      }, 300);

      setTimeout(function () {
        if (!eventTracked) {
          if (isDev) console.log('[Tracking] Phone call listener timeout - removed after 5s (no event fired)');
        }
        cleanup();
      }, 5000);
    });
  }

  function setupWhatsAppLink(link: HTMLAnchorElement) {
    if (trackedLinks.has(link)) return;
    trackedLinks.add(link);

    if (isDev) console.log('[Tracking] Setting up WhatsApp link:', link.href);

    link.addEventListener('click', function () {
      if (isDev) console.log('[Tracking] WhatsApp link clicked:', link.href);

      const trackWhatsApp = function () {
        if (!document.hasFocus()) {
          if (isDev) {
            console.log('[Tracking] ✅ WhatsApp event fired - window lost focus');
            console.log('[Tracking] Event data:', { event: 'contact_whatsapp', href: link.href });
          }
          window.dataLayer.push({
            'event': 'contact_whatsapp'
          });
          window.removeEventListener('blur', trackWhatsApp);
          if (isDev) console.log('[Tracking] WhatsApp listener removed');
        } else if (isDev) {
          console.log('[Tracking] Window blur detected but still has focus - waiting...');
        }
      };
      window.addEventListener('blur', trackWhatsApp);

      setTimeout(function () {
        window.removeEventListener('blur', trackWhatsApp);
        if (isDev) console.log('[Tracking] WhatsApp listener timeout - removed after 5s');
      }, 5000);
    });
  }

  function setupCTAClick(ctaElement: HTMLElement) {
    if (!ctaElement || trackedLinks.has(ctaElement)) return;
    trackedLinks.add(ctaElement);

    ctaElement.addEventListener('click', function () {
      if (isDev) {
        console.log('[Tracking] CTA clicked:', ctaElement.getAttribute('data-cta'));
        console.log('[Tracking] ✅ Firing cta_click event');
        console.log('[Tracking] Event data:', { event: 'cta_click', cta_type: 'primary' });
      }

      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'cta_click',
          'cta_type': 'primary'
        });
      }
    });
  }

  function initScrollDepthTracking() {
    let scrollDepthTracked = false;

    function checkScrollDepth() {
      if (scrollDepthTracked) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop + windowHeight) / documentHeight * 100;

      if (scrollPercent >= 75) {
        scrollDepthTracked = true;
        if (isDev) {
          console.log('[Tracking] ✅ Firing scroll_depth event');
          console.log('[Tracking] Event data:', { event: 'scroll_depth', percent: 75 });
        }

        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'scroll_depth',
            'percent': 75
          });
        }

        window.removeEventListener('scroll', checkScrollDepth);
        if (isDev) console.log('[Tracking] Scroll depth listener removed');
      }
    }

    let scrollTimeout: number;
    window.addEventListener('scroll', function () {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(checkScrollDepth);
    }, { passive: true });

    if (isDev) console.log('[Tracking] Scroll depth tracking initialized');
  }

  function initTracking() {
    if (isDev) console.log('[Tracking] Initializing event tracking hooks...');

    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    if (isDev) console.log(`[Tracking] Found ${phoneLinks.length} phone link(s)`);
    phoneLinks.forEach((link) => setupPhoneLink(link as HTMLAnchorElement));

    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (isDev) console.log(`[Tracking] Found ${whatsappLinks.length} WhatsApp link(s)`);
    whatsappLinks.forEach((link) => setupWhatsAppLink(link as HTMLAnchorElement));

    const ctaElements = document.querySelectorAll('[data-cta]');
    if (isDev) console.log(`[Tracking] Found ${ctaElements.length} CTA element(s)`);
    ctaElements.forEach((el) => setupCTAClick(el as HTMLElement));

    initScrollDepthTracking();

    if (isDev) console.log('[Tracking] Event tracking hooks initialized successfully');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          const element = node as HTMLElement;

          if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
            const link = element as HTMLAnchorElement;
            if (link.href.startsWith('tel:')) {
              setupPhoneLink(link);
            }
            if (link.href.includes('wa.me') || link.href.includes('api.whatsapp.com')) {
              setupWhatsAppLink(link);
            }
          }

          if (element.hasAttribute && element.hasAttribute('data-cta')) {
            setupCTAClick(element);
          }

          const phoneLinks = element.querySelectorAll && element.querySelectorAll('a[href^="tel:"]');
          if (phoneLinks) phoneLinks.forEach((link) => setupPhoneLink(link as HTMLAnchorElement));

          const whatsappLinks = element.querySelectorAll && element.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
          if (whatsappLinks) whatsappLinks.forEach((link) => setupWhatsAppLink(link as HTMLAnchorElement));

          const ctaElements = element.querySelectorAll && element.querySelectorAll('[data-cta]');
          if (ctaElements) ctaElements.forEach((el) => setupCTAClick(el as HTMLElement));
        }
      });
    });
  });

  function startObserving() {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (isDev) console.log('[Tracking] MutationObserver started - watching for dynamically added links');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

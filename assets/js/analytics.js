/* ═══════════════════════════════════════════════════════════════
   DiligenceOS - Google Analytics 4 (consent-gated)

   SETUP: replace MEASUREMENT_ID below with the real ID from
   analytics.google.com (Admin > Data streams > Web). It looks
   like "G-ABC1234XYZ". Until that is done this file is inert -
   no cookies are set and no requests are made.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-XXXXXXXXXX';
  var STORAGE_KEY = 'dos-analytics-consent';

  // Inert until a real ID is configured.
  if (!/^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID)) return;

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function remember(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  /* ─────────── GA4 loader ─────────── */
  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, { anonymize_ip: true });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);

    trackConversions();
  }

  /* ─────────── Conversion events ───────────
     Page views are automatic. These are the actions that actually
     tell us whether organic traffic is turning into pipeline. */
  function trackConversions() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('a, button');
      if (!el) return;

      var label = (el.textContent || '').trim().toLowerCase();
      var href = el.getAttribute('href') || '';

      if (label.indexOf('book a meeting') > -1 || href.indexOf('/schedule') > -1) {
        gtag('event', 'book_meeting_click', { page_path: location.pathname });
      } else if (href.indexOf('mailto:') === 0) {
        gtag('event', 'email_click', { page_path: location.pathname });
      } else if (/\.pdf($|\?)/i.test(href)) {
        gtag('event', 'file_download', { page_path: location.pathname, file_name: href });
      }
    }, true);

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;
      gtag('event', 'form_submit', {
        page_path: location.pathname,
        form_id: form.id || form.name || 'unnamed'
      });
    }, true);
  }

  /* ─────────── Consent banner ─────────── */
  function showBanner() {
    var css = document.createElement('style');
    css.textContent =
      '.dos-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
      'background:#ffffff;border-top:1px solid #e6ebf1;' +
      'box-shadow:0 -4px 16px rgba(0,0,0,.08);padding:18px 20px;' +
      "font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      'display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center}' +
      '.dos-consent p{margin:0;font-size:.9rem;line-height:1.5;color:#2a2a2a;max-width:60ch}' +
      '.dos-consent a{color:#8a6a12;text-decoration:underline}' +
      '.dos-consent-actions{display:flex;gap:10px;flex-shrink:0}' +
      '.dos-consent button{font:inherit;font-size:.875rem;font-weight:600;cursor:pointer;' +
      'padding:9px 20px;border-radius:6px;border:1px solid #e6ebf1;transition:all .2s}' +
      '.dos-consent .dos-accept{background:#8a6a12;border-color:#8a6a12;color:#fff}' +
      '.dos-consent .dos-accept:hover{background:#6f540e;border-color:#6f540e}' +
      '.dos-consent .dos-decline{background:#fff;color:#2a2a2a}' +
      '.dos-consent .dos-decline:hover{background:#f6f9fc}' +
      '@media(max-width:640px){.dos-consent{flex-direction:column;align-items:stretch;text-align:center}' +
      '.dos-consent-actions{justify-content:center}}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.className = 'dos-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Analytics cookie consent');
    bar.innerHTML =
      '<p>We would like to use analytics cookies to understand how visitors ' +
      'use this site. These are optional - the site works either way. ' +
      'See our <a href="/privacy.html#cookies">Privacy Policy</a>.</p>' +
      '<div class="dos-consent-actions">' +
      '<button type="button" class="dos-decline">Decline</button>' +
      '<button type="button" class="dos-accept">Accept</button>' +
      '</div>';

    bar.querySelector('.dos-accept').addEventListener('click', function () {
      remember('granted');
      bar.remove();
      loadAnalytics();
    });
    bar.querySelector('.dos-decline').addEventListener('click', function () {
      remember('denied');
      bar.remove();
    });

    document.body.appendChild(bar);
  }

  /* ─────────── Decide ─────────── */
  function init() {
    var consent = stored();

    if (consent === 'granted') { loadAnalytics(); return; }
    if (consent === 'denied') return;

    // No decision yet. Honour an explicit Do Not Track signal as a decline.
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
      remember('denied');
      return;
    }
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

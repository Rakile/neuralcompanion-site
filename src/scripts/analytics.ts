export {};

const CONSENT_KEY = 'nc_analytics_consent';
const TRACKED_EVENTS = [
  'github_click',
  'download_click',
  'release_click',
  'discord_click',
  'addon_open',
  'addon_audio_play',
  'install_guide_open',
  'screenshot_gallery_open',
  'outbound_docs_click',
] as const;

type TrackedEvent = (typeof TRACKED_EVENTS)[number];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    ncTrack?: (eventName: string, parameters?: Record<string, string>) => void;
  }
}

const root = document.querySelector<HTMLElement>('[data-analytics-consent]');
const measurementId = root?.dataset.measurementId?.trim();
let analyticsReady = false;
let lastPagePath = '';

const trackPageView = () => {
  if (!analyticsReady || window.location.pathname === lastPagePath) return;
  lastPagePath = window.location.pathname;
  window.gtag?.('event', 'page_view', {
    page_location: window.location.href,
    page_path: lastPagePath,
    page_title: document.title,
  });
};

const loadAnalytics = () => {
  if (!measurementId || analyticsReady) return;
  analyticsReady = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
  trackPageView();
};

window.ncTrack = (eventName, parameters = {}) => {
  if (!analyticsReady || !TRACKED_EVENTS.includes(eventName as TrackedEvent)) return;
  window.gtag?.('event', eventName, {
    page_path: window.location.pathname,
    ...parameters,
  });
};

const saveConsent = (allowed: boolean) => {
  try {
    localStorage.setItem(CONSENT_KEY, allowed ? 'granted' : 'denied');
  } catch {
    // Storage can be unavailable in hardened browsers; consent remains page-local.
  }
  if (root) root.hidden = true;
  if (allowed) loadAnalytics();
};

let analytics_consent: string | null = null;
try {
  analytics_consent = localStorage.getItem(CONSENT_KEY);
} catch {
  analytics_consent = null;
}

if (analytics_consent === 'granted') loadAnalytics();
else if (analytics_consent !== 'denied' && root) root.hidden = false;

root?.querySelector('[data-analytics-accept]')?.addEventListener('click', () => saveConsent(true));
root?.querySelector('[data-analytics-decline]')?.addEventListener('click', () => saveConsent(false));

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element
    ? event.target.closest<HTMLElement>('[data-analytics-event]')
    : null;
  const eventName = link?.dataset.analyticsEvent;
  if (!link || !eventName) return;
  window.ncTrack?.(eventName, {
    addon_name: link.dataset.analyticsAddon ?? '',
    cta_location: link.dataset.analyticsLocation ?? '',
    destination: link instanceof HTMLAnchorElement ? link.href : '',
  });
});

document.addEventListener('astro:page-load', trackPageView);

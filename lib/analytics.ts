/**
 * Envío de eventos al pixel de Meta y a GA4. Ambos scripts se cargan en
 * `app/layout.tsx` con `strategy="afterInteractive"`, así que pueden no estar
 * listos todavía (o venir bloqueados por una extensión): en ese caso estas
 * funciones no hacen nada, en vez de romper la interacción del usuario.
 */

type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Evento estándar de Meta (Lead, Contact, etc.) y su equivalente en GA4. */
export function trackEvent(name: string, params: EventParams = {}) {
  window.fbq?.("track", name, params);
  window.gtag?.("event", name, params);
}

/** Evento propio, para acciones que no encajan en un estándar de Meta. */
export function trackCustomEvent(name: string, params: EventParams = {}) {
  window.fbq?.("trackCustom", name, params);
  window.gtag?.("event", name, params);
}

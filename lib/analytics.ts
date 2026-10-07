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

/**
 * Acciones de conversión de Google Ads. La etiqueta `AW-18340989681` se carga
 * junto a GA4 en `app/layout.tsx`; aquí solo va el `send_to` de cada acción.
 */
export const ADS_CONVERSIONS = {
  /** Clic a WhatsApp, teléfono o correo (el mismo `Contact` de Meta y GA4). */
  contact: "AW-18340989681/ycS9CKm0xJQdEPGV1alE",
} as const;

/** Conversión de Google Ads, con el valor fijo que definió la cuenta. */
export function trackAdsConversion(sendTo: string) {
  window.gtag?.("event", "conversion", { send_to: sendTo, value: 1.0, currency: "MXN" });
}

/**
 * Datos de contacto de Ember Lab. Un solo lugar para el número: lo usan la
 * burbuja de WhatsApp, los defaults de las landings, el PDF del diagnóstico y
 * los correos. Los CTAs editables viven en Sanity y hay que cambiarlos allá.
 */

/** 442 676 2707 con lada de México, en el formato que pide wa.me. */
export const WHATSAPP_NUMBER = "524426762707";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = "hola@emberlab.mx";

/** Enlace de WhatsApp con un mensaje ya escrito, para saber de dónde viene. */
export function whatsappUrl(text?: string): string {
  return text ? `${WHATSAPP_URL}?text=${encodeURIComponent(text)}` : WHATSAPP_URL;
}

const WHATSAPP_HOSTS = ["wa.me", "api.whatsapp.com", "web.whatsapp.com"];

/**
 * `target` de un botón. WhatsApp abre siempre en otra pestaña, diga lo que
 * diga Sanity ("Abrir en" viene en "Misma pestaña" por default): así la página
 * sigue abierta y alcanza a mandar la conversión de Google Ads.
 */
export function linkTarget(href?: string, target?: string): string | undefined {
  try {
    if (href && WHATSAPP_HOSTS.includes(new URL(href).hostname)) return "_blank";
  } catch {
    // Enlace relativo o ancla (#diagnostico): no es WhatsApp.
  }
  return target;
}

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

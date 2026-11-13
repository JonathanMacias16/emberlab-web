/**
 * Formulario corto de la landing `/hablemos` ("Hablemos de tu proyecto"):
 * 5 datos y le escribimos al prospecto por WhatsApp. Compartido entre el
 * formulario (cliente) y `/api/contacto` (servidor).
 */

export const LEAD_NEEDS = [
  "Sitio nuevo",
  "Sitio corporativo",
  "Rediseño",
  "Landing para campaña",
  "Tienda en línea",
  "Aún no lo sé",
] as const;

export type LeadNeed = (typeof LEAD_NEEDS)[number];

export interface ContactLeadRequest {
  name: string;
  whatsapp: string;
  email: string;
  need: LeadNeed;
  business: string;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Errores por campo; vacío si todo está bien. */
export function validateLead(lead: Partial<ContactLeadRequest>): Partial<Record<keyof ContactLeadRequest, string>> {
  const errors: Partial<Record<keyof ContactLeadRequest, string>> = {};
  if (!lead.name?.trim()) errors.name = "Escribe tu nombre.";
  if ((lead.whatsapp ?? "").replace(/\D/g, "").length < 10) errors.whatsapp = "Escribe tu número a 10 dígitos.";
  if (!EMAIL_RE.test(lead.email?.trim() ?? "")) errors.email = "Revisa tu correo.";
  if (!lead.need || !LEAD_NEEDS.includes(lead.need)) errors.need = "Elige una opción.";
  if (!lead.business?.trim()) errors.business = "¿Cómo se llama tu negocio?";
  return errors;
}

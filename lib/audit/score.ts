import type { Check, Measured, PageSignals, RobotsInfo, Score, SitemapInfo } from "./types";

/**
 * Rúbricas fijas. Los pesos son una decisión editorial de Ember Lab, pero son
 * explícitos y deterministas: el mismo HTML siempre da el mismo score, y cada
 * punto se puede rastrear a un check con lo que se encontró.
 */

// Por debajo de esta fracción de puntos evaluables no se publica un número:
// sería un score calculado sobre muy poca evidencia.
const MIN_EVALUABLE_RATIO = 0.5;

function toScore(checks: Check[]): Score {
  const total = checks.reduce((sum, c) => sum + c.points, 0);
  const evaluable = checks.filter((c) => c.passed !== null);
  const evaluablePoints = evaluable.reduce((sum, c) => sum + c.points, 0);
  if (evaluablePoints < total * MIN_EVALUABLE_RATIO) {
    return {
      status: "unavailable",
      reason: "No hubo suficiente información del sitio para calcular este score.",
      checks,
    };
  }
  const earned = evaluable.filter((c) => c.passed).reduce((sum, c) => sum + c.points, 0);
  return { status: "ok", value: Math.round((earned / evaluablePoints) * 100), checks };
}

const CLIENT_RENDERED_REASON =
  "El sitio se construye con JavaScript en el navegador y su HTML casi no tiene contenido. Sin cargarlo en un navegador no se puede evaluar sin inventar.";

export function scoreSeoBasico(
  page: Measured<PageSignals>,
  robots: Measured<RobotsInfo>,
  sitemap: Measured<SitemapInfo>
): Score {
  if (page.status === "unavailable") return { status: "unavailable", reason: page.reason };
  if (page.value.likelyClientRendered) return { status: "unavailable", reason: CLIENT_RENDERED_REASON };
  const p = page.value;

  const title = p.title ?? "";
  const description = p.metaDescription ?? "";

  const checks: Check[] = [
    {
      id: "https",
      label: "El sitio usa conexión segura (HTTPS)",
      passed: p.https,
      points: 10,
      detail: p.https ? "Sí." : "El sitio carga sin HTTPS.",
    },
    {
      id: "indexable",
      label: "La página permite que Google la indexe",
      passed: !p.noindex,
      points: 15,
      detail: p.noindex ? "Tiene la instrucción noindex: Google no la mostrará en resultados." : "No hay noindex.",
    },
    {
      id: "robots",
      label: "robots.txt no bloquea el sitio completo",
      passed: robots.status === "ok" ? !robots.value.blocksAll : null,
      points: 10,
      detail:
        robots.status === "unavailable"
          ? robots.reason
          : !robots.value.found
            ? "No hay robots.txt (no bloquea nada)."
            : robots.value.blocksAll
              ? "robots.txt le pide a Google no rastrear ninguna página."
              : "No bloquea el sitio completo.",
    },
    {
      id: "title",
      label: "Tiene título de página",
      passed: title.length > 0,
      points: 10,
      detail: title ? `"${title}"` : "No tiene <title>.",
    },
    {
      id: "title-length",
      label: "El título tiene un largo adecuado (30–65 caracteres)",
      passed: title ? title.length >= 30 && title.length <= 65 : null,
      points: 5,
      detail: title ? `${title.length} caracteres.` : "Sin título que medir.",
    },
    {
      id: "description",
      label: "Tiene meta descripción",
      passed: description.length > 0,
      points: 10,
      detail: description ? `"${description}"` : "No tiene meta description.",
    },
    {
      id: "description-length",
      label: "La descripción tiene un largo adecuado (70–160 caracteres)",
      passed: description ? description.length >= 70 && description.length <= 160 : null,
      points: 5,
      detail: description ? `${description.length} caracteres.` : "Sin descripción que medir.",
    },
    {
      id: "h1",
      label: "Tiene un solo encabezado principal (h1)",
      passed: p.h1.length === 1,
      points: 10,
      detail:
        p.h1.length === 0 ? "No tiene h1." : p.h1.length === 1 ? `"${p.h1[0]}"` : `Tiene ${p.h1.length} h1.`,
    },
    {
      id: "viewport",
      label: "Está configurado para verse en móvil (meta viewport)",
      passed: p.hasViewport,
      points: 10,
      detail: p.hasViewport ? "Sí." : "No tiene meta viewport.",
    },
    {
      id: "lang",
      label: "Declara el idioma de la página",
      passed: p.lang !== null,
      points: 5,
      detail: p.lang ? `lang="${p.lang}"` : "No declara idioma.",
    },
    {
      id: "canonical",
      label: "Declara URL canónica",
      passed: p.canonical !== null,
      points: 5,
      detail: p.canonical ?? "No tiene link canonical.",
    },
    {
      id: "sitemap",
      label: "Tiene sitemap",
      passed: sitemap.status === "ok" ? sitemap.value.found : null,
      points: 5,
      detail:
        sitemap.status === "unavailable"
          ? sitemap.reason
          : sitemap.value.found
            ? sitemap.value.url!
            : "No se encontró sitemap.",
    },
    {
      id: "structured-data",
      label: "Tiene datos estructurados (schema.org)",
      passed: p.structuredDataTypes.length > 0,
      points: 5,
      detail: p.structuredDataTypes.length ? p.structuredDataTypes.join(", ") : "No tiene JSON-LD.",
    },
    {
      id: "open-graph",
      label: "Se ve bien al compartirse en redes (Open Graph)",
      passed: Boolean(p.openGraph.title && p.openGraph.image),
      points: 5,
      detail:
        p.openGraph.title && p.openGraph.image
          ? "Tiene título e imagen para compartir."
          : "Le falta og:title u og:image.",
    },
  ];

  return toScore(checks);
}

export function scoreConversion(page: Measured<PageSignals>): Score {
  if (page.status === "unavailable") return { status: "unavailable", reason: page.reason };
  if (page.value.likelyClientRendered) return { status: "unavailable", reason: CLIENT_RENDERED_REASON };
  const p = page.value;

  const nativeForms = p.forms.filter((f) => f.fieldCount > 0 && !f.isSearch);
  const hasForm = nativeForms.length > 0 || p.embeddedForms.length > 0;
  const formAsksContact = nativeForms.some((f) => f.asksEmail || f.asksPhone);

  const channels = [
    hasForm && "formulario",
    p.whatsappLinks.length > 0 && "WhatsApp",
    p.phoneLinks.length > 0 && "teléfono",
    p.emailLinks.length > 0 && "correo",
  ].filter(Boolean) as string[];

  const checks: Check[] = [
    {
      id: "form",
      label: "Tiene formulario de contacto",
      passed: hasForm,
      points: 25,
      detail: hasForm
        ? [
            nativeForms.length ? `${nativeForms.length} formulario(s) en la página` : "",
            p.embeddedForms.length ? `incrustado: ${p.embeddedForms.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("; ")
        : "No se encontró formulario.",
    },
    {
      id: "form-contact",
      label: "El formulario pide un dato de contacto (correo o teléfono)",
      // Los formularios incrustados de terceros no se pueden inspeccionar por dentro.
      passed: nativeForms.length > 0 ? formAsksContact : p.embeddedForms.length > 0 ? null : false,
      points: 10,
      detail:
        nativeForms.length > 0
          ? formAsksContact
            ? "Sí."
            : "Ningún formulario pide correo ni teléfono."
          : p.embeddedForms.length > 0
            ? "El formulario es de un tercero y no se puede revisar por dentro."
            : "No hay formulario.",
    },
    {
      id: "whatsapp",
      label: "Tiene enlace directo a WhatsApp",
      passed: p.whatsappLinks.length > 0,
      points: 15,
      detail: p.whatsappLinks[0]?.href ?? "No se encontró.",
    },
    {
      id: "phone",
      label: "Tiene teléfono con un toque para llamar",
      passed: p.phoneLinks.length > 0,
      points: 15,
      detail: p.phoneLinks[0]?.href ?? "No hay enlaces tel:.",
    },
    {
      id: "email",
      label: "Tiene correo con enlace directo",
      passed: p.emailLinks.length > 0,
      points: 5,
      detail: p.emailLinks[0]?.href ?? "No hay enlaces mailto:.",
    },
    {
      id: "cta",
      label: "Tiene llamadas a la acción claras",
      passed: p.ctas.length > 0,
      points: 20,
      detail: p.ctas.length ? p.ctas.slice(0, 5).map((c) => `"${c.text}"`).join(", ") : "No se encontraron.",
    },
    {
      id: "channels",
      label: "Ofrece al menos dos formas de contacto",
      passed: channels.length >= 2,
      points: 10,
      detail: channels.length ? channels.join(", ") : "Ninguna.",
    },
  ];

  return toScore(checks);
}

export const EXPERIENCIA_USUARIO_PENDIENTE: Score = {
  status: "unavailable",
  reason:
    "Velocidad, estabilidad visual y accesibilidad solo se miden cargando la página en un navegador. Pendiente de integrar PageSpeed Insights.",
};

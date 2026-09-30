import type {
  Check,
  Measured,
  PageSignals,
  PageSpeedInsights,
  RobotsInfo,
  Score,
  SitemapInfo,
} from "./types";

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

/** [frase para el cliente, dato corto]. */
type Wording = [plain: string, badge: string];

/**
 * La frase del PDF según el resultado. Vive junto a cada check porque depende
 * de lo que se midió ("5 títulos", "14 caracteres"), y así el reporte no tiene
 * que volver a interpretar el HTML. `unknown` solo lo llevan los checks que
 * pueden quedar sin evaluar.
 */
function say(passed: boolean | null, ok: Wording, fail: Wording, unknown: Wording = ["", ""]) {
  const [plain, badge] = passed === null ? unknown : passed ? ok : fail;
  return { plain, badge };
}

export function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;
}

function shorten(text: string, max = 28): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const LANGUAGE_NAMES: Record<string, string> = {
  "es-mx": "español de México",
  es: "español",
  en: "inglés",
  "en-us": "inglés",
};

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
  const language = p.lang ? LANGUAGE_NAMES[p.lang.toLowerCase()] : undefined;

  const robotsPassed = robots.status === "ok" ? !robots.value.blocksAll : null;
  const titleLengthPassed = title ? title.length >= 30 && title.length <= 65 : null;
  const descriptionLengthPassed = description ? description.length >= 70 && description.length <= 160 : null;
  const sitemapPassed = sitemap.status === "ok" ? sitemap.value.found : null;
  const hasOpenGraph = Boolean(p.openGraph.title && p.openGraph.image);

  const checks: Check[] = [
    {
      id: "https",
      label: "El sitio usa conexión segura (HTTPS)",
      passed: p.https,
      points: 10,
      detail: p.https ? "Sí." : "El sitio carga sin HTTPS.",
      ...say(
        p.https,
        ["Tu sitio es seguro: el navegador no muestra advertencias.", "HTTPS"],
        ["Tu sitio no usa conexión segura y el navegador puede advertirlo.", "Sin HTTPS"],
      ),
    },
    {
      id: "indexable",
      label: "La página permite que Google la indexe",
      passed: !p.noindex,
      points: 15,
      detail: p.noindex ? "Tiene la instrucción noindex: Google no la mostrará en resultados." : "No hay noindex.",
      ...say(
        !p.noindex,
        ["Google tiene permiso para mostrar tu sitio.", "Indexable"],
        ["Tu página le pide a Google que no la muestre en los resultados.", "Oculta"],
      ),
    },
    {
      id: "robots",
      label: "robots.txt no bloquea el sitio completo",
      passed: robotsPassed,
      points: 10,
      detail:
        robots.status === "unavailable"
          ? robots.reason
          : !robots.value.found
            ? "No hay robots.txt (no bloquea nada)."
            : robots.value.blocksAll
              ? "robots.txt le pide a Google no rastrear ninguna página."
              : "No bloquea el sitio completo.",
      ...say(
        robotsPassed,
        ["Nada le impide a Google recorrer tu sitio.", "robots.txt"],
        ["Tu sitio le pide a Google que no recorra ninguna página.", "Bloqueado"],
        ["Si Google puede recorrer tu sitio: no pudimos revisarlo.", "No cuenta"]
      ),
    },
    {
      id: "title",
      label: "Tiene título de página",
      passed: title.length > 0,
      points: 10,
      detail: title ? `"${title}"` : "No tiene <title>.",
      ...say(
        title.length > 0,
        ["Tu página tiene título.", `«${shorten(title)}»`],
        ["Tu página no tiene título para mostrar en Google.", "Sin título"],
      ),
    },
    {
      id: "title-length",
      label: "El título tiene un largo adecuado (30–65 caracteres)",
      passed: titleLengthPassed,
      points: 5,
      detail: title ? `${title.length} caracteres.` : "Sin título que medir.",
      ...say(
        titleLengthPassed,
        ["Tu título en Google tiene buen largo.", `${title.length} caracteres`],
        [
          title.length < 30
            ? "Tu título en Google es muy corto para explicar qué haces."
            : "Tu título es tan largo que Google lo corta en los resultados.",
          `${title.length} caracteres`,
        ],
        ["El largo de tu título para Google: no hay título que medir.", "No cuenta"]
      ),
    },
    {
      id: "description",
      label: "Tiene meta descripción",
      passed: description.length > 0,
      points: 10,
      detail: description ? `"${description}"` : "No tiene meta description.",
      ...say(
        description.length > 0,
        ["Tú decides el texto que aparece bajo tu nombre en Google.", "Con descripción"],
        ["Google está improvisando el texto que aparece bajo tu nombre en los resultados.", "Sin descripción"],
      ),
    },
    {
      id: "description-length",
      label: "La descripción tiene un largo adecuado (70–160 caracteres)",
      passed: descriptionLengthPassed,
      points: 5,
      detail: description ? `${description.length} caracteres.` : "Sin descripción que medir.",
      ...say(
        descriptionLengthPassed,
        ["Tu descripción para Google tiene buen largo.", `${description.length} caracteres`],
        [
          description.length < 70
            ? "Tu descripción para Google es muy corta para invitar a hacer clic."
            : "Tu descripción es tan larga que Google la corta.",
          `${description.length} caracteres`,
        ],
        ["El largo de tu descripción para Google: no hay descripción que medir.", "No cuenta"]
      ),
    },
    {
      id: "h1",
      label: "Tiene un solo encabezado principal (h1)",
      passed: p.h1.length === 1,
      points: 10,
      detail:
        p.h1.length === 0 ? "No tiene h1." : p.h1.length === 1 ? `"${p.h1[0]}"` : `Tiene ${p.h1.length} h1.`,
      ...say(
        p.h1.length === 1,
        ["Tu página tiene un solo título principal.", "1 título"],
        p.h1.length === 0
          ? ["Tu página no tiene un título principal que le diga a Google de qué trata.", "Sin título principal"]
          : [
              `Tu página tiene ${p.h1.length} títulos principales y Google no sabe cuál es el importante.`,
              `${p.h1.length} títulos`,
            ],
      ),
    },
    {
      id: "viewport",
      label: "Está configurado para verse en móvil (meta viewport)",
      passed: p.hasViewport,
      points: 10,
      detail: p.hasViewport ? "Sí." : "No tiene meta viewport.",
      ...say(
        p.hasViewport,
        ["Tu sitio está hecho para verse bien en celular.", "Móvil"],
        ["Tu sitio no está configurado para verse bien en celular.", "Sin ajuste móvil"],
      ),
    },
    {
      id: "lang",
      label: "Declara el idioma de la página",
      passed: p.lang !== null,
      points: 5,
      detail: p.lang ? `lang="${p.lang}"` : "No declara idioma.",
      ...say(
        p.lang !== null,
        [
          language
            ? `Le dices a Google que tu sitio está en ${language}.`
            : "Le dices a Google en qué idioma está tu sitio.",
          p.lang ?? "",
        ],
        ["No le dices a Google en qué idioma está tu sitio.", "Sin idioma"],
      ),
    },
    {
      id: "canonical",
      label: "Declara URL canónica",
      passed: p.canonical !== null,
      points: 5,
      detail: p.canonical ?? "No tiene link canonical.",
      ...say(
        p.canonical !== null,
        ["Google sabe cuál es la dirección oficial de tu página.", "URL canónica"],
        ["No le dices a Google cuál es la dirección oficial de tu página.", "Sin URL canónica"],
      ),
    },
    {
      id: "sitemap",
      label: "Tiene sitemap",
      passed: sitemapPassed,
      points: 5,
      detail:
        sitemap.status === "unavailable"
          ? sitemap.reason
          : sitemap.value.found
            ? sitemap.value.url!
            : "No se encontró sitemap.",
      ...say(
        sitemapPassed,
        ["Tienes un mapa del sitio para que Google encuentre tus páginas.", "Sitemap"],
        ["No tienes un mapa del sitio que ayude a Google a encontrar tus páginas.", "Sin sitemap"],
        ["Si tienes mapa del sitio: no pudimos revisarlo.", "No cuenta"]
      ),
    },
    {
      id: "structured-data",
      label: "Tiene datos estructurados (schema.org)",
      passed: p.structuredDataTypes.length > 0,
      points: 5,
      detail: p.structuredDataTypes.length ? p.structuredDataTypes.join(", ") : "No tiene JSON-LD.",
      ...say(
        p.structuredDataTypes.length > 0,
        ["Le das a Google datos de tu negocio en un formato que entiende.", "Datos estructurados"],
        ["No le das a Google datos de tu negocio en un formato que entienda.", "Sin datos"],
      ),
    },
    {
      id: "open-graph",
      label: "Se ve bien al compartirse en redes (Open Graph)",
      passed: hasOpenGraph,
      points: 5,
      detail: hasOpenGraph ? "Tiene título e imagen para compartir." : "Le falta og:title u og:image.",
      ...say(
        hasOpenGraph,
        ["Cuando alguien comparte tu enlace, se ve con título e imagen.", "Redes"],
        ["Cuando alguien comparte tu enlace, no se ve con título e imagen.", "Sin vista previa"],
      ),
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
  // Los formularios incrustados de terceros no se pueden inspeccionar por dentro.
  const formContactPassed = nativeForms.length > 0 ? formAsksContact : p.embeddedForms.length > 0 ? null : false;

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
      ...say(
        hasForm,
        ["Tienes un formulario para que te dejen sus datos.", p.embeddedForms[0] ?? "Formulario"],
        ["No hay un formulario para dejarte sus datos.", "Sin formulario"],
      ),
    },
    {
      id: "form-contact",
      label: "El formulario pide un dato de contacto (correo o teléfono)",
      passed: formContactPassed,
      points: 10,
      detail:
        nativeForms.length > 0
          ? formAsksContact
            ? "Sí."
            : "Ningún formulario pide correo ni teléfono."
          : p.embeddedForms.length > 0
            ? "El formulario es de un tercero y no se puede revisar por dentro."
            : "No hay formulario.",
      ...say(
        formContactPassed,
        ["Tu formulario pide un correo o teléfono para responder.", "Con contacto"],
        hasForm
          ? ["Tu formulario no pide correo ni teléfono para responderle a quien escribe.", "Sin contacto"]
          : ["Sin formulario, no hay dónde pedir un correo o teléfono para responder.", "Sin formulario"],
        ["Tu formulario es de otra plataforma y no pudimos revisarlo por dentro.", "No cuenta"]
      ),
    },
    {
      id: "whatsapp",
      label: "Tiene enlace directo a WhatsApp",
      passed: p.whatsappLinks.length > 0,
      points: 15,
      detail: p.whatsappLinks[0]?.href ?? "No se encontró.",
      ...say(
        p.whatsappLinks.length > 0,
        ["Tienes un botón para que te escriban por WhatsApp.", "WhatsApp"],
        ["No hay un botón para escribirte por WhatsApp.", "No encontrado"],
      ),
    },
    {
      id: "phone",
      label: "Tiene teléfono con un toque para llamar",
      passed: p.phoneLinks.length > 0,
      points: 15,
      detail: p.phoneLinks[0]?.href ?? "No hay enlaces tel:.",
      ...say(
        p.phoneLinks.length > 0,
        ["Tu teléfono se marca con un toque desde el celular.", "Teléfono"],
        ["Tu teléfono no se puede marcar con un toque desde el celular.", "Sin enlace"],
      ),
    },
    {
      id: "email",
      label: "Tiene correo con enlace directo",
      passed: p.emailLinks.length > 0,
      points: 5,
      detail: p.emailLinks[0]?.href ?? "No hay enlaces mailto:.",
      ...say(
        p.emailLinks.length > 0,
        ["Tu correo abre un mensaje con un clic.", "Correo"],
        ["Tu correo no abre un mensaje con un clic.", "Sin enlace"],
      ),
    },
    {
      id: "cta",
      label: "Tiene llamadas a la acción claras",
      passed: p.ctas.length > 0,
      points: 20,
      detail: p.ctas.length ? p.ctas.slice(0, 5).map((c) => `"${c.text}"`).join(", ") : "No se encontraron.",
      ...say(
        p.ctas.length > 0,
        ["Tienes un botón que invita a contactarte.", p.ctas[0] ? `«${shorten(p.ctas[0].text, 22)}»` : ""],
        ["No hay un botón que invite a dar el siguiente paso.", "Sin botón"],
      ),
    },
    {
      id: "channels",
      label: "Ofrece al menos dos formas de contacto",
      passed: channels.length >= 2,
      points: 10,
      detail: channels.length ? channels.join(", ") : "Ninguna.",
      ...say(
        channels.length >= 2,
        [`Quien quiere contactarte tiene ${channels.length} formas de hacerlo.`, `${channels.length} formas`],
        channels.length === 0
          ? ["Quien quiere contactarte tiene 0 formas de hacerlo.", "Ninguna"]
          : ["Quien quiere contactarte tiene una sola forma de hacerlo.", `Solo ${channels[0]}`],
      ),
    },
  ];

  return toScore(checks);
}

/**
 * Los umbrales son los de Google para Core Web Vitals, no criterio nuestro.
 * Se puntúa el laboratorio porque siempre está y es comparable entre sitios;
 * los datos de usuarios reales van en el reporte aparte (ver `pagespeed.ts`).
 */
export function scoreExperienciaUsuario(psi: Measured<PageSpeedInsights>): Score {
  if (psi.status === "unavailable") return { status: "unavailable", reason: psi.reason };
  const lab = psi.value.lab;

  const lcpPassed = lab.lcpMs === null ? null : lab.lcpMs <= 2500;
  const clsPassed = lab.cls === null ? null : lab.cls <= 0.1;
  const tbtPassed = lab.tbtMs === null ? null : lab.tbtMs <= 200;
  const a11yPassed = lab.accessibility === null ? null : lab.accessibility >= 90;
  const bpPassed = lab.bestPractices === null ? null : lab.bestPractices >= 90;

  const lcp = lab.lcpMs === null ? "" : formatMs(lab.lcpMs);
  const cls = lab.cls === null ? "" : lab.cls.toFixed(2);
  const tbt = lab.tbtMs === null ? "" : formatMs(lab.tbtMs);

  const checks: Check[] = [
    {
      id: "lcp",
      label: "El contenido principal aparece rápido (2.5 s o menos)",
      passed: lcpPassed,
      points: 25,
      detail: lab.lcpMs === null ? "No se pudo medir." : `Tarda ${lcp}.`,
      ...say(
        lcpPassed,
        [`Tu contenido principal aparece en ${lcp}, a tiempo.`, lcp],
        [`Tu página tarda ${lcp} en terminar de cargar su contenido principal.`, "Recomendado: 2.5 s"],
        ["Cuánto tarda en cargar tu contenido principal: no se pudo medir.", "No cuenta"]
      ),
    },
    {
      id: "cls",
      label: "El contenido no se mueve mientras carga (CLS de 0.1 o menos)",
      passed: clsPassed,
      points: 20,
      detail: lab.cls === null ? "No se pudo medir." : `CLS de ${cls}.`,
      ...say(
        clsPassed,
        ["Tu página no brinca mientras carga.", cls],
        ["El contenido de tu página brinca mientras carga.", `${cls} (máx. 0.1)`],
        ["Si tu página brinca mientras carga: no se pudo medir.", "No cuenta"]
      ),
    },
    {
      id: "tbt",
      label: "La página responde pronto al primer toque (200 ms o menos bloqueada)",
      passed: tbtPassed,
      points: 15,
      detail: lab.tbtMs === null ? "No se pudo medir." : `${tbt} bloqueada.`,
      ...say(
        tbtPassed,
        ["Tu página responde rápido al primer toque.", `${tbt} bloqueada`],
        ["Al primer toque, la página tarda en reaccionar.", `${tbt} bloqueada`],
        ["Qué tan rápido responde al primer toque: no se pudo medir.", "No cuenta"]
      ),
    },
    {
      id: "accessibility",
      label: "Es accesible (90 o más en Lighthouse)",
      passed: a11yPassed,
      points: 25,
      detail: lab.accessibility === null ? "No se pudo medir." : `${lab.accessibility}/100.`,
      ...say(
        a11yPassed,
        ["Tu sitio es fácil de usar para todas las personas.", `${lab.accessibility}/100`],
        ["A algunas personas les cuesta usar tu sitio: contraste, tamaños o etiquetas.", `${lab.accessibility}/100`],
        ["Qué tan fácil es de usar para todas las personas: no se pudo medir.", "No cuenta"]
      ),
    },
    {
      id: "best-practices",
      label: "Sigue las buenas prácticas web (90 o más en Lighthouse)",
      passed: bpPassed,
      points: 15,
      detail: lab.bestPractices === null ? "No se pudo medir." : `${lab.bestPractices}/100.`,
      ...say(
        bpPassed,
        ["Tu sitio sigue las buenas prácticas técnicas.", `${lab.bestPractices}/100`],
        ["Tu sitio no sigue varias buenas prácticas técnicas.", `${lab.bestPractices}/100`],
        ["Si sigue las buenas prácticas técnicas: no se pudo medir.", "No cuenta"]
      ),
    },
  ];

  return toScore(checks);
}

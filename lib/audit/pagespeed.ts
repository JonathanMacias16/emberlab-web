import type {
  FieldMetric,
  FieldMetrics,
  Filmstrip,
  LabMetrics,
  Measured,
  MetricRating,
  DesignFinding,
  Opportunity,
  PageSpeedInsights,
  Screenshots,
} from "./types";

/**
 * PageSpeed Insights: lo único de este módulo que no medimos nosotros.
 *
 * Google carga la página en un Chrome real, así que da lo que el HTML crudo no
 * puede: velocidad, estabilidad visual y accesibilidad. Devuelve dos cosas que
 * conviene no mezclar:
 *
 * - Laboratorio (Lighthouse): una carga controlada. Siempre viene y es
 *   comparable entre sitios porque las condiciones son idénticas.
 * - Campo (CrUX): usuarios reales de los últimos 28 días. Es el dato que de
 *   verdad importa, pero solo existe si el sitio junta tráfico suficiente.
 *
 * El score sale del laboratorio y el campo se reporta aparte: un score que
 * dependiera de un dato que la mayoría de los sitios chicos no tiene no sería
 * comparable ni estaría disponible casi nunca.
 *
 * Aquí no usamos `safeFetch`: el host es googleapis.com, fijo y de confianza.
 * La URL del desconocido viaja como parámetro y es Google quien la visita.
 */

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// Google carga la página entera en un navegador; los 10 s de safeFetch no
// alcanzan ni de cerca. Lo que tarda depende sobre todo de la cola de Google:
// el mismo sitio puede medirse en 15 s o en más de un minuto, así que este
// margen es generoso a propósito. Quedarse corto no da un error visible, da un
// reporte sin capturas ni velocidad, que es peor.
const TIMEOUT_MS = 75_000;

// Debajo de esto la "oportunidad" no vale la pena mencionarla en un reporte.
const MIN_SAVINGS_MS = 100;
const MAX_OPPORTUNITIES = 5;

const CRUX_RATING: Record<string, MetricRating> = {
  FAST: "bueno",
  AVERAGE: "mejorable",
  SLOW: "malo",
};

interface PsiAuditResult {
  title?: string;
  numericValue?: number;
  score?: number | null;
  /** "binary", "notApplicable", "informative"… */
  scoreDisplayMode?: string;
  details?: {
    overallSavingsMs?: number;
    /** `final-screenshot`: el JPEG en data URI. */
    data?: string;
    /** `screenshot-thumbnails`: un cuadro por instante de la carga.
     *  En las auditorías de accesibilidad, los elementos que fallan. */
    items?: Array<{
      timing?: number;
      data?: string;
      node?: { nodeLabel?: string; snippet?: string };
    }>;
  };
}

interface PsiMetric {
  percentile?: number;
  category?: string;
}

interface PsiLoadingExperience {
  metrics?: Record<string, PsiMetric>;
  overall_category?: string;
  /** Google rellenó con datos del dominio porque la URL no tenía suficientes. */
  origin_fallback?: boolean;
}

interface PsiResponse {
  loadingExperience?: PsiLoadingExperience;
  originLoadingExperience?: PsiLoadingExperience;
  lighthouseResult?: {
    requestedUrl?: string;
    finalUrl?: string;
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, PsiAuditResult>;
  };
  error?: { message?: string };
}

function categoryScore(category: { score?: number | null } | undefined): number | null {
  // Lighthouse da 0–1, y `null` cuando la categoría no se pudo evaluar.
  return typeof category?.score === "number" ? Math.round(category.score * 100) : null;
}

function auditValue(audit: PsiAuditResult | undefined): number | null {
  return typeof audit?.numericValue === "number" ? audit.numericValue : null;
}

function readLab(lighthouse: NonNullable<PsiResponse["lighthouseResult"]>): LabMetrics {
  const audits = lighthouse.audits ?? {};
  const categories = lighthouse.categories ?? {};
  return {
    lcpMs: auditValue(audits["largest-contentful-paint"]),
    speedIndexMs: auditValue(audits["speed-index"]),
    cls: auditValue(audits["cumulative-layout-shift"]),
    tbtMs: auditValue(audits["total-blocking-time"]),
    fcpMs: auditValue(audits["first-contentful-paint"]),
    performance: categoryScore(categories["performance"]),
    accessibility: categoryScore(categories["accessibility"]),
    bestPractices: categoryScore(categories["best-practices"]),
  };
}

function readFieldMetric(metric: PsiMetric | undefined, divisor = 1): FieldMetric | null {
  if (typeof metric?.percentile !== "number") return null;
  const rating = CRUX_RATING[metric.category ?? ""];
  if (!rating) return null;
  return { p75: metric.percentile / divisor, rating };
}

function readField(json: PsiResponse): Measured<FieldMetrics> {
  // `loadingExperience` es la página; si Google no tenía suficientes visitas de
  // ella, viene rellenado con las del dominio y lo marca con origin_fallback.
  const fromUrl = json.loadingExperience;
  const usable = fromUrl?.metrics && Object.keys(fromUrl.metrics).length > 0 ? fromUrl : json.originLoadingExperience;
  if (!usable?.metrics || Object.keys(usable.metrics).length === 0) {
    return {
      status: "unavailable",
      reason:
        "El sitio no tiene visitas suficientes para que Google publique datos de usuarios reales. Solo hay medición de laboratorio.",
    };
  }

  const scope: FieldMetrics["scope"] = usable === fromUrl && !fromUrl?.origin_fallback ? "url" : "origin";
  const metrics = usable.metrics;

  return {
    status: "ok",
    value: {
      scope,
      lcp: readFieldMetric(metrics["LARGEST_CONTENTFUL_PAINT_MS"]),
      // CrUX publica el CLS como entero multiplicado por 100: 10 es un CLS de 0.10.
      cls: readFieldMetric(metrics["CUMULATIVE_LAYOUT_SHIFT_SCORE"], 100),
      inp: readFieldMetric(metrics["INTERACTION_TO_NEXT_PAINT"]),
      overall: CRUX_RATING[usable.overall_category ?? ""] ?? null,
    },
  };
}

/**
 * Las capturas que Lighthouse tomó al cargar la página. Valen más que
 * cualquier descripción nuestra: es el sitio como lo ve un visitante en su
 * teléfono. Vienen como data URI de JPEG, que es lo que el PDF puede incrustar.
 */
function readScreenshots(audits: Record<string, PsiAuditResult>): Screenshots {
  const isJpegDataUri = (data: string | undefined): data is string =>
    typeof data === "string" && data.startsWith("data:image/jpeg;base64,");

  const final = audits["final-screenshot"]?.details?.data;
  const frames = audits["screenshot-thumbnails"]?.details?.items ?? [];

  const filmstrip: Filmstrip[] = frames
    .filter((frame): frame is { timing: number; data: string } =>
      typeof frame.timing === "number" && isJpegDataUri(frame.data)
    )
    .map((frame) => ({ timingMs: frame.timing, data: frame.data }));

  return { final: isJpegDataUri(final) ? final : null, filmstrip };
}

/**
 * Accesibilidad y diseño, medidos por Lighthouse sobre la página ya cargada.
 *
 * Esto es lo que separa un juicio de una medición: el contraste insuficiente o
 * un botón sin nombre no son opinión, y Lighthouse dice exactamente en qué
 * elemento pasan. Se dejan fuera las que ya revisamos por nuestra cuenta
 * (idioma, título) y las que no aplican a la página.
 */
const DESIGN_AUDITS = [
  "color-contrast",
  "target-size",
  "font-size",
  "heading-order",
  "image-alt",
  "link-name",
  "button-name",
  "label",
];

const MAX_DESIGN_ITEMS = 4;

function readDesign(audits: Record<string, PsiAuditResult>): DesignFinding[] {
  const findings: DesignFinding[] = [];
  for (const id of DESIGN_AUDITS) {
    const audit = audits[id];
    // `notApplicable` = la página no tiene ese tipo de elemento; no es un
    // acierto ni un fallo, y meterlo solo ensucia el reporte.
    if (!audit || audit.scoreDisplayMode !== "binary" || typeof audit.score !== "number") continue;

    const items = (audit.details?.items ?? [])
      .map((item) => ({
        label: (item.node?.nodeLabel ?? "").replace(/\s+/g, " ").trim(),
        snippet: (item.node?.snippet ?? "").replace(/\s+/g, " ").trim(),
      }))
      .filter((item) => item.label || item.snippet)
      .slice(0, MAX_DESIGN_ITEMS);

    findings.push({ id, title: audit.title ?? id, passed: audit.score === 1, items });
  }
  return findings;
}

function readOpportunities(audits: Record<string, PsiAuditResult>): Opportunity[] {
  return Object.entries(audits)
    .map(([id, audit]) => ({
      id,
      title: audit.title ?? id,
      savingsMs: audit.details?.overallSavingsMs ?? 0,
    }))
    .filter((o) => o.savingsMs >= MIN_SAVINGS_MS)
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, MAX_OPPORTUNITIES);
}

function describeError(status: number, message: string | undefined): string {
  if (status === 400) {
    // El motivo real suele ser que Lighthouse no pudo cargar la página.
    return "Google no pudo cargar la página para medirla. Puede estar bloqueando robots, pidiendo contraseña o tardando demasiado.";
  }
  if (status === 403 || status === 429) {
    return "Se agotó por ahora la cuota de PageSpeed Insights.";
  }
  if (status >= 500) {
    return "PageSpeed Insights no está disponible en este momento.";
  }
  return message
    ? `PageSpeed Insights respondió con un error (${status}).`
    : `PageSpeed Insights respondió con código ${status}.`;
}

export async function fetchPageSpeed(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<Measured<PageSpeedInsights>> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return {
      status: "unavailable",
      reason: "Falta configurar la llave de PageSpeed Insights en el servidor.",
    };
  }

  const endpoint = new URL(ENDPOINT);
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("strategy", strategy);
  // Los títulos de las oportunidades llegan traducidos y van directo al reporte.
  endpoint.searchParams.set("locale", "es");
  for (const category of ["performance", "accessibility", "best-practices"]) {
    endpoint.searchParams.append("category", category);
  }

  let res: Response;
  try {
    res = await fetch(endpoint, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === "TimeoutError";
    return {
      status: "unavailable",
      reason: timedOut
        ? "PageSpeed Insights tardó demasiado en medir el sitio."
        : "No se pudo consultar PageSpeed Insights.",
    };
  }

  let json: PsiResponse;
  try {
    json = (await res.json()) as PsiResponse;
  } catch {
    return { status: "unavailable", reason: "PageSpeed Insights devolvió una respuesta ilegible." };
  }

  if (!res.ok) {
    return { status: "unavailable", reason: describeError(res.status, json.error?.message) };
  }

  const lighthouse = json.lighthouseResult;
  if (!lighthouse) {
    return { status: "unavailable", reason: "PageSpeed Insights no devolvió resultados para esta página." };
  }

  return {
    status: "ok",
    value: {
      strategy,
      analyzedUrl: lighthouse.finalUrl ?? lighthouse.requestedUrl ?? url,
      lab: readLab(lighthouse),
      field: readField(json),
      opportunities: readOpportunities(lighthouse.audits ?? {}),
      screenshots: readScreenshots(lighthouse.audits ?? {}),
      design: readDesign(lighthouse.audits ?? {}),
    },
  };
}

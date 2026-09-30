/**
 * Resultado del análisis de un sitio. La regla de todo el módulo: cada dato
 * dice si se midió o por qué no. Nada se rellena con valores supuestos.
 */

export type Measured<T> =
  | { status: "ok"; value: T }
  | { status: "unavailable"; reason: string };

export interface Check {
  id: string;
  /** Qué se revisa, en lenguaje de cliente. */
  label: string;
  /** `null` = no se pudo evaluar; no cuenta ni a favor ni en contra. */
  passed: boolean | null;
  /** Peso en la rúbrica. */
  points: number;
  /** Lo que se encontró. */
  detail: string;
  /** La misma revisión en lenguaje de dueño de negocio, según el resultado. Va al PDF. */
  plain: string;
  /** El dato corto que acompaña a `plain`: "14 caracteres", "HTTPS", "98/100". */
  badge: string;
}

export type Score =
  | {
      status: "ok";
      /** 0–100: puntos obtenidos sobre puntos evaluables. */
      value: number;
      checks: Check[];
    }
  | { status: "unavailable"; reason: string; checks?: Check[] };

export interface LinkInfo {
  href: string;
  text: string;
}

export interface FormInfo {
  /** Campos visibles para el usuario (sin hidden/submit/button). */
  fieldCount: number;
  asksEmail: boolean;
  asksPhone: boolean;
  /** Buscador del sitio: es un <form>, pero no sirve para contactar. */
  isSearch: boolean;
}

export interface PageSignals {
  finalUrl: string;
  httpStatus: number;
  https: boolean;
  redirects: string[];
  /** El HTML se cortó por tamaño; lo del final de la página pudo no leerse. */
  truncated: boolean;

  lang: string | null;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  hasViewport: boolean;
  /** `noindex` en meta robots o en el header X-Robots-Tag. */
  noindex: boolean;
  openGraph: { title: string | null; description: string | null; image: string | null };
  /** Tipos de schema.org declarados en JSON-LD (Organization, LocalBusiness…). */
  structuredDataTypes: string[];

  h1: string[];
  h2: string[];
  wordCount: number;
  images: { total: number; missingAlt: number };

  /**
   * Sospecha de sitio que se arma con JavaScript en el navegador: casi sin
   * texto en el HTML pero con scripts. En ese caso el HTML no representa lo que
   * ve el visitante y los scores basados en contenido no se calculan.
   */
  likelyClientRendered: boolean;

  forms: FormInfo[];
  /** Formularios de terceros incrustados (HubSpot, Typeform, Calendly…). */
  embeddedForms: string[];
  phoneLinks: LinkInfo[];
  emailLinks: LinkInfo[];
  whatsappLinks: LinkInfo[];
  /** Botones y enlaces cuyo texto es una llamada a la acción. */
  ctas: LinkInfo[];

  /** Enlaces internos, para decidir qué otras páginas vale la pena leer. */
  internalLinks: LinkInfo[];

  /** El copy real de la página, para poder evaluar qué comunica. */
  content: { text: string; truncated: boolean };
}

/** Otra página del mismo sitio, leída para entender qué ofrece en conjunto. */
export interface CrawledPage {
  url: string;
  title: string | null;
  h1: string[];
  text: string;
  wordCount: number;
}

/**
 * Un hallazgo de accesibilidad y diseño de Lighthouse. A diferencia de las
 * observaciones sobre la captura, esto sí está medido: contraste insuficiente,
 * orden de encabezados, áreas táctiles chicas. Cada uno trae los elementos
 * concretos donde falla.
 */
export interface DesignFinding {
  id: string;
  title: string;
  passed: boolean;
  /** Los elementos señalados, con el texto que llevan dentro. */
  items: Array<{ label: string; snippet: string }>;
}

/** Cómo califica Google una métrica: los umbrales los define él, no nosotros. */
export type MetricRating = "bueno" | "mejorable" | "malo";

/** Medición de laboratorio: una carga controlada de Lighthouse. */
export interface LabMetrics {
  /** Largest Contentful Paint: cuánto tarda en verse el contenido principal. */
  lcpMs: number | null;
  /** Speed Index: qué tan rápido se va llenando de contenido la pantalla. */
  speedIndexMs: number | null;
  /** Cumulative Layout Shift: cuánto se mueve el contenido mientras carga. */
  cls: number | null;
  /** Total Blocking Time: proxy de laboratorio de qué tan pronto responde al toque. */
  tbtMs: number | null;
  fcpMs: number | null;
  /** Scores 0–100 de Lighthouse; `null` si la categoría no se pudo calcular. */
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
}

export interface FieldMetric {
  /** Percentil 75 de usuarios reales: ms para tiempos, sin unidad para CLS. */
  p75: number;
  rating: MetricRating;
}

/** Medición de campo (CrUX): usuarios reales de los últimos 28 días. */
export interface FieldMetrics {
  /**
   * `url` = datos de esta página. `origin` = Google no tenía suficientes
   * visitas de esta página y respondió con las del dominio completo, que es
   * otra cosa y hay que decirlo.
   */
  scope: "url" | "origin";
  lcp: FieldMetric | null;
  cls: FieldMetric | null;
  inp: FieldMetric | null;
  overall: MetricRating | null;
}

/** Un cuadro de cómo se veía la página mientras cargaba. */
export interface Filmstrip {
  /** Milisegundos desde que empezó la carga. */
  timingMs: number;
  /** JPEG en data URI, listo para incrustar. */
  data: string;
}

/**
 * Lo que Chrome vio al cargar la página. Es la evidencia visual del reporte:
 * no describimos el sitio de oídas, lo mostramos.
 */
export interface Screenshots {
  /** La página ya cargada, en viewport móvil. */
  final: string | null;
  /** Los primeros segundos, cuadro por cuadro. */
  filmstrip: Filmstrip[];
}

/** Mejora concreta que Lighthouse detectó, con su ahorro estimado. */
export interface Opportunity {
  id: string;
  title: string;
  savingsMs: number;
}

export interface PageSpeedInsights {
  /** Con qué dispositivo se midió. Móvil es el default. */
  strategy: "mobile" | "desktop";
  /** La URL que Google terminó midiendo. */
  analyzedUrl: string;
  lab: LabMetrics;
  /** Solo existe si el sitio tiene tráfico suficiente para CrUX. */
  field: Measured<FieldMetrics>;
  /** Las de mayor ahorro primero. */
  opportunities: Opportunity[];
  screenshots: Screenshots;
  /** Accesibilidad y diseño medidos: contraste, encabezados, áreas táctiles. */
  design: DesignFinding[];
}

export interface RobotsInfo {
  found: boolean;
  /** `Disallow: /` para todos los agentes: le pide a Google no indexar nada. */
  blocksAll: boolean;
  sitemaps: string[];
}

export interface SitemapInfo {
  found: boolean;
  url: string | null;
}

export interface SiteAudit {
  version: 1;
  requestedUrl: string;
  analyzedAt: string;
  durationMs: number;
  page: Measured<PageSignals>;
  robots: Measured<RobotsInfo>;
  sitemap: Measured<SitemapInfo>;
  /** Lo medido por Google cargando la página en un navegador real. */
  pagespeed: Measured<PageSpeedInsights>;
  /** Otras páginas del sitio, leídas para saber qué ofrece en conjunto. */
  otherPages: Measured<CrawledPage[]>;
  scores: {
    /** SEO on-page básico, desde el HTML. No es un audit de posicionamiento completo. */
    seoBasico: Score;
    conversion: Score;
    /** Velocidad, estabilidad visual y accesibilidad, desde PageSpeed Insights. */
    experienciaUsuario: Score;
  };
}

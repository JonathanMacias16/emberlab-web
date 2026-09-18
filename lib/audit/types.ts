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

  /** Copy real para la valoración cualitativa de comunicación. */
  content: { excerpt: string };
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
  scores: {
    /** SEO on-page básico, desde el HTML. No es un audit de posicionamiento completo. */
    seoBasico: Score;
    conversion: Score;
    /** Requiere cargar la página en un navegador (PageSpeed Insights, pendiente). */
    experienciaUsuario: Score;
  };
}

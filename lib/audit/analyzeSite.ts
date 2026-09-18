import { safeFetch, SafeFetchError } from "./safeFetch";
import type { SafeResponse } from "./safeFetch";
import { parsePage } from "./parse";
import { fetchRobots, findSitemap } from "./robots";
import { EXPERIENCIA_USUARIO_PENDIENTE, scoreConversion, scoreSeoBasico } from "./score";
import type { Measured, PageSignals, SiteAudit } from "./types";

/**
 * Convierte lo que escribe el usuario ("www.tusitio.com", "tusitio.com/") en
 * una URL. Devuelve `null` si no parece una dirección web.
 */
export function normalizeInputUrl(raw: string): { url: URL; schemeGiven: boolean } | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;
  const schemeGiven = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  try {
    const url = new URL(schemeGiven ? value : `https://${value}`);
    // "tusitio" sin dominio no es una dirección pública.
    if (!url.hostname.includes(".") && !url.hostname.startsWith("[")) return null;
    return { url, schemeGiven };
  } catch {
    return null;
  }
}

function describeHttpStatus(status: number): string {
  if (status === 401 || status === 403) {
    return `El sitio bloqueó el acceso a nuestro análisis (código ${status}). Algunos sitios rechazan visitas que no vienen de un navegador.`;
  }
  if (status === 429) return "El sitio limitó las visitas en este momento (código 429).";
  if (status === 404 || status === 410) return `La dirección no existe en el sitio (código ${status}).`;
  if (status >= 500) return `El sitio respondió con un error del servidor (código ${status}).`;
  return `El sitio respondió con código ${status}.`;
}

async function fetchPage(url: URL, schemeGiven: boolean): Promise<SafeResponse> {
  try {
    return await safeFetch(url);
  } catch (err) {
    // Si el usuario no escribió el protocolo probamos https primero; hay sitios
    // pequeños sin certificado válido que solo responden por http.
    const retryable =
      err instanceof SafeFetchError && (err.code === "connection_failed" || err.code === "timeout");
    if (!schemeGiven && url.protocol === "https:" && retryable) {
      const http = new URL(url);
      http.protocol = "http:";
      return await safeFetch(http);
    }
    throw err;
  }
}

export async function analyzeSite(rawUrl: string): Promise<SiteAudit> {
  const startedAt = Date.now();
  const analyzedAt = new Date(startedAt).toISOString();
  const notReached = "No se pudo acceder al sitio.";

  const base = (page: Measured<PageSignals>): SiteAudit => ({
    version: 1,
    requestedUrl: rawUrl,
    analyzedAt,
    durationMs: Date.now() - startedAt,
    page,
    robots: { status: "unavailable", reason: notReached },
    sitemap: { status: "unavailable", reason: notReached },
    scores: {
      seoBasico: { status: "unavailable", reason: page.status === "unavailable" ? page.reason : notReached },
      conversion: { status: "unavailable", reason: page.status === "unavailable" ? page.reason : notReached },
      experienciaUsuario: EXPERIENCIA_USUARIO_PENDIENTE,
    },
  });

  const input = normalizeInputUrl(rawUrl);
  if (!input) {
    return base({ status: "unavailable", reason: "La dirección no es válida. Ejemplo: www.tusitio.com" });
  }

  let res: SafeResponse;
  try {
    res = await fetchPage(input.url, input.schemeGiven);
  } catch (err) {
    const reason = err instanceof SafeFetchError ? err.message : notReached;
    return base({ status: "unavailable", reason });
  }

  if (res.status >= 400) {
    return base({ status: "unavailable", reason: describeHttpStatus(res.status) });
  }
  const contentType = String(res.headers["content-type"] ?? "");
  if (contentType && !/html/i.test(contentType)) {
    return base({ status: "unavailable", reason: `La dirección no es una página web (${contentType}).` });
  }

  const page: Measured<PageSignals> = { status: "ok", value: parsePage(res) };

  // robots.txt y sitemap viven en la raíz del dominio final (después de
  // redirects como http→https o sin www→con www).
  const origin = new URL(res.finalUrl).origin;
  const robots = await fetchRobots(origin);
  const sitemap = await findSitemap(origin, robots.status === "ok" ? robots.value.sitemaps : []);

  return {
    version: 1,
    requestedUrl: rawUrl,
    analyzedAt,
    durationMs: Date.now() - startedAt,
    page,
    robots,
    sitemap,
    scores: {
      seoBasico: scoreSeoBasico(page, robots, sitemap),
      conversion: scoreConversion(page),
      experienciaUsuario: EXPERIENCIA_USUARIO_PENDIENTE,
    },
  };
}

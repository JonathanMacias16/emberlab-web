import * as cheerio from "cheerio";
import { safeFetch, SafeFetchError } from "./safeFetch";
import { decodeHtml, extractText } from "./parse";
import type { CrawledPage, LinkInfo, Measured } from "./types";

/**
 * Lee unas cuantas páginas más del sitio.
 *
 * El home casi nunca dice todo: los servicios, los precios y el "quiénes
 * somos" viven en otra parte. Sin esto, cualquier juicio sobre qué ofrece el
 * sitio se basaría en una sola página.
 *
 * No es un rastreador: son cuatro páginas elegidas por lo que suele importar
 * en un sitio de negocio. Todas pasan por `safeFetch`, igual que el home.
 */

const MAX_PAGES = 4;
const MAX_TEXT = 12_000;
const TIMEOUT_MS = 8_000;

/**
 * Qué buscar, en orden de interés. La primera coincidencia gana, así que un
 * enlace a "/servicios" se prefiere sobre uno a "/blog".
 */
const PRIORITY: Array<[RegExp, string]> = [
  [/servicio|service|que-hacemos|what-we-do|soluciones/i, "servicios"],
  [/producto|product|tienda|shop|catalogo|precio|pricing|plan/i, "productos y precios"],
  [/nosotros|about|quienes|acerca|conoce|historia|equipo/i, "quiénes somos"],
  [/contacto|contact|cotiza|agenda|cita/i, "contacto"],
];

/** Rutas que no aportan a entender la oferta. */
const SKIP = /\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|docx?|xlsx?)$|\/(wp-|feed|cart|carrito|checkout|login|signin|account|privacidad|privacy|terminos|terms|aviso-legal|cookies)/i;

/** Elige hasta `MAX_PAGES` direcciones distintas del home, por prioridad. */
export function pickPages(homeUrl: string, links: LinkInfo[], sitemapUrls: string[]): string[] {
  const home = new URL(homeUrl);
  const candidates = [...links.map((l) => l.href), ...sitemapUrls];

  const chosen: string[] = [];
  const used = new Set<string>([home.href, home.href.replace(/\/$/, "")]);

  const take = (url: string) => {
    const normalized = url.replace(/\/$/, "");
    if (used.has(url) || used.has(normalized)) return;
    used.add(url);
    used.add(normalized);
    chosen.push(url);
  };

  for (const [pattern] of PRIORITY) {
    if (chosen.length >= MAX_PAGES) break;
    const match = candidates.find((url) => {
      if (SKIP.test(url)) return false;
      try {
        const parsed = new URL(url);
        return parsed.origin === home.origin && pattern.test(parsed.pathname);
      } catch {
        return false;
      }
    });
    if (match) take(match);
  }

  // Si el sitio no usa esas palabras, se completan con las primeras páginas
  // internas que sí parezcan contenido.
  for (const url of candidates) {
    if (chosen.length >= MAX_PAGES) break;
    if (SKIP.test(url)) continue;
    try {
      if (new URL(url).origin !== home.origin) continue;
    } catch {
      continue;
    }
    take(url);
  }

  return chosen.slice(0, MAX_PAGES);
}

async function readPage(url: string): Promise<CrawledPage | null> {
  try {
    const res = await safeFetch(url, { timeoutMs: TIMEOUT_MS, maxBytes: 1024 * 1024 });
    if (res.status >= 400) return null;
    if (!/html/i.test(String(res.headers["content-type"] ?? ""))) return null;

    const $ = cheerio.load(decodeHtml(res));
    const root = $("main").first().length ? $("main").first() : $("body");
    const text = extractText($, root as never);
    if (!text) return null;

    return {
      url: res.finalUrl,
      title: $("title").first().text().replace(/\s+/g, " ").trim() || null,
      h1: $("h1")
        .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
        .get()
        .filter(Boolean),
      text: text.slice(0, MAX_TEXT),
      wordCount: text.split(" ").length,
    };
  } catch (err) {
    // Una página que no carga no invalida el resto del análisis.
    if (err instanceof SafeFetchError) return null;
    return null;
  }
}

export async function crawlPages(
  homeUrl: string,
  links: LinkInfo[],
  sitemapUrls: string[]
): Promise<Measured<CrawledPage[]>> {
  const urls = pickPages(homeUrl, links, sitemapUrls);
  if (urls.length === 0) {
    return { status: "unavailable", reason: "El sitio no tiene otras páginas enlazadas que se puedan leer." };
  }

  const pages = (await Promise.all(urls.map(readPage))).filter((p): p is CrawledPage => p !== null);
  if (pages.length === 0) {
    return { status: "unavailable", reason: "No se pudo leer ninguna de las otras páginas del sitio." };
  }
  return { status: "ok", value: pages };
}

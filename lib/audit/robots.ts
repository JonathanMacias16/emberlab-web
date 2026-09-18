import { safeFetch, SafeFetchError } from "./safeFetch";
import type { Measured, RobotsInfo, SitemapInfo } from "./types";

/**
 * Lee robots.txt como lo hace Google: si hay un grupo específico para
 * Googlebot manda ese; si no, el de `*`.
 */
export function parseRobots(text: string): RobotsInfo {
  const groups: Array<{ agents: string[]; rules: Array<{ allow: boolean; path: string }> }> = [];
  const sitemaps: string[] = [];
  let current: (typeof groups)[number] | null = null;
  let inRules = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim().toLowerCase();
    const value = line.slice(sep + 1).trim();

    if (key === "sitemap") {
      if (value) sitemaps.push(value);
    } else if (key === "user-agent") {
      // Varios user-agent seguidos comparten grupo; uno después de reglas abre otro.
      if (!current || inRules) {
        current = { agents: [], rules: [] };
        groups.push(current);
        inRules = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && current) {
      inRules = true;
      // `Disallow:` vacío significa "no bloquees nada", no se registra.
      if (value) current.rules.push({ allow: key === "allow", path: value });
    }
  }

  const group =
    groups.find((g) => g.agents.includes("googlebot")) ?? groups.find((g) => g.agents.includes("*"));
  const rules = group?.rules ?? [];
  const blocksAll =
    rules.some((r) => !r.allow && r.path === "/") && !rules.some((r) => r.allow && r.path === "/");

  return { found: true, blocksAll, sitemaps };
}

function isHtml(contentType: string | string[] | undefined): boolean {
  return /html/i.test(String(contentType ?? ""));
}

export async function fetchRobots(origin: string): Promise<Measured<RobotsInfo>> {
  try {
    const res = await safeFetch(`${origin}/robots.txt`, {
      timeoutMs: 5_000,
      maxBytes: 256 * 1024,
      accept: "text/plain,*/*;q=0.5",
    });
    // Muchos sitios devuelven su página 404 (o la home, en SPAs) con código 200.
    // Eso no es un robots.txt.
    if (res.status === 404 || res.status === 410 || (res.status === 200 && isHtml(res.headers["content-type"]))) {
      return { status: "ok", value: { found: false, blocksAll: false, sitemaps: [] } };
    }
    if (res.status !== 200) {
      return { status: "unavailable", reason: `robots.txt respondió con código ${res.status}.` };
    }
    return { status: "ok", value: parseRobots(res.body.toString("utf-8")) };
  } catch (err) {
    const reason = err instanceof SafeFetchError ? err.message : "No se pudo leer robots.txt.";
    return { status: "unavailable", reason };
  }
}

export async function findSitemap(origin: string, declared: string[]): Promise<Measured<SitemapInfo>> {
  const candidates = [...declared.slice(0, 2), `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  let anyReached = false;

  for (const candidate of [...new Set(candidates)]) {
    try {
      // Solo hace falta la etiqueta de apertura; no descargamos sitemaps enormes.
      const res = await safeFetch(candidate, {
        timeoutMs: 5_000,
        maxBytes: 64 * 1024,
        accept: "application/xml,text/xml,*/*;q=0.5",
      });
      anyReached = true;
      if (res.status !== 200) continue;
      const head = res.body.toString("utf-8");
      // Igual que con robots: un 200 con HTML es la página de error disfrazada.
      if (/<urlset|<sitemapindex/i.test(head) || /\.xml\.gz$/i.test(candidate)) {
        return { status: "ok", value: { found: true, url: res.finalUrl } };
      }
    } catch {
      // probar el siguiente candidato
    }
  }

  if (!anyReached) return { status: "unavailable", reason: "No se pudo consultar el sitemap." };
  return { status: "ok", value: { found: false, url: null } };
}

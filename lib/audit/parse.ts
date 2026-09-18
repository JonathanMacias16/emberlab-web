import * as cheerio from "cheerio";
import type { SafeResponse } from "./safeFetch";
import type { FormInfo, LinkInfo, PageSignals } from "./types";

/** Minúsculas y sin acentos, para comparar texto en español sin sorpresas. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function clean(text: string | undefined | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function nonEmpty(text: string | undefined | null): string | null {
  const value = clean(text);
  return value ? value : null;
}

/**
 * Decodifica el HTML respetando su charset. Muchos sitios viejos en español
 * siguen en ISO-8859-1; leerlos como UTF-8 rompe acentos y eñes en el reporte.
 */
export function decodeHtml(res: SafeResponse): string {
  const fromHeader = /charset=["']?([\w-]+)/i.exec(String(res.headers["content-type"] ?? ""))?.[1];
  const head = res.body.subarray(0, 4096).toString("latin1");
  const fromMeta =
    /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1];
  const label = fromHeader ?? fromMeta ?? "utf-8";
  try {
    return new TextDecoder(label).decode(res.body);
  } catch {
    return new TextDecoder("utf-8").decode(res.body);
  }
}

// Texto de botones/enlaces que pide una acción. Formas concretas en vez de
// raíces sueltas para no contar "sin compromiso" como "comprar" o "derechos
// reservados" como "reservar".
const CTA_PATTERN = new RegExp(
  "\\b(" +
    [
      "contacta\\w*", "contacto", "cotiza\\w*", "cotizacion", "agenda\\w*", "reserva", "reservar",
      "reservacion", "llama", "llamar", "llamanos", "escribenos", "hablemos", "habla con",
      "solicita\\w*", "compra", "comprar", "compralo", "carrito", "suscribete", "registrate",
      "empieza", "comienza", "prueba gratis", "pide", "pedir", "ordena", "ordenar", "obten",
      "descarga\\w*", "inscribete", "cita", "citas", "whatsapp", "completa\\w*", "llena",
      "llenar", "formulario", "analiza\\w*", "diagnostico", "envia\\w*", "enviar", "quiero", "unete",
      "contact\\w*", "get a quote", "quote", "book", "booking", "schedule", "call", "buy", "shop",
      "add to cart", "sign up", "subscribe", "get started", "request", "order", "download",
    ].join("|") +
    ")\\b"
);

const EMBEDDED_FORM_PROVIDERS: Array<[RegExp, string]> = [
  [/hsforms\.(net|com)|hubspot\.com\/.*form|share\.hsforms/, "HubSpot"],
  [/typeform\.com/, "Typeform"],
  [/docs\.google\.com\/forms|forms\.gle/, "Google Forms"],
  [/jotform\.com/, "Jotform"],
  [/calendly\.com/, "Calendly"],
  [/tally\.so/, "Tally"],
  [/forms\.office\.com/, "Microsoft Forms"],
  [/wufoo\.com/, "Wufoo"],
  [/formstack\.com/, "Formstack"],
  [/cognitoforms\.com/, "Cognito Forms"],
];

const WHATSAPP_HOSTS = new Set(["wa.me", "api.whatsapp.com", "web.whatsapp.com", "chat.whatsapp.com"]);

function resolveHref(href: string, base: string): URL | null {
  try {
    return new URL(href, base);
  } catch {
    return null;
  }
}

function collectSchemaTypes(node: unknown, out: Set<string>, depth = 0): void {
  if (depth > 6 || node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectSchemaTypes(item, out, depth + 1);
    return;
  }
  const record = node as Record<string, unknown>;
  const type = record["@type"];
  if (typeof type === "string") out.add(type);
  if (Array.isArray(type)) for (const t of type) if (typeof t === "string") out.add(t);
  for (const value of Object.values(record)) collectSchemaTypes(value, out, depth + 1);
}

export function parsePage(res: SafeResponse): PageSignals {
  const html = decodeHtml(res);
  const $ = cheerio.load(html);
  const base = res.finalUrl;

  const meta = (selector: string) => nonEmpty($(selector).first().attr("content"));

  // --- Indexación y SEO on-page ---
  const robotsMeta = normalize(
    [$('meta[name="robots"]').attr("content"), $('meta[name="googlebot"]').attr("content")]
      .filter(Boolean)
      .join(",")
  );
  const robotsHeader = normalize(String(res.headers["x-robots-tag"] ?? ""));

  const structuredDataTypes = new Set<string>();
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      collectSchemaTypes(JSON.parse($(el).text()), structuredDataTypes);
    } catch {
      // JSON-LD mal formado: para Google tampoco cuenta
    }
  });

  // --- Enlaces de contacto y CTAs (antes de limpiar el DOM) ---
  const phoneLinks: LinkInfo[] = [];
  const emailLinks: LinkInfo[] = [];
  const whatsappLinks: LinkInfo[] = [];
  $("a[href]").each((_, el) => {
    const href = clean($(el).attr("href"));
    const text = clean($(el).text()) || clean($(el).attr("aria-label"));
    const lower = href.toLowerCase();
    if (lower.startsWith("tel:")) return void phoneLinks.push({ href, text });
    if (lower.startsWith("mailto:")) return void emailLinks.push({ href, text });
    if (lower.startsWith("whatsapp:")) return void whatsappLinks.push({ href, text });
    const url = resolveHref(href, base);
    if (url && WHATSAPP_HOSTS.has(url.hostname.toLowerCase())) whatsappLinks.push({ href: url.href, text });
  });

  const ctas: LinkInfo[] = [];
  const seenCta = new Set<string>();
  $('a[href], button, input[type="submit"], input[type="button"]').each((_, el) => {
    const node = $(el);
    const text = clean(node.is("input") ? node.attr("value") : node.text()) || clean(node.attr("aria-label"));
    // Textos largos son párrafos envueltos en un enlace, no llamadas a la acción.
    if (!text || text.length > 60 || !CTA_PATTERN.test(normalize(text))) return;
    const key = normalize(text);
    if (seenCta.has(key)) return;
    seenCta.add(key);
    ctas.push({ href: clean(node.attr("href")), text });
  });

  // --- Formularios ---
  const forms: FormInfo[] = [];
  $("form").each((_, el) => {
    const fields = $(el).find(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), textarea, select'
    );
    let asksEmail = false;
    let asksPhone = false;
    fields.each((__, field) => {
      const f = $(field);
      const type = normalize(f.attr("type") ?? "");
      const hints = normalize(
        [f.attr("name"), f.attr("id"), f.attr("placeholder"), f.attr("autocomplete"), f.attr("aria-label")]
          .filter(Boolean)
          .join(" ")
      );
      if (type === "email" || /e-?mail|correo/.test(hints)) asksEmail = true;
      if (type === "tel" || /tel|phone|telefono|celular|movil|whatsapp/.test(hints)) asksPhone = true;
    });
    const form = $(el);
    const action = normalize(form.attr("action") ?? "");
    const onlyField = fields.length === 1 ? normalize(fields.first().attr("name") ?? "") : "";
    const isSearch =
      normalize(form.attr("role") ?? "") === "search" ||
      /search|buscar|busqueda|[?&]s=/.test(action) ||
      form.find('input[type="search"]').length > 0 ||
      ["q", "s", "query", "search", "buscar"].includes(onlyField);
    forms.push({ fieldCount: fields.length, asksEmail, asksPhone, isSearch });
  });

  const embedded = new Set<string>();
  $("iframe[src], script[src]").each((_, el) => {
    const src = normalize($(el).attr("src") ?? "");
    for (const [pattern, name] of EMBEDDED_FORM_PROVIDERS) if (pattern.test(src)) embedded.add(name);
  });

  // --- Contenido ---
  const images = $("img");
  const scriptCount = $("script[src], script:not([type])").length;
  const h1 = $("h1").map((_, el) => clean($(el).text())).get().filter(Boolean);
  const h2 = $("h2").map((_, el) => clean($(el).text())).get().filter(Boolean);

  // Para contar palabras y sacar el copy se quita lo que no es texto visible y
  // el ruido de navegación/pie, que se repite en todos los sitios.
  const root = ($("main").first().length ? $("main").first() : $("body")).clone();
  root.find("script, style, noscript, template, svg, nav, footer, iframe").remove();
  const bodyText = clean(root.text());
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  return {
    finalUrl: res.finalUrl,
    httpStatus: res.status,
    https: res.finalUrl.startsWith("https://"),
    redirects: res.redirects,
    truncated: res.truncated,

    lang: nonEmpty($("html").attr("lang")),
    title: nonEmpty($("title").first().text()),
    metaDescription: meta('meta[name="description"]'),
    canonical: nonEmpty($('link[rel="canonical"]').attr("href")),
    hasViewport: $('meta[name="viewport"]').length > 0,
    noindex: robotsMeta.includes("noindex") || robotsHeader.includes("noindex"),
    openGraph: {
      title: meta('meta[property="og:title"]'),
      description: meta('meta[property="og:description"]'),
      image: meta('meta[property="og:image"]'),
    },
    structuredDataTypes: [...structuredDataTypes],

    h1,
    h2: h2.slice(0, 15),
    wordCount,
    images: { total: images.length, missingAlt: $("img:not([alt])").length },

    likelyClientRendered: wordCount < 40 && scriptCount > 0,

    forms,
    embeddedForms: [...embedded],
    phoneLinks: phoneLinks.slice(0, 10),
    emailLinks: emailLinks.slice(0, 10),
    whatsappLinks: whatsappLinks.slice(0, 10),
    ctas: ctas.slice(0, 15),

    content: { excerpt: bodyText.slice(0, 2000) },
  };
}

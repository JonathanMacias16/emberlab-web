import type { Check, Measured, Score, SiteAudit } from "./types";

/**
 * Traduce un `SiteAudit` a los hechos que se le pasan al modelo que redacta el
 * reporte.
 *
 * Existe para poner una frontera: el modelo solo ve esto. No recibe el audit
 * crudo (con base64 de las capturas, que costaría una fortuna en tokens) ni
 * calcula nada por su cuenta. Los números del PDF salen de `score.ts`; el
 * modelo pone las palabras alrededor.
 */

export function formatMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`;
}

/** `85/100` o la razón por la que no hay número. */
export function describeScore(score: Score): string {
  return score.status === "ok" ? `${score.value}/100` : `no medido — ${score.reason}`;
}

function checkLines(score: Score, passed: boolean): string[] {
  return (score.checks ?? [])
    .filter((c: Check) => c.passed === passed)
    .map((c) => `${c.label}: ${c.detail}`);
}

/** Lo que salió bien y lo que no, en texto plano, listo para el prompt. */
export interface AuditFacts {
  url: string;
  medidoEl: string;
  /** `null` cuando el sitio no se pudo leer. */
  noSePudoMedir: string | null;
  scores: Record<string, string>;
  loQueCumple: string[];
  loQueFalla: string[];
  contenido: Record<string, string>;
  velocidad: Record<string, string>;
  usuariosReales: string;
  oportunidadesTecnicas: string[];
  /** Diseño y accesibilidad medidos, no opinados. */
  disenoMedido: string[];
  /** El copy de las otras páginas del sitio, para entender la oferta completa. */
  otrasPaginas: Array<{ url: string; titulo: string; texto: string }>;
}

/** Cuánto copy de cada página secundaria se manda al modelo. */
const TEXTO_POR_PAGINA = 4_000;

export function auditFacts(audit: SiteAudit): AuditFacts {
  const { page, pagespeed, scores } = audit;

  const facts: AuditFacts = {
    url: page.status === "ok" ? page.value.finalUrl : audit.requestedUrl,
    medidoEl: new Date(audit.analyzedAt).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" }),
    noSePudoMedir: page.status === "unavailable" ? page.reason : null,
    scores: {
      "SEO básico": describeScore(scores.seoBasico),
      "Conversión": describeScore(scores.conversion),
      "Experiencia de usuario": describeScore(scores.experienciaUsuario),
    },
    loQueCumple: [],
    loQueFalla: [],
    contenido: {},
    velocidad: {},
    usuariosReales: "no medido",
    oportunidadesTecnicas: [],
    disenoMedido: [],
    otrasPaginas: [],
  };

  for (const score of [scores.seoBasico, scores.conversion, scores.experienciaUsuario]) {
    facts.loQueCumple.push(...checkLines(score, true));
    facts.loQueFalla.push(...checkLines(score, false));
  }

  if (page.status === "ok") {
    const p = page.value;
    const canales = [
      p.forms.some((f) => f.fieldCount > 0 && !f.isSearch) && "formulario",
      p.whatsappLinks.length > 0 && "WhatsApp",
      p.phoneLinks.length > 0 && "teléfono",
      p.emailLinks.length > 0 && "correo",
    ].filter(Boolean);

    facts.contenido = {
      "Título de la página": p.title ?? "no tiene",
      "Meta descripción": p.metaDescription ?? "no tiene",
      "Encabezado principal (h1)": p.h1.length ? p.h1.join(" / ") : "no tiene",
      "Subtítulos (h2)": p.h2.length ? p.h2.slice(0, 5).join(" / ") : "ninguno",
      "Palabras de texto": String(p.wordCount),
      "Imágenes sin texto alternativo": `${p.images.missingAlt} de ${p.images.total}`,
      "Llamadas a la acción encontradas": p.ctas.length
        ? p.ctas.slice(0, 6).map((c) => `"${c.text}"`).join(", ")
        : "ninguna",
      "Formas de contacto": canales.length ? canales.join(", ") : "ninguna",
      "Texto real de la página": p.content.text + (p.content.truncated ? " […]" : ""),
      "Se arma con JavaScript en el navegador": p.likelyClientRendered ? "sí" : "no",
    };
  }

  if (pagespeed.status === "ok") {
    const { lab, field, opportunities } = pagespeed.value;
    facts.velocidad = {
      "Contenido principal visible (LCP)": lab.lcpMs === null ? "no medido" : formatMs(lab.lcpMs),
      "Primer contenido visible (FCP)": lab.fcpMs === null ? "no medido" : formatMs(lab.fcpMs),
      "Pantalla llena de contenido (Speed Index)":
        lab.speedIndexMs === null ? "no medido" : formatMs(lab.speedIndexMs),
      "Movimiento del contenido (CLS)": lab.cls === null ? "no medido" : lab.cls.toFixed(3),
      "Tiempo bloqueada (TBT)": lab.tbtMs === null ? "no medido" : formatMs(lab.tbtMs),
      "Velocidad (Lighthouse)": lab.performance === null ? "no medido" : `${lab.performance}/100`,
      "Accesibilidad (Lighthouse)": lab.accessibility === null ? "no medido" : `${lab.accessibility}/100`,
      "Buenas prácticas (Lighthouse)": lab.bestPractices === null ? "no medido" : `${lab.bestPractices}/100`,
    };

    facts.usuariosReales =
      field.status === "ok"
        ? [
            `alcance: ${field.value.scope === "url" ? "esta página" : "el dominio completo"}`,
            field.value.lcp && `LCP ${formatMs(field.value.lcp.p75)} (${field.value.lcp.rating})`,
            field.value.cls && `CLS ${field.value.cls.p75.toFixed(3)} (${field.value.cls.rating})`,
            field.value.inp && `INP ${formatMs(field.value.inp.p75)} (${field.value.inp.rating})`,
          ]
            .filter(Boolean)
            .join("; ")
        : `no medido — ${field.reason}`;

    facts.oportunidadesTecnicas = opportunities.map((o) => `${o.title} (ahorro estimado ${formatMs(o.savingsMs)})`);

    facts.disenoMedido = pagespeed.value.design.map((finding) => {
      const estado = finding.passed ? "CUMPLE" : "NO CUMPLE";
      const donde = finding.items
        .map((item) => (item.label ? `"${item.label}"` : item.snippet))
        .filter(Boolean)
        .join("; ");
      return `${estado} — ${finding.title}${donde ? ` → en: ${donde}` : ""}`;
    });
  } else {
    facts.velocidad = { "No se pudo medir": pagespeed.reason };
  }

  if (audit.otherPages.status === "ok") {
    facts.otrasPaginas = audit.otherPages.value.map((pagina) => ({
      url: pagina.url,
      titulo: pagina.title ?? "(sin título)",
      texto: pagina.text.slice(0, TEXTO_POR_PAGINA),
    }));
  }

  return facts;
}

/** Lo mismo, como texto para meter en el prompt. */
export function factsToPrompt(facts: AuditFacts): string {
  const block = (title: string, body: string) => `## ${title}\n${body || "—"}`;
  const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
  const pairs = (obj: Record<string, string>) =>
    Object.entries(obj)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

  return [
    `# Medición real de ${facts.url}`,
    `Medido el ${facts.medidoEl}.`,
    facts.noSePudoMedir ? `ATENCIÓN: el sitio no se pudo leer. ${facts.noSePudoMedir}` : "",
    block("Calificaciones (calculadas, no las cambies)", pairs(facts.scores)),
    block("Lo que el sitio SÍ cumple", list(facts.loQueCumple)),
    block("Lo que el sitio NO cumple", list(facts.loQueFalla)),
    block("Contenido y contacto encontrados en la página", pairs(facts.contenido)),
    block("Velocidad medida en laboratorio", pairs(facts.velocidad)),
    block("Usuarios reales (CrUX)", facts.usuariosReales),
    block("Mejoras técnicas que Google detectó", list(facts.oportunidadesTecnicas)),
    block("Diseño y accesibilidad medidos por Lighthouse", list(facts.disenoMedido)),
    block(
      "Otras páginas del sitio (texto real)",
      facts.otrasPaginas.length
        ? facts.otrasPaginas
            .map((pagina) => `### ${pagina.titulo}\n${pagina.url}\n${pagina.texto}`)
            .join("\n\n")
        : "No se leyeron otras páginas."
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Para saber si vale la pena armar la sección de evidencia del PDF. */
export function hasMeasurements(audit: SiteAudit | null): audit is SiteAudit {
  if (!audit) return false;
  const measured = (m: Measured<unknown>) => m.status === "ok";
  return measured(audit.page) || measured(audit.pagespeed);
}

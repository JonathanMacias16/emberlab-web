/* eslint-disable jsx-a11y/alt-text --
   `Image` aquí es el de @react-pdf/renderer, que pinta dentro de un PDF y no
   acepta `alt`. La regla lo confunde con el <img> del DOM. */
import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  renderToBuffer,
  Svg,
  Path,
  Rect,
} from "@react-pdf/renderer";
import React from "react";

import { analyzeSite, normalizeInputUrl } from "@/lib/audit/analyzeSite";
import { auditFacts, factsToPrompt, formatMs } from "@/lib/audit/findings";
import type { Check, DesignFinding, Score, SiteAudit } from "@/lib/audit/types";
import type { Message } from "@/components/chat/types";

// El audit usa módulos de Node (dns, http, zlib) para el fetch seguro.
export const runtime = "nodejs";
// Analizar el sitio (PageSpeed puede tomarse 75 s) y después redactar el
// reporte con el modelo. Si esto se queda corto, el prospecto recibe el PDF sin
// la evidencia visual.
export const maxDuration = 150;

type Opportunity = {
  title: string;
  description: string;
  /** El dato medido en el que se apoya. Obliga al modelo a no inventar. */
  evidence: string;
  impact: string;
  priority: "Alta" | "Media" | "Baja";
};

type ActionPhase = {
  label: string;
  description: string;
  actions: string[];
};

/**
 * Lo que redacta el modelo. Deliberadamente NO trae calificaciones: esas salen
 * de `score.ts` a partir de lo medido. El modelo interpreta, no puntúa.
 */
/** Lo que el sitio comunica, leído de su copy real. */
type Communication = {
  queOfrece: string;
  paraQuien: string;
  propuestaDeValor: string;
  /** Diferencia entre lo que el prospecto dijo querer comunicar y lo que el sitio comunica. */
  brechaConObjetivo: string;
};

/** Una falta de ortografía o redacción, citada textual para que se verifique. */
type WritingIssue = {
  quote: string;
  issue: string;
  suggestion: string;
};

type Narrative = {
  clientName: string;
  company: string;
  website: string;
  email: string;
  objective: string;
  targetAudience: string;
  mainChallenge: string;
  executiveSummary: string;
  /** Lo que se ve en la captura del sitio. Vacío si no hubo captura. */
  visualObservations: string[];
  communication: Communication;
  /** Faltas encontradas en el texto real del sitio. */
  writing: WritingIssue[];
  /** Observaciones de diseño sobre la captura: jerarquía, aire, consistencia. */
  designNotes: string[];
  /** Solo se usa cuando no hubo medición; si la hay, mandan los checks. */
  workingWell: string[];
  opportunities: Opportunity[];
  actionPlan: { phase1: ActionPhase; phase2: ActionPhase; phase3: ActionPhase };
  emberLabHelp: string;
};

// ── Design tokens ──────────────────────────────────────────────────────────────
const RED = "#E73F40";
const PURPLE = "#301f4b";
const PURPLE_MID = "#4a3570";
const PURPLE_L = "#6d59a1";
const CREAM = "#faf8f5";
const CREAM_D = "#e8e3dc";
const WHITE = "#ffffff";
const T_MID = "#5a4d7a";
const T_LIGHT = "#9080b0";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";
const PHASE_COLORS = [PURPLE_MID, PURPLE_L, RED];

const pColor = (p: string) => (p === "Alta" ? RED : p === "Media" ? AMBER : GREEN);
const sColor = (s: number) => (s >= 70 ? GREEN : s >= 45 ? AMBER : RED);

// ── Shared components ──────────────────────────────────────────────────────────

function EmberLogo({ size = 28, fill = WHITE }: { size?: number; fill?: string }) {
  return (
    <Svg viewBox="0 0 118 118" width={size} height={size}>
      <Path fill={fill} d="M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z" />
      <Path fill={fill} d="M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z" />
      <Path fill={fill} d="M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z" />
      <Path fill={fill} d="M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z" />
      <Path fill={fill} d="M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z" />
      <Path fill={fill} d="M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z" />
    </Svg>
  );
}

/** Barra de calificación. `null` = no se midió, y se dice por qué. */
function ScoreBar({ label, score, barW = 215 }: { label: string; score: Score; barW?: number }) {
  if (score.status === "unavailable") {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 8, color: T_MID, marginBottom: 4, fontFamily: "Helvetica" }}>{label}</Text>
        <View style={{ backgroundColor: CREAM_D, borderRadius: 3, padding: "4px 7px" }}>
          <Text style={{ fontSize: 6.5, color: T_MID, lineHeight: 1.4, fontFamily: "Helvetica-Oblique" }}>
            No medido · {score.reason}
          </Text>
        </View>
      </View>
    );
  }
  const n = Math.min(Math.max(Math.round(score.value), 0), 100);
  const fw = Math.max(Math.round((n / 100) * barW), 8);
  const color = sColor(n);
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontSize: 8, color: T_MID, fontFamily: "Helvetica" }}>{label}</Text>
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color }}>{n}/100</Text>
      </View>
      <Svg width={barW} height={7}>
        <Rect x={0} y={0} width={barW} height={7} rx={3} fill={CREAM_D} />
        <Rect x={0} y={0} width={fw} height={7} rx={3} fill={color} />
      </Svg>
    </View>
  );
}

function SecLabel({ text, mt = 16 }: { text: string; mt?: number }) {
  return (
    <View style={{ marginTop: mt, marginBottom: 10, paddingBottom: 5, borderBottom: `1px solid ${RED}` }}>
      <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: RED, letterSpacing: 2 }}>{text}</Text>
    </View>
  );
}

function PageStrip({ name }: { name: string }) {
  return (
    <View
      style={{ backgroundColor: PURPLE, padding: "12px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      fixed
    >
      <Text style={{ fontSize: 8, color: "rgba(237,234,231,0.45)", fontFamily: "Helvetica" }}>Diagnóstico · {name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <EmberLogo size={13} />
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: RED, marginLeft: 6 }}>Ember Lab</Text>
        <Text
          style={{ fontSize: 8, color: "rgba(237,234,231,0.25)", marginLeft: 10, fontFamily: "Helvetica" }}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </View>
    </View>
  );
}

function FooterStrip() {
  return (
    <View
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: PURPLE, padding: "10px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      fixed
    >
      <Text style={{ fontSize: 7, color: "rgba(237,234,231,0.35)", fontFamily: "Helvetica" }}>Reporte confidencial · Ember Lab</Text>
      <Text style={{ fontSize: 7, color: RED, fontFamily: "Helvetica-Bold" }}>hola@emberlab.mx</Text>
    </View>
  );
}

/** Dato medido con su valor y su veredicto. */
function MetricChip({ label, value, rating }: { label: string; value: string; rating: "bueno" | "mejorable" | "malo" | "neutro" }) {
  const color = rating === "bueno" ? GREEN : rating === "mejorable" ? AMBER : rating === "malo" ? RED : T_LIGHT;
  return (
    <View style={{ flex: 1, backgroundColor: WHITE, borderRadius: 5, padding: "7px 9px", marginRight: 6, borderTop: `2px solid ${color}` }}>
      <Text style={{ fontSize: 6, color: T_LIGHT, marginBottom: 3, fontFamily: "Helvetica" }}>{label}</Text>
      <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color }}>{value}</Text>
    </View>
  );
}

function CheckRow({ check }: { check: Check }) {
  const ok = check.passed === true;
  const color = check.passed === null ? T_LIGHT : ok ? GREEN : RED;
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 5 }} wrap={false}>
      <View style={{ width: 11, height: 11, backgroundColor: color, borderRadius: 2.5, alignItems: "center", justifyContent: "center", marginRight: 7, flexShrink: 0, marginTop: 1 }}>
        <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: WHITE }}>
          {check.passed === null ? "?" : ok ? "✓" : "✕"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 8, color: PURPLE, lineHeight: 1.35, fontFamily: "Helvetica" }}>{check.label}</Text>
        <Text style={{ fontSize: 7, color: T_LIGHT, lineHeight: 1.35, fontFamily: "Helvetica" }}>{check.detail}</Text>
      </View>
    </View>
  );
}

// ── Evidencia medida ───────────────────────────────────────────────────────────

function ratingFor(value: number | null, good: number, poor: number): "bueno" | "mejorable" | "malo" | "neutro" {
  if (value === null) return "neutro";
  return value <= good ? "bueno" : value <= poor ? "mejorable" : "malo";
}

function EvidencePage({ audit, name }: { audit: SiteAudit; name: string }) {
  const psi = audit.pagespeed.status === "ok" ? audit.pagespeed.value : null;
  const lab = psi?.lab ?? null;
  const shot = psi?.screenshots.final ?? null;

  // Seis cuadros repartidos parejo a lo largo de la carga; ocho no caben
  // legibles, y tomar "uno de cada N" desperdiciaría espacio cuando N no divide.
  const frames = psi?.screenshots.filmstrip ?? [];
  const strip =
    frames.length <= 6
      ? frames
      : Array.from({ length: 6 }, (_, i) => frames[Math.round((i * (frames.length - 1)) / 5)]);

  const checkCount = [
    ...(audit.scores.seoBasico.checks ?? []),
    ...(audit.scores.conversion.checks ?? []),
    ...(audit.scores.experienciaUsuario.checks ?? []),
  ].length;

  return (
    <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 46 }}>
      <PageStrip name={name} />
      <View style={{ padding: "20px 40px 0 40px" }}>
        <SecLabel text="LO QUE MEDIMOS EN TU SITIO" mt={0} />

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          {/* Captura real del sitio */}
          <View style={{ width: 132, marginRight: 16 }}>
            {shot ? (
              <>
                <Image src={shot} style={{ width: 132, height: 263, borderRadius: 4, border: `1px solid ${CREAM_D}`, objectFit: "cover" }} />
                <Text style={{ fontSize: 6, color: T_LIGHT, marginTop: 4, lineHeight: 1.35, fontFamily: "Helvetica" }}>
                  Tu sitio como lo ve Google en un celular.
                </Text>
              </>
            ) : (
              <View style={{ width: 132, height: 263, borderRadius: 4, backgroundColor: CREAM_D, alignItems: "center", justifyContent: "center", padding: 12 }}>
                <Text style={{ fontSize: 7, color: T_MID, textAlign: "center", lineHeight: 1.4, fontFamily: "Helvetica-Oblique" }}>
                  No se pudo obtener una captura del sitio.
                </Text>
              </View>
            )}
          </View>

          {/* Calificaciones reales */}
          <View style={{ flex: 1 }}>
            <ScoreBar label="SEO básico (qué tan lista está para Google)" score={audit.scores.seoBasico} barW={215} />
            <ScoreBar label="Conversión (qué tan fácil es contactarte)" score={audit.scores.conversion} barW={215} />
            <ScoreBar label="Experiencia de usuario (velocidad y accesibilidad)" score={audit.scores.experienciaUsuario} barW={215} />
            <Text style={{ fontSize: 6.5, color: T_LIGHT, marginTop: 2, lineHeight: 1.4, fontFamily: "Helvetica" }}>
              Calculado sobre {checkCount} verificaciones hechas a tu sitio el{" "}
              {new Date(audit.analyzedAt).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}.
              Lo que no se pudo medir aparece marcado como tal, no se rellena.
            </Text>
          </View>
        </View>

        {/* Velocidad */}
        {lab && (
          <>
            <SecLabel text="VELOCIDAD MEDIDA" />
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <MetricChip
                label="CONTENIDO PRINCIPAL"
                value={lab.lcpMs === null ? "—" : formatMs(lab.lcpMs)}
                rating={ratingFor(lab.lcpMs, 2500, 4000)}
              />
              <MetricChip
                label="PRIMER CONTENIDO"
                value={lab.fcpMs === null ? "—" : formatMs(lab.fcpMs)}
                rating={ratingFor(lab.fcpMs, 1800, 3000)}
              />
              <MetricChip
                label="MOVIMIENTO"
                value={lab.cls === null ? "—" : lab.cls.toFixed(2)}
                rating={ratingFor(lab.cls, 0.1, 0.25)}
              />
              <MetricChip
                label="ACCESIBILIDAD"
                value={lab.accessibility === null ? "—" : `${lab.accessibility}`}
                rating={lab.accessibility === null ? "neutro" : lab.accessibility >= 90 ? "bueno" : lab.accessibility >= 50 ? "mejorable" : "malo"}
              />
            </View>
          </>
        )}

        {/* Filmstrip */}
        {strip.length > 0 && (
          <>
            <SecLabel text={`CÓMO SE VE MIENTRAS CARGA · PRIMEROS ${(Math.max(...strip.map((f) => f.timingMs)) / 1000).toFixed(1)} S`} />
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {strip.map((frame, i) => (
                <View key={i} style={{ flex: 1, marginRight: i === strip.length - 1 ? 0 : 5 }}>
                  <Image src={frame.data} style={{ width: "100%", height: 150, borderRadius: 3, border: `1px solid ${CREAM_D}`, objectFit: "cover" }} />
                  <Text style={{ fontSize: 6, color: T_LIGHT, marginTop: 3, textAlign: "center", fontFamily: "Helvetica" }}>
                    {(frame.timingMs / 1000).toFixed(1)} s
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 6.5, color: T_LIGHT, lineHeight: 1.4, marginBottom: 2, fontFamily: "Helvetica" }}>
              Cada cuadro es un instante de la carga en un celular con red lenta. Esto cubre los primeros segundos: si el
              contenido principal tarda más que eso, el número de arriba lo dice.
            </Text>
          </>
        )}

      </View>
      <FooterStrip />
    </Page>
  );
}

/** Píldora de cumple / no cumple para los hallazgos medidos de diseño. */
function DesignPill({ finding }: { finding: DesignFinding }) {
  const color = finding.passed ? GREEN : RED;
  return (
    <View
      style={{ backgroundColor: WHITE, borderRadius: 5, padding: "7px 9px", marginBottom: 6, borderLeft: `3px solid ${color}` }}
      wrap={false}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color, marginRight: 6, flexShrink: 0 }}>
          {finding.passed ? "CUMPLE" : "NO CUMPLE"}
        </Text>
        <Text style={{ fontSize: 8, color: PURPLE, lineHeight: 1.4, flex: 1, fontFamily: "Helvetica" }}>
          {finding.title}
        </Text>
      </View>
      {!finding.passed && finding.items.length > 0 && (
        <Text style={{ fontSize: 6.5, color: T_LIGHT, lineHeight: 1.4, marginTop: 3, fontFamily: "Helvetica" }}>
          En: {finding.items.map((i) => (i.label ? `"${i.label}"` : i.snippet)).filter(Boolean).join(" · ")}
        </Text>
      )}
    </View>
  );
}

/** Bloque de texto con su encabezado, para las secciones de comunicación. */
function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={{ marginBottom: 10 }} wrap={false}>
      <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: T_LIGHT, letterSpacing: 1, marginBottom: 3 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 9, color: PURPLE, lineHeight: 1.6, fontFamily: "Helvetica" }}>{value}</Text>
    </View>
  );
}

/**
 * Qué comunica el sitio, qué tan bien escrito está y cómo se ve.
 *
 * Es la página que separa este reporte de un informe de métricas: mezcla lo
 * medido (contraste, encabezados, áreas táctiles) con lo leído (el copy real de
 * varias páginas) y lo juzgado (la captura). Cada cosa va etiquetada por lo que
 * es, para que el cliente sepa qué puede discutir y qué no.
 */
function CommunicationPage({
  data,
  audit,
  name,
}: {
  data: Narrative;
  audit: SiteAudit;
  name: string;
}) {
  const comm = data.communication;
  const writing = data.writing ?? [];
  const design = audit.pagespeed.status === "ok" ? audit.pagespeed.value.design : [];
  const pagesRead = audit.otherPages.status === "ok" ? audit.otherPages.value : [];
  const words =
    (audit.page.status === "ok" ? audit.page.value.wordCount : 0) +
    pagesRead.reduce((sum, p) => sum + p.wordCount, 0);

  return (
    <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 46 }}>
      <PageStrip name={name} />
      <View style={{ padding: "20px 40px 0 40px" }}>
        <SecLabel text="QUÉ COMUNICA TU SITIO" mt={0} />
        <Text style={{ fontSize: 7, color: T_LIGHT, lineHeight: 1.5, marginBottom: 12, fontFamily: "Helvetica" }}>
          Leído de {pagesRead.length + 1} página{pagesRead.length ? "s" : ""} de tu sitio
          {words ? ` · ${words.toLocaleString("es-MX")} palabras en total` : ""}
        </Text>

        {comm && (
          <>
            <Field label="QUÉ SE ENTIENDE QUE OFRECES" value={comm.queOfrece} />
            <Field label="A QUIÉN LE HABLA" value={comm.paraQuien} />
            <Field label="PROPUESTA DE VALOR" value={comm.propuestaDeValor} />
            {!!comm.brechaConObjetivo && (
              <View style={{ backgroundColor: PURPLE, borderRadius: 6, padding: "12px 15px", borderLeft: `4px solid ${RED}`, marginBottom: 4 }} wrap={false}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: RED, letterSpacing: 1, marginBottom: 5 }}>
                  LO QUE QUIERES DECIR VS. LO QUE DICE
                </Text>
                <Text style={{ fontSize: 9, color: "rgba(237,234,231,0.9)", lineHeight: 1.65, fontFamily: "Helvetica" }}>
                  {comm.brechaConObjetivo}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Redacción */}
        <SecLabel text="REDACCIÓN Y ORTOGRAFÍA" />
        {writing.length === 0 ? (
          <Text style={{ fontSize: 9, color: T_MID, lineHeight: 1.6, fontFamily: "Helvetica" }}>
            No se encontraron faltas en el texto revisado.
          </Text>
        ) : (
          <>
            {writing.slice(0, 6).map((issue, i) => (
              <View key={i} style={{ backgroundColor: WHITE, borderRadius: 5, padding: "8px 10px", marginBottom: 6 }} wrap={false}>
                <Text style={{ fontSize: 8.5, color: PURPLE, lineHeight: 1.45, fontFamily: "Helvetica-Oblique" }}>
                  “{issue.quote}”
                </Text>
                <Text style={{ fontSize: 7.5, color: T_MID, lineHeight: 1.45, marginTop: 3, fontFamily: "Helvetica" }}>
                  {issue.issue}
                  {!!issue.suggestion && (
                    <Text style={{ color: GREEN, fontFamily: "Helvetica-Bold" }}> → {issue.suggestion}</Text>
                  )}
                </Text>
              </View>
            ))}
            <Text style={{ fontSize: 6.5, color: T_LIGHT, lineHeight: 1.4, fontFamily: "Helvetica" }}>
              Revisión asistida sobre el texto real del sitio. Conviene confirmar nombres propios y términos de tu
              sector antes de corregir.
            </Text>
          </>
        )}

        {/* Diseño medido */}
        {design.length > 0 && (
          <>
            <SecLabel text="DISEÑO Y ACCESIBILIDAD MEDIDOS" />
            {design.map((finding) => (
              <DesignPill key={finding.id} finding={finding} />
            ))}
            <Text style={{ fontSize: 6.5, color: T_LIGHT, lineHeight: 1.4, fontFamily: "Helvetica" }}>
              Esto no es opinión: Lighthouse lo comprueba sobre la página ya cargada, elemento por elemento.
            </Text>
          </>
        )}

        {/* Diseño juzgado */}
        {data.designNotes?.length > 0 && (
          <>
            <SecLabel text="CÓMO SE VE" />
            {data.designNotes.slice(0, 4).map((note, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 6 }} wrap={false}>
                <Text style={{ fontSize: 9, color: RED, marginRight: 6 }}>›</Text>
                <Text style={{ fontSize: 9, color: PURPLE, lineHeight: 1.55, flex: 1, fontFamily: "Helvetica" }}>{note}</Text>
              </View>
            ))}
            <Text style={{ fontSize: 6.5, color: T_LIGHT, lineHeight: 1.4, fontFamily: "Helvetica" }}>
              Observaciones sobre la captura de la página. Son criterio, no medición.
            </Text>
          </>
        )}
      </View>
      <FooterStrip />
    </Page>
  );
}

/**
 * Una columna de la revisión.
 *
 * Su raíz no lleva `flex: 1` a propósito: dentro de un contenedor en columna
 * eso fija `flexBasis` en 0 sobre el alto, la columna colapsa y las filas
 * terminan encimadas. El ancho lo reparte el contenedor en fila de afuera.
 */
function CheckColumn({
  title,
  color,
  checks,
  empty,
}: {
  title: string;
  color: string;
  checks: Check[];
  empty?: string;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color, marginRight: 5 }} />
        <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color, letterSpacing: 0.5 }}>
          {title} ({checks.length})
        </Text>
      </View>
      {checks.map((c) => (
        <CheckRow key={c.id} check={c} />
      ))}
      {checks.length === 0 && !!empty && (
        <Text style={{ fontSize: 8, color: T_MID, lineHeight: 1.4, fontFamily: "Helvetica" }}>{empty}</Text>
      )}
    </View>
  );
}

/**
 * La revisión va en su propia página. Antes compartía página con la captura y
 * el filmstrip, y al no caber se partía el contenedor de dos columnas por la
 * mitad: el corte quedaba a media lista y se veía roto.
 */
function ChecksPage({ audit, name }: { audit: SiteAudit; name: string }) {
  const allChecks: Check[] = [
    ...(audit.scores.seoBasico.checks ?? []),
    ...(audit.scores.conversion.checks ?? []),
    ...(audit.scores.experienciaUsuario.checks ?? []),
  ];
  const failed = allChecks.filter((c) => c.passed === false);
  const passed = allChecks.filter((c) => c.passed === true);
  const unknown = allChecks.filter((c) => c.passed === null);

  return (
    <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 46 }}>
      <PageStrip name={name} />
      <View style={{ padding: "20px 40px 0 40px" }}>
        <SecLabel text="REVISIÓN PUNTO POR PUNTO" mt={0} />
        <Text style={{ fontSize: 8, color: T_MID, lineHeight: 1.5, marginBottom: 12, fontFamily: "Helvetica" }}>
          Las {allChecks.length} verificaciones que se le hicieron al sitio, con lo que se encontró en cada una. De aquí
          salen las calificaciones de la página anterior.
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <CheckColumn title="NO CUMPLE" color={RED} checks={failed} empty="Todo lo revisable salió bien." />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <CheckColumn title="YA FUNCIONA" color={GREEN} checks={passed} />
          </View>
        </View>

        {unknown.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <CheckColumn title="NO SE PUDO EVALUAR" color={T_LIGHT} checks={unknown} />
            <Text style={{ fontSize: 6.5, color: T_LIGHT, marginTop: 4, lineHeight: 1.4, fontFamily: "Helvetica" }}>
              Estas no cuentan ni a favor ni en contra: la calificación se calcula solo sobre lo que sí se pudo medir.
            </Text>
          </View>
        )}
      </View>
      <FooterStrip />
    </Page>
  );
}

// ── PDF Document ───────────────────────────────────────────────────────────────

function ReportPDF({
  data,
  audit,
  date,
}: {
  data: Narrative;
  audit: SiteAudit | null;
  date: string;
}) {
  const phases = [data.actionPlan.phase1, data.actionPlan.phase2, data.actionPlan.phase3];
  const opportunities = data.opportunities ?? [];
  const alta = opportunities.filter((o) => o.priority === "Alta").length;
  const media = opportunities.filter((o) => o.priority === "Media").length;
  const baja = opportunities.filter((o) => o.priority === "Baja").length;

  const psi = audit?.pagespeed.status === "ok" ? audit.pagespeed.value : null;
  const cover = psi?.screenshots.final ?? null;
  const measured = Boolean(audit && (audit.page.status === "ok" || audit.pagespeed.status === "ok"));

  // Con medición, "lo que funciona" son los checks que pasaron, no una opinión.
  const passedChecks: Check[] = audit
    ? [
        ...(audit.scores.seoBasico.checks ?? []),
        ...(audit.scores.conversion.checks ?? []),
        ...(audit.scores.experienciaUsuario.checks ?? []),
      ].filter((c) => c.passed === true)
    : [];

  return (
    <Document title={`Diagnóstico EmberLab — ${data.clientName}`} author="Ember Lab">
      {/* ═══ PORTADA ═══ */}
      <Page size="A4" style={{ backgroundColor: RED, fontFamily: "Helvetica" }}>
        <View style={{ flex: 1, padding: 50, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EmberLogo size={22} />
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.6)", letterSpacing: 3, marginLeft: 10 }}>
              EMBER LAB
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: 4, marginBottom: 18, fontFamily: "Helvetica" }}>
                {measured ? "AUDITORÍA MEDIDA DE SITIO WEB" : "DIAGNÓSTICO DE SITIO WEB"}
              </Text>
              {/* Una palabra por línea: partir "DIAGNÓS/TICO" se leía como un
                  error de impresión, no como una decisión tipográfica. */}
              <Text style={{ fontSize: 40, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.05 }}>DIAGNÓSTICO</Text>
              <Text style={{ fontSize: 40, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.18)", lineHeight: 1.05 }}>DIGITAL</Text>
            </View>
            {cover && (
              <Image src={cover} style={{ width: 96, height: 191, borderRadius: 5, marginLeft: 20, border: "2px solid rgba(255,255,255,0.35)", objectFit: "cover" }} />
            )}
          </View>

          <View>
            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 22 }} />
            <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginBottom: 8, fontFamily: "Helvetica" }}>
              PREPARADO PARA
            </Text>
            <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 4 }}>{data.clientName}</Text>
            {!!data.company && (
              <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2, fontFamily: "Helvetica" }}>{data.company}</Text>
            )}
            {!!data.website && data.website !== "Sin sitio web" && (
              <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontFamily: "Helvetica" }}>{data.website}</Text>
            )}
            <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "Helvetica" }}>{date}</Text>
          </View>
        </View>
      </Page>

      {/* ═══ EVIDENCIA ═══ */}
      {audit && measured && <EvidencePage audit={audit} name={data.clientName} />}
      {audit && measured && <CommunicationPage data={data} audit={audit} name={data.clientName} />}
      {audit && measured && <ChecksPage audit={audit} name={data.clientName} />}

      {/* ═══ DIAGNÓSTICO ═══ */}
      <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 46 }}>
        <PageStrip name={data.clientName} />
        <View style={{ padding: "20px 40px 0 40px" }}>
          <SecLabel text="RESUMEN EJECUTIVO" mt={0} />
          <Text style={{ fontSize: 9.5, color: PURPLE, lineHeight: 1.75, marginBottom: 6, fontFamily: "Helvetica" }}>
            {data.executiveSummary}
          </Text>

          {data.visualObservations?.length > 0 && (
            <>
              <SecLabel text="LO QUE SE VE AL ABRIR TU SITIO" />
              {data.visualObservations.slice(0, 4).map((item, i) => (
                <View key={i} style={{ flexDirection: "row", marginBottom: 6 }}>
                  <Text style={{ fontSize: 9, color: RED, marginRight: 6 }}>›</Text>
                  <Text style={{ fontSize: 9, color: PURPLE, lineHeight: 1.55, flex: 1, fontFamily: "Helvetica" }}>{item}</Text>
                </View>
              ))}
              <Text style={{ fontSize: 6.5, color: T_LIGHT, marginTop: 2, lineHeight: 1.4, fontFamily: "Helvetica" }}>
                Observaciones sobre la captura de la página, no mediciones. Son criterio, y como tal se pueden discutir.
              </Text>
            </>
          )}

          {!measured && data.workingWell?.length > 0 && (
            <>
              <SecLabel text="LO QUE ESTÁ FUNCIONANDO" />
              {data.workingWell.slice(0, 4).map((item, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 7 }}>
                  <View style={{ width: 13, height: 13, backgroundColor: GREEN, borderRadius: 3, alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: 1 }}>
                    <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: WHITE }}>✓</Text>
                  </View>
                  <Text style={{ fontSize: 9, color: PURPLE, lineHeight: 1.5, flex: 1, fontFamily: "Helvetica" }}>{item}</Text>
                </View>
              ))}
            </>
          )}

          <SecLabel text="OPORTUNIDADES DE MEJORA" />
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {[
              [alta, RED, "Alta"],
              [media, AMBER, "Media"],
              [baja, GREEN, "Baja"],
            ]
              .filter(([n]) => (n as number) > 0)
              .map(([n, color, label], i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", marginRight: 14 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: color as string, marginRight: 4 }} />
                  <Text style={{ fontSize: 7, color: T_MID, fontFamily: "Helvetica" }}>
                    {n as number} {label as string} prioridad
                  </Text>
                </View>
              ))}
          </View>

          {opportunities.map((opp, i) => (
            <View
              key={i}
              style={{ backgroundColor: WHITE, borderRadius: 6, padding: "10px 12px", borderLeft: `3px solid ${pColor(opp.priority)}`, marginBottom: 7 }}
              wrap={false}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <Text style={{ fontSize: 9.5, fontFamily: "Helvetica-Bold", color: PURPLE, flex: 1, marginRight: 6 }}>{opp.title}</Text>
                <View style={{ backgroundColor: pColor(opp.priority), borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, flexShrink: 0 }}>
                  <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold", color: WHITE }}>{opp.priority}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 8.5, color: T_MID, lineHeight: 1.5, marginBottom: 5, fontFamily: "Helvetica" }}>{opp.description}</Text>
              {!!opp.evidence && (
                <View style={{ backgroundColor: CREAM, borderRadius: 3, padding: "5px 7px", marginBottom: 5 }}>
                  <Text style={{ fontSize: 7, color: T_MID, lineHeight: 1.4, fontFamily: "Helvetica" }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", color: PURPLE }}>Lo medido: </Text>
                    {opp.evidence}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: T_LIGHT, marginRight: 3 }}>Impacto:</Text>
                <Text style={{ fontSize: 7, color: T_MID, flex: 1, lineHeight: 1.4, fontFamily: "Helvetica" }}>{opp.impact}</Text>
              </View>
            </View>
          ))}
        </View>
        <FooterStrip />
      </Page>

      {/* ═══ PLAN ═══ */}
      <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 46 }}>
        <PageStrip name={data.clientName} />
        <View style={{ padding: "20px 40px 0 40px" }}>
          <SecLabel text="PLAN DE ACCIÓN RECOMENDADO" mt={0} />
          {phases.map((phase, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 10, alignItems: "flex-start" }} wrap={false}>
              <View style={{ width: 36, alignItems: "center", paddingTop: 2 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: PHASE_COLORS[i], alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: WHITE }}>{i + 1}</Text>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: WHITE, borderRadius: 6, padding: "10px 14px", borderTop: `3px solid ${PHASE_COLORS[i]}` }}>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: PURPLE, marginBottom: 2 }}>{phase.label}</Text>
                <Text style={{ fontSize: 8, color: T_LIGHT, marginBottom: 8, fontFamily: "Helvetica" }}>{phase.description}</Text>
                {phase.actions.map((action, j) => (
                  <View key={j} style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ fontSize: 9, color: RED, marginRight: 6 }}>›</Text>
                    <Text style={{ fontSize: 9, color: T_MID, lineHeight: 1.45, flex: 1, fontFamily: "Helvetica" }}>{action}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <SecLabel text="CÓMO PUEDE AYUDARTE EMBER LAB" />
          <View style={{ backgroundColor: PURPLE, borderRadius: 8, padding: "16px 20px", borderLeft: `4px solid ${RED}` }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <EmberLogo size={18} />
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: WHITE, marginLeft: 8 }}>Ember Lab</Text>
            </View>
            <Text style={{ fontSize: 9.5, color: "rgba(237,234,231,0.85)", lineHeight: 1.7, fontFamily: "Helvetica" }}>{data.emberLabHelp}</Text>
          </View>

          {/* Metodología: de dónde salió cada cosa. */}
          <SecLabel text="CÓMO SE HIZO ESTE DIAGNÓSTICO" />
          <Text style={{ fontSize: 7.5, color: T_MID, lineHeight: 1.6, fontFamily: "Helvetica" }}>
            {measured && audit
              ? `Se descargó y revisó el HTML de ${audit.page.status === "ok" ? audit.page.value.finalUrl : data.website} y se midió su carga con PageSpeed Insights de Google, que abre la página en un Chrome real simulando un celular con red lenta. ${passedChecks.length} de las verificaciones salieron bien. Las calificaciones son deterministas: se calculan con una rúbrica fija sobre lo encontrado, no las decide un modelo de lenguaje. Lo que no se pudo medir aparece marcado como no medido, con su razón. Las mediciones de laboratorio pueden variar entre corridas y suelen ser más severas que lo que experimentan los visitantes reales.`
              : `No fue posible medir el sitio de forma automática, así que este diagnóstico se basa en lo que compartiste en la conversación. Las observaciones son de criterio profesional, no mediciones.`}
          </Text>

          <View style={{ marginTop: 14, backgroundColor: RED, borderRadius: 6, padding: "12px 18px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 9, color: WHITE, fontFamily: "Helvetica" }}>¿Listo para dar el siguiente paso?</Text>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: WHITE }}>hola@emberlab.mx</Text>
          </View>
        </View>
        <FooterStrip />
      </Page>
    </Document>
  );
}

// ── Análisis del sitio ─────────────────────────────────────────────────────────

/**
 * Busca la dirección que el prospecto escribió en la conversación. Se recorre
 * al revés porque si corrigió la URL, la última es la buena.
 *
 * El filtro del arroba no es cosmético: la conversación termina pidiendo el
 * correo, y "hola@susitio.com" se parsea como una URL válida con "hola" de
 * usuario. Sin esto el reporte analizaría el correo en vez del sitio.
 */
/**
 * Forma de dominio, para leer prosa sin falsos positivos: la última etiqueta
 * tiene que ser un TLD de letras. Así "3.5" o "1.2" se quedan fuera.
 */
const DOMAIN_SHAPE = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:[/?#].*)?$/i;

export function findUrlInMessages(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "user") continue;
    for (const raw of message.content.split(/[\s,;()<>"']+/)) {
      if (raw.includes("@")) continue;
      // La dirección suele venir al final de una frase: "es tusitio.com."
      const token = raw.replace(/[.,;:!?)\]]+$/, "");
      if (!DOMAIN_SHAPE.test(token)) continue;
      const parsed = normalizeInputUrl(token);
      if (parsed && !parsed.url.username && !parsed.url.password) return parsed.url.href;
    }
  }
  return null;
}

/** Espacios, acentos y mayúsculas fuera, para comparar texto sin sorpresas. */
function loose(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Se queda solo con las faltas comprobables.
 *
 * Un modelo al que se le pide una lista tiende a llenarla: devolvió "falta un
 * punto final" sobre una frase que ya terminaba en punto, con la cita y la
 * corrección idénticas. Aquí no se discute con el prompt, se verifica: la cita
 * tiene que aparecer literal en el texto del sitio y la corrección tiene que
 * ser distinta de la cita. Lo que no pase ambas, se cae.
 */
export function verifyWriting(issues: WritingIssue[] | undefined, corpus: string): WritingIssue[] {
  const haystack = loose(corpus);
  const seen = new Set<string>();

  return (issues ?? []).filter((issue) => {
    const quote = (issue?.quote ?? "").trim();
    const suggestion = (issue?.suggestion ?? "").trim();
    if (!quote || !suggestion) return false;
    // Una "corrección" igual a la cita no corrige nada.
    if (loose(quote) === loose(suggestion)) return false;
    // Si la cita no está en el sitio, el modelo la reconstruyó de memoria.
    if (!haystack.includes(loose(quote))) return false;
    const key = loose(quote);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── API handler ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres un consultor senior de Ember Lab que redacta el diagnóstico de un sitio web.

Recibes tres cosas: la conversación con el prospecto, la MEDICIÓN REAL de su sitio y el TEXTO REAL de varias de sus páginas. Puede que también recibas una captura de pantalla.

REGLA PRINCIPAL: no inventes datos. Cada afirmación sobre el sitio tiene que venir de la medición, de la captura, o de lo que el prospecto dijo. Si algo aparece como "no medido", dilo así; nunca lo estimes.

- No inventes cifras. Usa exactamente los números de la medición, con sus unidades.
- No contradigas la medición. Si la medición dice que sí hay formulario, no digas que falta.
- No califiques con números: las calificaciones ya están calculadas y no te toca cambiarlas.
- Si hay captura, describe solo lo que se alcanza a ver. La captura es de un celular y es pequeña: si algo no se distingue, no lo afirmes.
- Conecta cada hallazgo con el objetivo de negocio que el prospecto mencionó.
- Tono profesional, directo y humano. Sin lenguaje de venta agresivo ni promesas de resultados.

Responde SOLO con este JSON:

{
  "clientName": "nombre del cliente ('Cliente' si no lo dijo)",
  "company": "descripción breve de la empresa, una línea",
  "website": "URL del sitio o 'Sin sitio web'",
  "email": "correo si lo dio, o vacío",
  "objective": "objetivo principal del sitio",
  "targetAudience": "cliente ideal descrito",
  "mainChallenge": "principal reto identificado",
  "executiveSummary": "máximo 90 palabras. Arranca con el hallazgo medido más importante y su consecuencia para el objetivo del prospecto. Cita al menos un número real de la medición.",
  "visualObservations": ["2 a 4 observaciones sobre lo que se ve en la captura: jerarquía, si se entiende a qué se dedica, si hay una acción clara a la vista. Arreglo vacío si no hubo captura."],
  "communication": {
    "queOfrece": "qué vende u ofrece el sitio, según SU PROPIO texto. 1-2 oraciones concretas, no genéricas. Si el texto no lo deja claro, dilo: ese es el hallazgo.",
    "paraQuien": "a quién le habla el sitio según su texto. Si no se dirige a nadie en particular, dilo.",
    "propuestaDeValor": "qué promete y por qué alguien lo elegiría, según el texto. Si no hay una promesa clara, dilo.",
    "brechaConObjetivo": "2-3 oraciones comparando lo que el prospecto dijo que quiere comunicar y a quién quiere atraer, contra lo que su sitio realmente comunica. Señala la diferencia concreta. Si coinciden, dilo así de claro."
  },
  "writing": [
    {
      "quote": "el fragmento con la falta, copiado TEXTUAL del sitio, máximo 15 palabras",
      "issue": "qué está mal, en una frase",
      "suggestion": "cómo debería quedar"
    }
  ],
  "designNotes": ["2 a 4 observaciones de diseño sobre la captura: jerarquía visual, aire, consistencia, si se ve actual o desactualizado. Arreglo vacío si no hubo captura."],
  "workingWell": ["2 a 4 puntos positivos. Solo se usa si NO hubo medición."],
  "opportunities": [
    {
      "title": "título corto y concreto",
      "description": "qué hacer, en 1-2 oraciones",
      "evidence": "el dato medido que lo sustenta, con su número. Vacío si viene de la conversación y no de la medición.",
      "impact": "qué cambia para el negocio, 1 oración",
      "priority": "Alta"
    }
  ],
  "actionPlan": {
    "phase1": { "label": "Fase 1 · Ajustes rápidos", "description": "Semanas 1–4", "actions": ["acción", "acción", "acción"] },
    "phase2": { "label": "Fase 2 · Optimización", "description": "Meses 1–3", "actions": ["acción", "acción"] },
    "phase3": { "label": "Fase 3 · Crecimiento", "description": "Meses 3–6", "actions": ["acción", "acción"] }
  },
  "emberLabHelp": "3-4 oraciones sobre cómo Ember Lab puede acompañar este proyecto concreto, mencionando los hallazgos reales. Sin lenguaje comercial agresivo."
}

REGLAS DE FORMATO:
- Entre 3 y 5 oportunidades, ordenadas de mayor a menor prioridad.
- priority es exactamente "Alta", "Media" o "Baja".
- Prioriza por impacto en el objetivo del prospecto, no por facilidad técnica.

REGLAS DE \`communication\`:
- Sale del TEXTO REAL del sitio, no de lo que el prospecto contó. Si el prospecto dice que vende una cosa y el sitio comunica otra, ESA es la observación más valiosa del reporte.
- No adornes. Si el sitio no deja claro qué ofrece, decirlo es el hallazgo.

REGLAS DE \`writing\`:
- Máximo 6, y SOLO faltas objetivas: una letra equivocada, una tilde que falta o sobra, una concordancia rota, un signo que cambia el sentido.
- Prueba definitiva: tienes que poder señalar la letra, la tilde o el signo exacto que está mal. Si tu corrección cambia el estilo, el tono, o agrega o quita palabras, NO es una falta ortográfica y no va.
- \`quote\` tiene que ser texto que aparezca LITERAL en el sitio. Si no lo puedes copiar tal cual, no lo reportes.
- No marques nombres propios, marcas, anglicismos de uso común ni decisiones de estilo (mayúsculas, texto sin punto final).
- Si no hay faltas, devuelve un arreglo vacío. No inventes para llenar: un reporte sin faltas es un buen resultado, no un reporte incompleto.
- \`suggestion\` tiene que ser DISTINTA de \`quote\`. Si la corrección quedaría igual que el original, no era una falta.

REGLAS DE \`designNotes\`:
- Solo lo que se alcanza a ver en la captura, que es de celular y pequeña.
- No hables de contraste ni de accesibilidad aquí: eso ya viene medido aparte.`;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY no configurada", { status: 503 });
  }

  const { messages }: { messages: Message[] } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Falta la conversación", { status: 400 });
  }

  // 1. Medir el sitio de verdad, si el prospecto dio una dirección.
  const url = findUrlInMessages(messages);
  let audit: SiteAudit | null = null;
  if (url) {
    try {
      audit = await analyzeSite(url);
    } catch {
      // Un fallo del análisis no debe dejar al prospecto sin reporte: se sigue
      // con lo que dijo en la conversación y el PDF lo declara.
      audit = null;
    }
  }

  // 2. Redactar sobre esos hechos (y sobre la captura, si la hay).
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const screenshot =
    audit?.pagespeed.status === "ok" ? audit.pagespeed.value.screenshots.final : null;

  const measurementBlock = audit
    ? factsToPrompt(auditFacts(audit))
    : url
      ? `No se pudo analizar ${url}. Redacta el diagnóstico solo con lo que dijo el prospecto y no afirmes nada sobre el estado técnico del sitio.`
      : "El prospecto no compartió una dirección de sitio web. Redacta el diagnóstico solo con lo que contó.";

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: measurementBlock },
  ];
  if (screenshot) {
    userContent.push({
      type: "text",
      text: "Esta es la captura de la página cargada en un celular. Úsala para `visualObservations` y `designNotes`.",
    });
    userContent.push({ type: "image_url", image_url: { url: screenshot } });
  }

  const extraction = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ],
  });

  let data: Narrative;
  try {
    data = JSON.parse(extraction.choices[0].message.content ?? "{}") as Narrative;
  } catch {
    return new Response("Error generando el reporte", { status: 500 });
  }
  if (!data.clientName) data.clientName = "Cliente";

  // Las faltas de ortografía se contrastan contra el texto que de verdad se leyó.
  const corpus = [
    audit?.page.status === "ok" ? audit.page.value.content.text : "",
    ...(audit?.otherPages.status === "ok" ? audit.otherPages.value.map((x) => x.text) : []),
  ].join(" ");
  data.writing = verifyWriting(data.writing, corpus);

  if (url && (!data.website || data.website === "Sin sitio web")) data.website = url;

  // 3. Armar el PDF: los números salen del audit, las palabras del modelo.
  const date = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  const pdfBuffer = await renderToBuffer(<ReportPDF data={data} audit={audit} date={date} />);

  const slug = data.clientName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-emberlab-${slug || "cliente"}.pdf"`,
    },
  });
}

/* eslint-disable jsx-a11y/alt-text --
   `Image` aquí es el de @react-pdf/renderer, que pinta dentro de un PDF y no
   acepta `alt`. La regla lo confunde con el <img> del DOM. */
import React from "react";
import { Circle, Document, Font, Image, Link, Page, Path, Svg, Text, View } from "@react-pdf/renderer";

import { formatMs } from "@/lib/audit/score";
import type { Check, Score, SiteAudit } from "@/lib/audit/types";
import { CONTACT_EMAIL, whatsappUrl } from "@/lib/contact";
import {
  PREGUNTA_TITULO,
  PREGUNTAS,
  scoreBand,
  scoreFor,
  type Oportunidad,
  type Pregunta,
  type ReportNarrative,
} from "./prompt";
import type { Questionnaire } from "./questionnaire";

// react-pdf parte palabras con guion por default ("con-tactarte"). En un
// reporte para leer de corrido eso estorba más de lo que ayuda.
Font.registerHyphenationCallback((word) => [word]);

// ── Design tokens ──────────────────────────────────────────────────────────────
const RED = "#E73F40";
const RED_TINT = "#fde4e4";
const PURPLE = "#301f4b";
const PURPLE_PALE = "#aca1c3";
const LAVENDER = "#ece8f4";
const CREAM = "#f8f7f4";
const CREAM_D = "#e8e3dc";
const WHITE = "#ffffff";
const T_MID = "#5a4d7a";
const T_LIGHT = "#9080b0";
const GREEN = "#1f9d55";
const GREEN_TINT = "#e4f5ea";
const AMBER = "#e8900c";
const WHATSAPP = "#25d366";

const TONE_COLOR = { alto: GREEN, medio: AMBER, bajo: RED } as const;

function band(n: number): { label: string; color: string } {
  const { label, tone } = scoreBand(n);
  return { label, color: TONE_COLOR[tone] };
}

/** Semáforo con los umbrales de Google: bueno hasta `good`, malo después de `poor`. */
function metricColor(value: number, good: number, poor: number): string {
  return value <= good ? GREEN : value <= poor ? AMBER : RED;
}

const SUBTITLES: Record<Pregunta, string> = {
  te_encuentran: "Si Google te muestra y tu resultado invita a hacer clic",
  se_quedan: "Si tu sitio carga rápido y se usa sin fricción",
  te_contactan: "Si quien llega interesado puede escribirte fácilmente",
};

// ── Texto seguro para el PDF ───────────────────────────────────────────────────

/**
 * Helvetica es una fuente estándar del PDF y solo trae el juego WinAnsi
 * (Latin-1 más comillas tipográficas, guiones y viñetas). Cualquier otro
 * carácter —una flecha, un emoji que se le escape al modelo— sale como basura,
 * así que se traduce o se quita antes de pintar.
 */
const WIN_ANSI_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
const REPLACEMENTS: Record<string, string> = { "→": "›", "←": "‹", "≤": "<=", "≥": ">=", "−": "-" };

function pdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7e\xa0-\xff\n]/gu, (ch) => REPLACEMENTS[ch] ?? (WIN_ANSI_EXTRA.includes(ch) ? ch : ""))
    .replace(/ {2,}/g, " ")
    .trim();
}

function pdfSafe<T>(value: T): T {
  if (typeof value === "string") return pdfText(value) as T;
  if (Array.isArray(value)) return value.map(pdfSafe) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pdfSafe(v)])) as T;
  }
  return value;
}

/**
 * El resumen llega como un solo párrafo; el diseño lo parte en entrada en
 * negritas, cuerpo y la frase síntesis en rojo, que el prompt pide al final.
 */
function splitSummary(text: string): { lead: string; body: string; close: string } {
  const sentences = text.split(/(?<=[.!?…])\s+(?=[¿¡«"“A-ZÁÉÍÓÚÑ0-9])/).filter(Boolean);
  if (sentences.length <= 2) return { lead: "", body: sentences.join(" "), close: "" };
  const close = sentences[sentences.length - 1];
  const rest = sentences.slice(0, -1);
  const leadCount = rest.length >= 4 ? 2 : 1;
  return { lead: rest.slice(0, leadCount).join(" "), body: rest.slice(leadCount).join(" "), close };
}

const NUMBER_WORDS = ["cero", "una", "dos", "tres", "cuatro", "cinco"];

function allChecks(audit: SiteAudit): Check[] {
  return [
    ...(audit.scores.seoBasico.checks ?? []),
    ...(audit.scores.experienciaUsuario.checks ?? []),
    ...(audit.scores.conversion.checks ?? []),
  ];
}

// ── Piezas compartidas ─────────────────────────────────────────────────────────

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

function SecLabel({ text, mt = 18 }: { text: string; mt?: number }) {
  return (
    <View style={{ marginTop: mt, marginBottom: 10, paddingBottom: 5, borderBottom: `1px solid ${RED}` }} minPresenceAhead={60}>
      <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: RED, letterSpacing: 2.2 }}>{text}</Text>
    </View>
  );
}

function Caption({ children, mt = 4 }: { children: React.ReactNode; mt?: number }) {
  return <Text style={{ fontSize: 6.8, color: T_LIGHT, marginTop: mt, lineHeight: 1.45 }}>{children}</Text>;
}

function PageStrip({ name }: { name: string }) {
  return (
    <View
      style={{ backgroundColor: PURPLE, padding: "13px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      fixed
    >
      <Text style={{ fontSize: 8.5, color: "rgba(237,234,231,0.6)" }}>Diagnóstico · {name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <EmberLogo size={13} />
        <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: RED, marginLeft: 6 }}>Ember Lab</Text>
        <Text
          style={{ fontSize: 8.5, color: "rgba(237,234,231,0.45)", marginLeft: 12 }}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </View>
    </View>
  );
}

function FooterStrip() {
  return (
    <View
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: PURPLE, padding: "11px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      fixed
    >
      <Text style={{ fontSize: 7.5, color: "rgba(237,234,231,0.5)" }}>Reporte confidencial · Ember Lab</Text>
      <Text style={{ fontSize: 7.5, color: RED, fontFamily: "Helvetica-Bold" }}>{CONTACT_EMAIL}</Text>
    </View>
  );
}

function ContentPage({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 50 }}>
      <PageStrip name={name} />
      <View style={{ padding: "22px 40px 0 40px" }}>{children}</View>
      <FooterStrip />
    </Page>
  );
}

// ── Portada ────────────────────────────────────────────────────────────────────

function Cover({ name, giro, site, date, shot }: { name: string; giro: string; site: string; date: string; shot: string | null }) {
  return (
    <Page size="A4" style={{ backgroundColor: RED, fontFamily: "Helvetica" }}>
      <View style={{ flex: 1, padding: "44px 45px", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <EmberLogo size={24} />
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: WHITE, letterSpacing: 4, marginLeft: 10 }}>EMBER LAB</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, paddingRight: 18 }}>
            <Text style={{ fontSize: 7.5, color: "rgba(255,255,255,0.7)", letterSpacing: 3, marginBottom: 8 }}>
              DIAGNÓSTICO MEDIDO DE SITIO WEB
            </Text>
            {/* Una palabra por línea: partir "DIAGNÓS/TICO" se leía como un
                error de impresión, no como una decisión tipográfica. */}
            <Text style={{ fontSize: 44, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.02 }}>DIAGNÓSTICO</Text>
            <Text style={{ fontSize: 44, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.35)", lineHeight: 1.02, marginBottom: 14 }}>
              DIGITAL
            </Text>
            <Text style={{ fontSize: 13, color: WHITE, lineHeight: 1.45, marginBottom: 14, maxWidth: 290 }}>
              Qué está frenando a tu sitio para conseguir clientes, y cómo resolverlo.
            </Text>
            <View style={{ flexDirection: "row" }}>
              {PREGUNTAS.map((p) => (
                <View key={p} style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 9, padding: "4px 8px", marginRight: 5 }}>
                  <Text style={{ fontSize: 8, color: WHITE }}>{PREGUNTA_TITULO[p]}</Text>
                </View>
              ))}
            </View>
          </View>
          {shot && (
            <Image src={shot} style={{ width: 113, height: 226, borderRadius: 5, border: "2px solid rgba(255,255,255,0.9)", objectFit: "cover" }} />
          )}
        </View>

        <View>
          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.35)", marginBottom: 22 }} />
          <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: 3, marginBottom: 6 }}>PREPARADO PARA</Text>
          <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 4 }}>{name}</Text>
          {!!giro && <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginBottom: 1 }}>{giro}</Text>}
          {!!site && <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>{site}</Text>}
          <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.6)" }}>{date}</Text>
        </View>
      </View>
    </Page>
  );
}

// ── Tu sitio en tres preguntas ─────────────────────────────────────────────────

function QuestionCard({ pregunta, score, verdict }: { pregunta: Pregunta; score: Score; verdict: string }) {
  const b = score.status === "ok" ? band(score.value) : null;
  return (
    <View style={{ backgroundColor: WHITE, borderRadius: 5, padding: "9px 12px", marginBottom: 7 }} wrap={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={{ fontSize: 12.5, fontFamily: "Helvetica-Bold", color: PURPLE }}>{PREGUNTA_TITULO[pregunta]}</Text>
          <Text style={{ fontSize: 7, color: T_LIGHT, marginTop: 2 }}>{SUBTITLES[pregunta]}</Text>
        </View>
        {score.status === "ok" && b ? (
          <Text style={{ fontSize: 22, fontFamily: "Helvetica-Bold", color: b.color }}>
            {score.value}
            <Text style={{ fontSize: 8, fontFamily: "Helvetica", color: T_LIGHT }}>/100</Text>
          </Text>
        ) : (
          <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color: T_LIGHT }}>No medido</Text>
        )}
      </View>

      {score.status === "ok" && b && (
        <>
          <View style={{ height: 4, backgroundColor: CREAM_D, borderRadius: 2, marginTop: 5, marginBottom: 6 }}>
            <View style={{ width: `${Math.max(score.value, 2)}%`, height: 4, backgroundColor: b.color, borderRadius: 2 }} />
          </View>
          <View style={{ alignSelf: "flex-start", border: `1px solid ${b.color}`, borderRadius: 8, padding: "2px 6px", marginBottom: 5 }}>
            <Text style={{ fontSize: 6.8, fontFamily: "Helvetica-Bold", color: b.color }}>{b.label}</Text>
          </View>
        </>
      )}

      <Text style={{ fontSize: 8, color: PURPLE, lineHeight: 1.45, marginTop: score.status === "ok" ? 0 : 5 }}>
        {score.status === "ok" ? verdict : score.reason}
      </Text>
    </View>
  );
}

function SpeedCard({ value, suffix, color, children, last }: { value: string; suffix?: string; color: string; children: React.ReactNode; last?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: WHITE, borderRadius: 4, borderTop: `3px solid ${color}`, padding: "8px 9px", marginRight: last ? 0 : 6 }}>
      <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color, marginBottom: 4 }}>
        {value}
        {!!suffix && <Text style={{ fontSize: 7, fontFamily: "Helvetica", color: T_LIGHT }}>{suffix}</Text>}
      </Text>
      <Text style={{ fontSize: 7.5, color: PURPLE, lineHeight: 1.4 }}>{children}</Text>
    </View>
  );
}

function ThreeQuestionsPage({ narrative, audit, name, shot }: { narrative: ReportNarrative; audit: SiteAudit; name: string; shot: string | null }) {
  const psi = audit.pagespeed.status === "ok" ? audit.pagespeed.value : null;
  const lab = psi?.lab ?? null;

  // Seis cuadros repartidos parejo a lo largo de la carga; ocho no caben
  // legibles, y tomar "uno de cada N" desperdiciaría espacio cuando N no divide.
  const frames = psi?.screenshots.filmstrip ?? [];
  const strip =
    frames.length <= 6
      ? frames
      : Array.from({ length: 6 }, (_, i) => frames[Math.round((i * (frames.length - 1)) / 5)]);
  const stripSeconds = strip.length ? Math.max(1, Math.round(Math.max(...strip.map((f) => f.timingMs)) / 1000)) : 0;

  const analyzedOn = new Date(audit.analyzedAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Mexico_City",
  });

  // Solo lo que se midió: una métrica sin dato no se pinta en blanco.
  const speed: Array<{ key: string; value: string; suffix?: string; color: string; text: React.ReactNode }> = [];
  if (lab?.lcpMs != null) {
    speed.push({
      key: "lcp",
      value: formatMs(lab.lcpMs),
      color: metricColor(lab.lcpMs, 2500, 4000),
      text: (
        <>
          {lab.lcpMs <= 2500
            ? "Tu contenido principal aparece a tiempo. "
            : "Tu página tarda en terminar de cargar su contenido principal. "}
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Lo recomendado: 2.5 s o menos.</Text>
        </>
      ),
    });
  }
  if (lab?.fcpMs != null) {
    speed.push({
      key: "fcp",
      value: formatMs(lab.fcpMs),
      color: metricColor(lab.fcpMs, 1800, 3000),
      text: `Tu página empieza a mostrar algo a los ${formatMs(lab.fcpMs)}.`,
    });
  }
  if (lab?.cls != null) {
    speed.push({
      key: "cls",
      value: lab.cls.toFixed(2),
      color: metricColor(lab.cls, 0.1, 0.25),
      text:
        lab.cls <= 0.1
          ? "Tu página no se mueve mientras carga. Nada brinca."
          : "El contenido brinca mientras carga. Lo recomendado: 0.1 o menos.",
    });
  }
  if (lab?.accessibility != null) {
    speed.push({
      key: "a11y",
      value: String(lab.accessibility),
      suffix: "/100",
      color: lab.accessibility >= 90 ? GREEN : lab.accessibility >= 50 ? AMBER : RED,
      text: "En qué tan fácil es de usar para todas las personas.",
    });
  }

  return (
    <ContentPage name={name}>
      <SecLabel text="TU SITIO EN TRES PREGUNTAS" mt={0} />

      {!!narrative.frase_sintesis && (
        <View style={{ backgroundColor: PURPLE, borderRadius: 5, padding: "10px 14px", marginBottom: 10 }}>
          <Text style={{ fontSize: 6.5, color: RED, letterSpacing: 2, marginBottom: 3 }}>EN POCAS PALABRAS</Text>
          <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", color: WHITE }}>{narrative.frase_sintesis}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row" }}>
        {shot && (
          <View style={{ width: 118, marginRight: 10 }}>
            <Image src={shot} style={{ width: 118, height: 236, borderRadius: 5, objectFit: "cover", backgroundColor: CREAM_D }} />
            <Caption mt={5}>Tu sitio como lo ve Google en un celular.</Caption>
          </View>
        )}
        <View style={{ flex: 1 }}>
          {PREGUNTAS.map((p) => (
            <QuestionCard key={p} pregunta={p} score={scoreFor(audit, p)} verdict={narrative.veredictos[p]} />
          ))}
        </View>
      </View>
      <Caption mt={1}>
        Calculado sobre {allChecks(audit).length} verificaciones hechas a tu sitio el {analyzedOn}.
      </Caption>

      {speed.length > 0 && (
        <>
          <SecLabel text="QUÉ TAN RÁPIDO CARGA" />
          <View style={{ flexDirection: "row" }}>
            {speed.map((item, i) => (
              <SpeedCard key={item.key} value={item.value} suffix={item.suffix} color={item.color} last={i === speed.length - 1}>
                {item.text}
              </SpeedCard>
            ))}
          </View>
        </>
      )}

      {strip.length > 0 && (
        <View wrap={false}>
          <SecLabel text={`ASÍ SE VE TU SITIO MIENTRAS CARGA · PRIMEROS ${stripSeconds} SEGUNDO${stripSeconds === 1 ? "" : "S"}`} />
          <View style={{ flexDirection: "row" }}>
            {strip.map((frame, i) => (
              <View key={i} style={{ flex: 1, marginRight: i === strip.length - 1 ? 0 : 5 }}>
                <Image src={frame.data} style={{ width: "100%", height: 112, borderRadius: 3, objectFit: "cover", backgroundColor: WHITE }} />
                <Text style={{ fontSize: 6.5, color: T_LIGHT, marginTop: 3, textAlign: "center" }}>
                  {(frame.timingMs / 1000).toFixed(1)} s
                </Text>
              </View>
            ))}
          </View>
          {/* Sin cifras a propósito: PageSpeed simula la red lenta para las
              métricas, pero los cuadros salen de la carga real, así que sus
              tiempos no coinciden con los de arriba. */}
          <Caption>Así va apareciendo tu página, cuadro por cuadro, mientras carga en un celular.</Caption>
        </View>
      )}
    </ContentPage>
  );
}

// ── Resumen ejecutivo ──────────────────────────────────────────────────────────

function Arrow() {
  return (
    <Svg width={18} height={10} viewBox="0 0 18 10">
      <Path d="M0 5 H16 M12 1 L16 5 L12 9" stroke={RED} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function SummaryPage({ narrative, audit, name, hasShot }: { narrative: ReportNarrative; audit: SiteAudit; name: string; hasShot: boolean }) {
  const { lead, body, close } = splitSummary(narrative.resumen_ejecutivo);

  const cruceRows = narrative.cruce.lo_medido.flatMap(({ pregunta, texto }) => {
    const score = scoreFor(audit, pregunta);
    return score.status === "ok" ? [{ pregunta, texto, value: score.value }] : [];
  });
  const showCruce = narrative.escenario_cruce !== "C" && !!narrative.cruce.nos_dijiste && cruceRows.length > 0;
  const observations = hasShot ? narrative.observaciones_captura : [];

  return (
    <ContentPage name={name}>
      <SecLabel text="RESUMEN EJECUTIVO" mt={0} />
      {!!lead && (
        <Text style={{ fontSize: 11.5, fontFamily: "Helvetica-Bold", color: PURPLE, lineHeight: 1.55, marginBottom: 8 }}>{lead}</Text>
      )}
      {!!body && <Text style={{ fontSize: 9.5, color: T_MID, lineHeight: 1.7, marginBottom: 8 }}>{body}</Text>}
      {!!close && <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: RED, lineHeight: 1.5 }}>{close}</Text>}

      {showCruce && (
        <View wrap={false}>
          <SecLabel text="LO QUE NOS DIJISTE VS. LO QUE MEDIMOS" />
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 150, backgroundColor: WHITE, borderRadius: 5, borderLeft: `3px solid ${PURPLE_PALE}`, padding: "10px 12px" }}>
              <Text style={{ fontSize: 6.5, color: T_LIGHT, letterSpacing: 1.5, marginBottom: 6 }}>NOS DIJISTE</Text>
              <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: PURPLE, lineHeight: 1.3 }}>{narrative.cruce.nos_dijiste}</Text>
            </View>
            <View style={{ width: 30, alignItems: "center", justifyContent: "center" }}>
              <Arrow />
            </View>
            <View style={{ flex: 1, backgroundColor: PURPLE, borderRadius: 5, padding: "10px 12px" }}>
              <Text style={{ fontSize: 6.5, color: RED, letterSpacing: 1.5, marginBottom: 6 }}>LO QUE MEDIMOS</Text>
              {cruceRows.map((row) => (
                <View key={row.pregunta} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Text style={{ width: 34, fontSize: 18, fontFamily: "Helvetica-Bold", color: band(row.value).color }}>{row.value}</Text>
                  <Text style={{ flex: 1, fontSize: 8.5, color: WHITE, lineHeight: 1.4 }}>{row.texto}</Text>
                </View>
              ))}
            </View>
          </View>
          {!!narrative.cruce.nota && <Caption>{narrative.cruce.nota}</Caption>}
        </View>
      )}

      {observations.length > 0 && (
        <View wrap={false}>
          <SecLabel text="LO QUE SE VE AL ABRIR TU SITIO" />
          <View style={{ flexDirection: "row" }}>
            {observations.map((text, i) => (
              <View
                key={i}
                style={{ flex: 1, backgroundColor: WHITE, borderRadius: 5, padding: "9px 10px", marginRight: i === observations.length - 1 ? 0 : 6 }}
              >
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: RED, marginBottom: 4 }}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={{ fontSize: 8.5, color: PURPLE, lineHeight: 1.45 }}>{text}</Text>
              </View>
            ))}
          </View>
          <Caption>Son observaciones de criterio sobre la captura, no mediciones. Se pueden discutir.</Caption>
        </View>
      )}
    </ContentPage>
  );
}

// ── Oportunidades ──────────────────────────────────────────────────────────────

function EffortChip({ esfuerzo }: { esfuerzo: Oportunidad["esfuerzo"] }) {
  const diy = esfuerzo === "Lo puedes hacer tú";
  const color = diy ? GREEN : PURPLE;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: diy ? GREEN_TINT : LAVENDER, borderRadius: 3, padding: "3px 7px", marginTop: 8 }}>
      {/* Los íconos van en SVG: ✓ y ⚙ no existen en Helvetica. */}
      <Svg width={8} height={8} viewBox="0 0 10 10">
        {diy ? (
          <Path d="M1.5 5.2 L4 7.7 L8.5 2.5" stroke={color} strokeWidth={1.8} fill="none" />
        ) : (
          <>
            <Circle cx={5} cy={5} r={3.4} stroke={color} strokeWidth={1.7} strokeDasharray="1.3 1.1" fill="none" />
            <Circle cx={5} cy={5} r={1.3} fill={color} />
          </>
        )}
      </Svg>
      <Text style={{ fontSize: 7.2, fontFamily: "Helvetica-Bold", color, marginLeft: 4 }}>{esfuerzo}</Text>
    </View>
  );
}

function OpportunityColumn({ label, text, last }: { label: string; text: string; last?: boolean }) {
  return (
    <View style={{ flex: 1, marginRight: last ? 0 : 12 }}>
      <Text style={{ fontSize: 6.2, color: RED, letterSpacing: 1.2, marginBottom: 3 }}>{label}</Text>
      <Text style={{ fontSize: 8, color: PURPLE, lineHeight: 1.45 }}>{text}</Text>
    </View>
  );
}

function OpportunitiesPage({ narrative, name }: { narrative: ReportNarrative; name: string }) {
  const opportunities = narrative.oportunidades;
  const altas = opportunities.filter((o) => o.prioridad === "Alta").length;
  const medias = opportunities.length - altas;
  const total = opportunities.length;

  const counts = [altas && `${altas} de prioridad alta`, medias && `${medias} de prioridad media`].filter(Boolean).join(" · ");
  const objective = narrative.objetivo_corto ? `tu objetivo: ${narrative.objetivo_corto.replace(/[.\s]+$/, "")}` : "tu objetivo";

  return (
    <ContentPage name={name}>
      <SecLabel text="LO QUE TE RECOMENDAMOS HACER" mt={0} />
      <Text style={{ fontSize: 9.5, color: T_MID, lineHeight: 1.55, marginBottom: 10 }}>
        Agrupamos lo que encontramos en {total === 1 ? "una oportunidad" : `${NUMBER_WORDS[total] ?? total} oportunidades`},
        ordenadas por lo que más impacta {objective}.{" "}
        <Text style={{ fontFamily: "Helvetica-Bold", color: PURPLE }}>{counts}.</Text>
      </Text>

      {opportunities.map((o, i) => (
        <View key={i} style={{ backgroundColor: WHITE, borderRadius: 6, padding: "11px 13px", marginBottom: 8 }} wrap={false}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: WHITE }}>{i + 1}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 12, fontFamily: "Helvetica-Bold", color: PURPLE }}>{o.titulo}</Text>
            <View style={{ backgroundColor: o.prioridad === "Alta" ? RED : AMBER, borderRadius: 8, padding: "2px 8px", marginLeft: 8 }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: WHITE }}>{o.prioridad}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <OpportunityColumn label="LO MEDIDO" text={o.lo_medido} />
            <OpportunityColumn label="QUÉ SIGNIFICA PARA TU NEGOCIO" text={o.que_significa} />
            <OpportunityColumn label="QUÉ HACER" text={o.que_hacer} last />
          </View>
          <EffortChip esfuerzo={o.esfuerzo} />
        </View>
      ))}
    </ContentPage>
  );
}

// ── Revisión punto por punto ───────────────────────────────────────────────────

function GroupHeader({ title, count, bg, color }: { title: string; count: number; bg: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: bg, borderRadius: 3, padding: "6px 9px", marginBottom: 2 }}>
      <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color }}>{title}</Text>
      <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold", color }}>{count}</Text>
    </View>
  );
}

function CheckLine({ check, dot }: { check: Check; dot: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 5, borderBottom: `1px solid ${CREAM_D}` }} wrap={false}>
      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: dot, marginTop: 3, marginRight: 7 }} />
      <Text style={{ flex: 1, fontSize: 7.8, color: PURPLE, lineHeight: 1.4 }}>{check.plain}</Text>
      {!!check.badge && (
        <Text style={{ maxWidth: 78, fontSize: 6.3, color: T_LIGHT, textAlign: "right", marginLeft: 6, marginTop: 1 }}>{check.badge}</Text>
      )}
    </View>
  );
}

/**
 * La revisión va en su propia página: compartiendo página se partía el
 * contenedor de dos columnas por la mitad y el corte se veía roto. Las
 * columnas llevan `flex: 1` dentro de la fila, que reparte el ancho; dentro
 * de un contenedor en columna ese mismo `flex: 1` las colapsaría.
 */
function ChecksPage({ audit, name }: { audit: SiteAudit; name: string }) {
  const checks = allChecks(audit);
  const failed = checks.filter((c) => c.passed === false);
  const passed = checks.filter((c) => c.passed === true);
  const unknown = checks.filter((c) => c.passed === null);

  return (
    <ContentPage name={name}>
      <SecLabel text="REVISIÓN PUNTO POR PUNTO" mt={0} />
      <Text style={{ fontSize: 9.5, color: T_MID, lineHeight: 1.5, marginBottom: 12 }}>
        Las {checks.length} verificaciones que le hicimos a tu sitio, en lenguaje claro. De aquí salen tus calificaciones.
      </Text>

      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <GroupHeader title="Lo que te está frenando" count={failed.length} bg={RED_TINT} color={RED} />
          {failed.map((c) => (
            <CheckLine key={c.id} check={c} dot={RED} />
          ))}
          {unknown.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <GroupHeader title="Lo que no pudimos medir" count={unknown.length} bg={CREAM_D} color={T_LIGHT} />
              {unknown.map((c) => (
                <CheckLine key={c.id} check={c} dot={PURPLE_PALE} />
              ))}
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <GroupHeader title="Lo que ya haces bien" count={passed.length} bg={GREEN_TINT} color={GREEN} />
          {passed.map((c) => (
            <CheckLine key={c.id} check={c} dot={GREEN} />
          ))}
        </View>
      </View>

      <Caption mt={10}>
        Lo que no se pudo medir no cuenta ni a favor ni en contra: la calificación se calcula solo sobre lo medido.
      </Caption>
    </ContentPage>
  );
}

// ── Plan y cierre ──────────────────────────────────────────────────────────────

function PillLink({ href, label, bg, color, outline }: { href: string; label: string; bg?: string; color: string; outline?: boolean }) {
  return (
    <Link src={href} style={{ textDecoration: "none", marginRight: 6 }}>
      <View style={{ backgroundColor: bg, borderRadius: 11, padding: "5px 12px", borderWidth: outline ? 1 : 0, borderColor: "#b9b0cc" }}>
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color }}>{label}</Text>
      </View>
    </Link>
  );
}

function PlanPage({ narrative, audit, name, site }: { narrative: ReportNarrative; audit: SiteAudit; name: string; site: string }) {
  const phases = [
    { title: "Esta semana", items: narrative.plan_accion.esta_semana },
    { title: "Este mes", items: narrative.plan_accion.este_mes },
    { title: "Próximos 3 meses", items: narrative.plan_accion.proximos_3_meses },
  ].filter((phase) => phase.items.length > 0);
  const measuredSpeed = audit.pagespeed.status === "ok";

  return (
    <ContentPage name={name}>
      {phases.length > 0 && (
        <>
          <SecLabel text="TU PLAN DE ACCIÓN" mt={0} />
          <View style={{ flexDirection: "row", marginBottom: 14 }} wrap={false}>
            {phases.map((phase, i) => (
              <View
                key={phase.title}
                style={{ flex: 1, backgroundColor: WHITE, borderRadius: 5, borderTop: `3px solid ${RED}`, padding: "9px 10px", marginRight: i === phases.length - 1 ? 0 : 7 }}
              >
                <Text style={{ fontSize: 17, fontFamily: "Helvetica-Bold", color: RED }}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={{ fontSize: 10.5, fontFamily: "Helvetica-Bold", color: PURPLE, marginBottom: 6 }}>{phase.title}</Text>
                {phase.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={{ fontSize: 8, color: PURPLE, marginRight: 4 }}>•</Text>
                    <Text style={{ flex: 1, fontSize: 8, color: PURPLE, lineHeight: 1.4 }}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ backgroundColor: RED, borderRadius: 6, padding: "14px 16px" }} wrap={false}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <EmberLogo size={18} />
          <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: WHITE, marginLeft: 8 }}>Cómo te ayuda Ember Lab</Text>
        </View>
        {!!narrative.cierre_ember_lab && (
          <Text style={{ fontSize: 9.5, color: WHITE, lineHeight: 1.6, marginBottom: 12 }}>{narrative.cierre_ember_lab}</Text>
        )}
        <View style={{ backgroundColor: PURPLE, borderRadius: 5, padding: "11px 13px" }}>
          <Text style={{ fontSize: 11.5, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 8 }}>
            Revisemos tu diagnóstico juntos en una llamada de 20 minutos.
          </Text>
          <View style={{ flexDirection: "row" }}>
            <PillLink href={whatsappUrl("Hola, recibí mi diagnóstico digital de Ember Lab.")} label="WhatsApp" bg={WHATSAPP} color={WHITE} />
            <PillLink
              href={whatsappUrl("Hola, quiero agendar la llamada de 20 minutos para revisar mi diagnóstico.")}
              label="Agendar llamada"
              bg={WHITE}
              color={PURPLE}
            />
            <PillLink
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Mi diagnóstico digital")}`}
              label={CONTACT_EMAIL}
              color={WHITE}
              outline
            />
          </View>
        </View>
      </View>

      <SecLabel text="CÓMO HICIMOS ESTE DIAGNÓSTICO" />
      <Text style={{ fontSize: 7.5, color: T_MID, lineHeight: 1.6 }}>
        Revisamos el código de {site}
        {measuredSpeed
          ? " y medimos su carga con PageSpeed Insights de Google, que abre la página en un Chrome real simulando un celular con red lenta"
          : ""}
        . Las calificaciones se calculan con una rúbrica fija sobre lo encontrado; no las decide un modelo de lenguaje. Lo que no se
        pudo medir aparece marcado como tal.
        {measuredSpeed
          ? " Las mediciones de laboratorio pueden variar entre corridas y suelen ser más severas que lo que viven tus visitantes reales."
          : ""}
      </Text>
    </ContentPage>
  );
}

// ── Documento ──────────────────────────────────────────────────────────────────

export function ReportPDF({
  narrative: rawNarrative,
  audit,
  questionnaire,
  date,
}: {
  narrative: ReportNarrative;
  audit: SiteAudit;
  questionnaire: Questionnaire;
  date: string;
}) {
  const narrative = pdfSafe(rawNarrative);
  const name = pdfText(questionnaire.nombre || "Cliente");
  const site = pdfText(audit.page.status === "ok" ? audit.page.value.finalUrl : questionnaire.sitio ?? audit.requestedUrl);
  const giro = narrative.giro_corto || "";
  const shot = audit.pagespeed.status === "ok" ? audit.pagespeed.value.screenshots.final : null;

  return (
    <Document title={`Diagnóstico digital · ${name}`} author="Ember Lab">
      <Cover name={name} giro={giro} site={site} date={date} shot={shot} />
      <ThreeQuestionsPage narrative={narrative} audit={audit} name={name} shot={shot} />
      <SummaryPage narrative={narrative} audit={audit} name={name} hasShot={!!shot} />
      <OpportunitiesPage narrative={narrative} name={name} />
      <ChecksPage audit={audit} name={name} />
      <PlanPage narrative={narrative} audit={audit} name={name} site={site} />
    </Document>
  );
}

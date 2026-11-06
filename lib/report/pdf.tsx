/* eslint-disable jsx-a11y/alt-text --
   `Image` aquí es el de @react-pdf/renderer, que pinta dentro de un PDF y no
   acepta `alt`. La regla lo confunde con el <img> del DOM. */
import path from "node:path";
import React from "react";
import { Document, Font, G, Image, Link, Page, Path, Rect, Svg, Text, View } from "@react-pdf/renderer";

import type { Score, SiteAudit } from "@/lib/audit/types";
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/contact";
import { PREGUNTA_TITULO, PREGUNTAS, allChecks, scoreBand, scoreFor, type Mejora, type ReportNarrative } from "./prompt";
import type { Questionnaire } from "./questionnaire";
import { EMBER_PATHS, EMBER_WIDTH, LAB_PATHS, LAB_WIDTH } from "./wordmark";

/**
 * Diagnóstico Digital v2: dos páginas. La 1 dice cómo está el sitio (captura,
 * síntesis y las tres calificaciones); la 2, las 3 mejoras y la invitación a
 * la reunión. Los textos variables los escribe el modelo (`prompt.ts`); el
 * resto del copy es fijo y vive aquí.
 */

// ── Tipografía ────────────────────────────────────────────────────────────────

// Los archivos van en el repo (subconjunto latino de Google Fonts) para no
// depender de la red al generar. `next.config.ts` los incluye en la función.
const FONT_DIR = path.join(process.cwd(), "lib/report/fonts");
Font.register({
  family: "Poppins",
  fonts: [
    { src: path.join(FONT_DIR, "Poppins-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "Poppins-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONT_DIR, "Poppins-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONT_DIR, "Poppins-Bold.ttf"), fontWeight: 700 },
  ],
});

// react-pdf parte palabras con guion por default ("con-tactarte"). En un
// reporte para leer de corrido eso estorba más de lo que ayuda.
Font.registerHyphenationCallback((word) => [word]);

// ── Línea gráfica ─────────────────────────────────────────────────────────────
// Sin rojo ni rosa: la paleta del diagnóstico es morado, lila, verde y crema.
const DEEP = "#301F4B"; // morado profundo
const MID = "#6D59A1"; // morado medio
const ACCENT = "#6453AD"; // morado acento
const LILAC = "#CAA4CC";
const GREEN = "#C7DDA3";
const CREAM = "#EDEAE7";

const CREAM_SOFT = "rgba(237,234,231,0.72)"; // texto secundario sobre morado
const CREAM_FAINT = "rgba(237,234,231,0.5)";
const LINE_DARK = "#524467"; // líneas finas sobre morado (crema al 18 %)
const LINE_LIGHT = "#CFCACE"; // líneas finas sobre crema (morado al 16 %)
// Hex y no rgba: react-pdf pinta mal los bordes con transparencia.
const PHONE = "#1E1330";

const PAD_X = 40;

// ── Texto seguro para el PDF ──────────────────────────────────────────────────

/**
 * Poppins viene en su subconjunto latino: Latin-1 más comillas tipográficas,
 * guiones, viñetas y "·". Cualquier otro carácter —una flecha, un emoji que se
 * le escape al modelo— saldría como un hueco, así que se quita antes de pintar.
 */
const EXTRA = "‘’“”•–—…·€";

function pdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7e\xa0-\xff\n]/gu, (ch) => (EXTRA.includes(ch) ? ch : ""))
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

// ── Piezas ────────────────────────────────────────────────────────────────────

function EmberIcon({ size, fill }: { size: number; fill: string }) {
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

/** "EMBER" en crema y "LAB" en lila, a 40 mm de ancho. */
function Wordmark() {
  const gap = 12;
  const total = EMBER_WIDTH + gap + LAB_WIDTH;
  const width = 113; // 40 mm
  return (
    <Svg viewBox={`0 0 ${total} 43`} width={width} height={(width * 43) / total}>
      {EMBER_PATHS.map((d) => (
        <Path key={d.slice(0, 24)} d={d} fill={CREAM} />
      ))}
      <G transform={`translate(${EMBER_WIDTH + gap} 0)`}>
        {LAB_PATHS.map((d) => (
          <Path key={d.slice(0, 24)} d={d} fill={LILAC} />
        ))}
      </G>
    </Svg>
  );
}

function Arrow({ color }: { color: string }) {
  return (
    <Svg width={8} height={6} viewBox="0 0 16 12" style={{ marginRight: 4 }}>
      <Path d="M0 6H14M9 1L14 6L9 11" stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

/** Etiqueta en versalitas espaciadas: "01 · CÓMO ESTÁ TU SITIO HOY". */
function Label({ text, color, mb = 8 }: { text: string; color: string; mb?: number }) {
  return (
    <Text style={{ fontSize: 6, fontWeight: 600, letterSpacing: 2, color, marginBottom: mb }}>{text.toUpperCase()}</Text>
  );
}

function Rule({ color, mv = 0 }: { color: string; mv?: number }) {
  return <View style={{ height: 0.75, backgroundColor: color, marginVertical: mv }} />;
}

function Header({ icon, title, subtitle, subColor }: { icon: string; title: string; subtitle: string; subColor: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
      <EmberIcon size={24} fill={icon} />
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 1.8, color: title }}>DIAGNÓSTICO DIGITAL POR EMBER LAB</Text>
        {!!subtitle && <Text style={{ fontSize: 7.5, color: subColor, marginTop: 2 }}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function Footer({ left, page, color }: { left: string; page: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
      <Text style={{ fontSize: 6.5, color, maxWidth: 420 }}>{left}</Text>
      <Text style={{ fontSize: 6.5, color }}>{page}</Text>
    </View>
  );
}

// ── Página 1 · Cómo está tu sitio hoy ─────────────────────────────────────────

/** Marco de teléfono con la captura del sitio en celular. */
function PhoneFrame({ shot, site }: { shot: string | null; site: string }) {
  const width = 222;
  const height = 452;
  const bezel = 9;
  return (
    <View style={{ width, height, backgroundColor: PHONE, borderRadius: 26, padding: bezel, border: `1pt solid ${LINE_DARK}` }}>
      <View style={{ flex: 1, borderRadius: 18, overflow: "hidden", backgroundColor: LILAC }}>
        {shot ? (
          <Image src={shot} style={{ width: width - bezel * 2, height: height - bezel * 2, objectFit: "cover", objectPosition: "top" }} />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 18 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: DEEP, textAlign: "center" }}>{site}</Text>
          </View>
        )}
      </View>
      {/* La "isla" del teléfono, encima de la pantalla. */}
      <Svg width={width} height={20} style={{ position: "absolute", top: bezel + 5, left: 0 }}>
        <Rect x={width / 2 - 24} y={0} width={48} height={9} rx={4.5} fill={PHONE} />
      </Svg>
    </View>
  );
}

function ScoreBlock({ title, score, verdict, last }: { title: string; score: Score; verdict: string; last?: boolean }) {
  const measured = score.status === "ok";
  return (
    <View style={{ paddingVertical: 11, borderBottom: last ? undefined : `0.75pt solid ${LINE_DARK}` }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <View>
          <Text style={{ fontSize: 12, fontWeight: 700, color: CREAM }}>{title}</Text>
          <Text style={{ fontSize: 6, fontWeight: 600, color: GREEN, marginTop: 1 }}>
            {measured ? scoreBand(score.value).label : "No se pudo medir"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 30, fontWeight: 700, color: GREEN, lineHeight: 1 }}>{measured ? score.value : "—"}</Text>
          <Text style={{ fontSize: 7, color: CREAM_FAINT, marginLeft: 2, marginBottom: 3 }}>/100</Text>
        </View>
      </View>
      {!!verdict && <Text style={{ fontSize: 8, color: CREAM, lineHeight: 1.55, marginTop: 6 }}>{verdict}</Text>}
    </View>
  );
}

function StatusPage({
  narrative,
  audit,
  firstName,
  domain,
  date,
  shot,
}: {
  narrative: ReportNarrative;
  audit: SiteAudit;
  firstName: string;
  domain: string;
  date: string;
  shot: string | null;
}) {
  return (
    <Page size="A4" style={{ backgroundColor: DEEP, fontFamily: "Poppins", color: CREAM, padding: `34px ${PAD_X}px 26px` }}>
      <Header icon={LILAC} title={CREAM} subtitle={[domain, date].filter(Boolean).join(" · ")} subColor={CREAM_SOFT} />

      <Label text="01 · Cómo está tu sitio hoy" color={GREEN} />
      <Text style={{ fontSize: 26, fontWeight: 700, color: CREAM, lineHeight: 1.15 }}>
        {firstName ? `${firstName}, así se ve tu sitio` : "Así se ve tu sitio"}
      </Text>
      <Text style={{ fontSize: 26, fontWeight: 700, color: LILAC, lineHeight: 1.15, marginBottom: 26 }}>para quien te busca.</Text>

      <View style={{ flexDirection: "row", flex: 1 }}>
        <PhoneFrame shot={shot} site={domain} />

        <View style={{ flex: 1, marginLeft: 28, paddingTop: 22 }}>
          <Label text="En pocas palabras" color={GREEN} mb={4} />
          <Text style={{ fontSize: 17, fontWeight: 700, color: CREAM, lineHeight: 1.2 }}>{narrative.frase_sintesis.parte_1}</Text>
          <Text style={{ fontSize: 17, fontWeight: 700, color: LILAC, lineHeight: 1.2, marginBottom: 10 }}>
            {narrative.frase_sintesis.parte_2}
          </Text>
          <Rule color={LINE_DARK} />

          {PREGUNTAS.map((p, i) => (
            <ScoreBlock
              key={p}
              title={PREGUNTA_TITULO[p]}
              score={scoreFor(audit, p)}
              verdict={narrative.veredictos[p]}
              last={i === PREGUNTAS.length - 1}
            />
          ))}
        </View>
      </View>

      <Rule color={LINE_DARK} mv={14} />
      <Label text="Lo que ya haces bien" color={GREEN} mb={5} />
      <Text style={{ fontSize: 8.5, color: CREAM, lineHeight: 1.55, marginBottom: 18 }}>{narrative.lo_que_haces_bien}</Text>

      <Footer left="Ember Lab · creatividad estratégica" page="1 / 2" color={CREAM_FAINT} />
    </Page>
  );
}

// ── Página 2 · 3 mejoras y reunión ────────────────────────────────────────────

function MejoraRow({ n, mejora }: { n: number; mejora: Mejora }) {
  const column = (label: string, text: string) => (
    <View style={{ flex: 1, paddingRight: 16 }}>
      <Label text={label} color={ACCENT} mb={3} />
      <Text style={{ fontSize: 8.5, color: DEEP, lineHeight: 1.5 }}>{text}</Text>
    </View>
  );
  return (
    <View wrap={false} style={{ flexDirection: "row", paddingVertical: 12, borderTop: `0.75pt solid ${LINE_LIGHT}` }}>
      <Text style={{ width: 56, fontSize: 24, fontWeight: 700, color: DEEP, lineHeight: 1 }}>{String(n).padStart(2, "0")}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, fontWeight: 700, color: DEEP, marginBottom: 8 }}>{mejora.titulo}</Text>
        <View style={{ flexDirection: "row" }}>
          {column("Lo que vimos", mejora.lo_que_vimos)}
          {column("Lo que significa para ti", mejora.que_significa)}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
          <Arrow color={ACCENT} />
          <Text style={{ fontSize: 6.5, fontWeight: 600, color: ACCENT }}>{mejora.esfuerzo}</Text>
        </View>
      </View>
    </View>
  );
}

function ImprovementsPage({ narrative, name, giro, method }: { narrative: ReportNarrative; name: string; giro: string; method: string }) {
  return (
    <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Poppins", color: DEEP }}>
      <View style={{ flex: 1, padding: `34px ${PAD_X}px 6px` }}>
        <Header icon={MID} title={DEEP} subtitle={[name, giro].filter(Boolean).join(" · ")} subColor={MID} />

        <Label text="02 · 3 mejoras que alcanzamos a ver" color={ACCENT} />
        <Text style={{ fontSize: 26, fontWeight: 700, color: DEEP, lineHeight: 1.15 }}>Lo que haríamos</Text>
        <Text style={{ fontSize: 26, fontWeight: 700, color: MID, lineHeight: 1.15, marginBottom: 16 }}>primero en tu sitio.</Text>

        {narrative.mejoras.map((m, i) => (
          <MejoraRow key={i} n={i + 1} mejora={m} />
        ))}
      </View>

      {/* Franja de cierre, a todo lo ancho. */}
      <View style={{ backgroundColor: DEEP, padding: `24px ${PAD_X}px 26px` }}>
        <Label text="03 · Agendemos una reunión" color={LILAC} />
        <Text style={{ fontSize: 22, fontWeight: 700, color: CREAM, lineHeight: 1.15 }}>Revisemos tu diagnóstico,</Text>
        <Text style={{ fontSize: 22, fontWeight: 700, color: GREEN, lineHeight: 1.15, marginBottom: 10 }}>sin costo.</Text>
        <Text style={{ fontSize: 8.5, color: CREAM_SOFT, lineHeight: 1.55, marginBottom: 18 }}>
          En una llamada de 20 minutos te explicamos cada hallazgo, resolvemos tus dudas y te decimos por dónde empezaríamos en
          tu caso para que tu sitio convierta visitas en conversaciones.
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Link src={WHATSAPP_URL} style={{ textDecoration: "none" }}>
              <View style={{ backgroundColor: LILAC, borderRadius: 14, paddingVertical: 7, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 8, fontWeight: 600, color: DEEP }}>WhatsApp +52 442 676 2707</Text>
              </View>
            </Link>
            <Link src={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: "none", marginLeft: 18 }}>
              <Text style={{ fontSize: 8, fontWeight: 600, color: CREAM }}>{CONTACT_EMAIL}</Text>
            </Link>
          </View>
          <Wordmark />
        </View>

        <Footer left={method} page="2 / 2" color={CREAM_FAINT} />
      </View>
    </Page>
  );
}

// ── Documento ─────────────────────────────────────────────────────────────────

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

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
  const name = pdfText(questionnaire.nombre || "");
  const firstName = name.split(/\s+/)[0] ?? "";
  const domain = pdfText(hostOf(audit.page.status === "ok" ? audit.page.value.finalUrl : (questionnaire.sitio ?? audit.requestedUrl)));
  const psi = audit.pagespeed.status === "ok" ? audit.pagespeed.value : null;
  const shot = psi?.screenshots.final ?? null;

  const checks = allChecks(audit).filter((c) => c.passed !== null).length;
  const method = psi
    ? `Medimos tu sitio con ${checks} verificaciones y una prueba de carga en celular con red lenta.`
    : `Medimos tu sitio con ${checks} verificaciones.`;

  return (
    <Document title={`Diagnóstico digital · ${name || domain}`} author="Ember Lab">
      <StatusPage narrative={narrative} audit={audit} firstName={firstName} domain={domain} date={date} shot={shot} />
      <ImprovementsPage narrative={narrative} name={name || domain} giro={narrative.giro_corto} method={method} />
    </Document>
  );
}

import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  Document,
  Page,
  View,
  Text,
  renderToBuffer,
  Svg,
  Path,
  Rect,
} from "@react-pdf/renderer";
import React from "react";

type Message = { role: "user" | "assistant"; content: string };

type Opportunity = {
  title: string;
  description: string;
  impact: string;
  priority: "Alta" | "Media" | "Baja";
};

type ActionPhase = {
  label: string;
  description: string;
  actions: string[];
};

type ReportData = {
  clientName: string;
  company: string;
  website: string;
  email: string;
  objective: string;
  targetAudience: string;
  mainChallenge: string;
  marketingActions: string;
  executiveSummary: string;
  workingWell: string[];
  opportunities: Opportunity[];
  actionPlan: { phase1: ActionPhase; phase2: ActionPhase; phase3: ActionPhase };
  emberLabHelp: string;
  scores: {
    comunicacion: number;
    conversion: number;
    experienciaUsuario: number;
    posicionamiento: number;
  };
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
const PHASE_COLORS = [PURPLE_MID, PURPLE_L, RED];

const pColor = (p: string) => p === "Alta" ? RED : p === "Media" ? "#f59e0b" : "#22c55e";
const sColor = (s: number) => s >= 70 ? "#22c55e" : s >= 45 ? "#f59e0b" : RED;

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

function ScoreBar({ label, score, barW = 215 }: { label: string; score: number; barW?: number }) {
  const n = Math.min(Math.max(Math.round(score), 0), 100);
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

function PageStrip({ name, page, total }: { name: string; page: number; total: number }) {
  return (
    <View style={{ backgroundColor: PURPLE, padding: "12px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontSize: 8, color: "rgba(237,234,231,0.45)", fontFamily: "Helvetica" }}>Diagnóstico · {name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <EmberLogo size={13} />
        <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: RED, marginLeft: 6 }}>Ember Lab</Text>
        <Text style={{ fontSize: 8, color: "rgba(237,234,231,0.25)", marginLeft: 10, fontFamily: "Helvetica" }}>{page}/{total}</Text>
      </View>
    </View>
  );
}

function FooterStrip() {
  return (
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: PURPLE, padding: "10px 40px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontSize: 7, color: "rgba(237,234,231,0.35)", fontFamily: "Helvetica" }}>Reporte confidencial · Ember Lab</Text>
      <Text style={{ fontSize: 7, color: RED, fontFamily: "Helvetica-Bold" }}>hola@emberlab.mx</Text>
    </View>
  );
}

// ── PDF Document ───────────────────────────────────────────────────────────────

function ReportPDF({ data, date }: { data: ReportData; date: string }) {
  const phases = [data.actionPlan.phase1, data.actionPlan.phase2, data.actionPlan.phase3];
  const scores = data.scores ?? { comunicacion: 50, conversion: 50, experienciaUsuario: 50, posicionamiento: 50 };

  // Group opportunities into pairs for 2-column layout
  const oppPairs: [Opportunity, Opportunity | null][] = [];
  for (let i = 0; i < data.opportunities.length; i += 2) {
    oppPairs.push([data.opportunities[i], data.opportunities[i + 1] ?? null]);
  }

  const alta = data.opportunities.filter(o => o.priority === "Alta").length;
  const media = data.opportunities.filter(o => o.priority === "Media").length;
  const baja = data.opportunities.filter(o => o.priority === "Baja").length;

  return (
    <Document title={`Diagnóstico EmberLab — ${data.clientName}`} author="Ember Lab">

      {/* ═══════════════════════════════════════
          PÁGINA 1 · PORTADA
      ═══════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: RED, fontFamily: "Helvetica" }}>
        <View style={{ flex: 1, padding: "50px 50px 50px 50px", justifyContent: "space-between" }}>

          {/* Brand row */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <EmberLogo size={22} />
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.6)", letterSpacing: 3, marginLeft: 10 }}>EMBER LAB</Text>
          </View>

          {/* Hero title */}
          <View>
            <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: 4, marginBottom: 18, fontFamily: "Helvetica" }}>AUDITORÍA ESTRATÉGICA DE SITIO WEB</Text>
            <Text style={{ fontSize: 56, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.0 }}>DIAGNÓS</Text>
            <Text style={{ fontSize: 56, fontFamily: "Helvetica-Bold", color: WHITE, lineHeight: 1.0 }}>TICO</Text>
            <Text style={{ fontSize: 56, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.18)", lineHeight: 1.0 }}>DIGITAL</Text>
          </View>

          {/* Client card */}
          <View>
            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 22 }} />
            <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: 3, marginBottom: 8, fontFamily: "Helvetica" }}>PREPARADO PARA</Text>
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

      {/* ═══════════════════════════════════════
          PÁGINA 2 · ANÁLISIS
      ═══════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 40 }}>
        <PageStrip name={data.clientName} page={2} total={3} />

        <View style={{ padding: "20px 40px 0 40px" }}>

          {/* Executive summary */}
          <SecLabel text="RESUMEN EJECUTIVO" mt={0} />
          <Text style={{ fontSize: 9.5, color: PURPLE, lineHeight: 1.75, marginBottom: 18, fontFamily: "Helvetica" }}>
            {data.executiveSummary}
          </Text>

          {/* Two columns: score bars | working well */}
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 14 }}>
              <SecLabel text="MÉTRICAS DE DIAGNÓSTICO" mt={0} />
              <ScoreBar label="Comunicación y mensaje" score={scores.comunicacion} barW={215} />
              <ScoreBar label="Conversión y llamadas a la acción" score={scores.conversion} barW={215} />
              <ScoreBar label="Experiencia de usuario" score={scores.experienciaUsuario} barW={215} />
              <ScoreBar label="Posicionamiento digital" score={scores.posicionamiento} barW={215} />
              <Text style={{ fontSize: 6.5, color: T_LIGHT, marginTop: 4, fontFamily: "Helvetica" }}>
                Puntuación estimada 0–100 basada en la información compartida.
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <SecLabel text="LO QUE ESTÁ FUNCIONANDO" mt={0} />
              {data.workingWell.slice(0, 4).map((item, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 9 }}>
                  <View style={{ width: 15, height: 15, backgroundColor: "#22c55e", borderRadius: 3, alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: 1 }}>
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: WHITE }}>✓</Text>
                  </View>
                  <Text style={{ fontSize: 9, color: PURPLE, lineHeight: 1.5, flex: 1, fontFamily: "Helvetica" }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Opportunities */}
          <SecLabel text="OPORTUNIDADES DE MEJORA" />

          {/* Priority legend */}
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {alta > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", marginRight: 14 }}>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: RED, marginRight: 4 }} />
                <Text style={{ fontSize: 7, color: T_MID, fontFamily: "Helvetica" }}>{alta} Alta prioridad</Text>
              </View>
            )}
            {media > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", marginRight: 14 }}>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#f59e0b", marginRight: 4 }} />
                <Text style={{ fontSize: 7, color: T_MID, fontFamily: "Helvetica" }}>{media} Media prioridad</Text>
              </View>
            )}
            {baja > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#22c55e", marginRight: 4 }} />
                <Text style={{ fontSize: 7, color: T_MID, fontFamily: "Helvetica" }}>{baja} Baja prioridad</Text>
              </View>
            )}
          </View>

          {/* Opportunity cards — 2 per row */}
          {oppPairs.map(([a, b], rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: "row", marginBottom: 7 }}>
              {([a, b] as (Opportunity | null)[]).map((opp, ci) =>
                opp ? (
                  <View key={ci} style={{ flex: 1, marginLeft: ci === 1 ? 7 : 0, backgroundColor: WHITE, borderRadius: 6, padding: "9px 11px", borderLeft: `3px solid ${pColor(opp.priority)}` }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                      <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: PURPLE, flex: 1, marginRight: 6 }}>{opp.title}</Text>
                      <View style={{ backgroundColor: pColor(opp.priority), borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, flexShrink: 0 }}>
                        <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold", color: WHITE }}>{opp.priority}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 8, color: T_MID, lineHeight: 1.45, marginBottom: 4, fontFamily: "Helvetica" }}>{opp.description}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: T_LIGHT, marginRight: 3 }}>Impacto:</Text>
                      <Text style={{ fontSize: 7, color: T_MID, flex: 1, lineHeight: 1.4, fontFamily: "Helvetica" }}>{opp.impact}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={ci} style={{ flex: 1, marginLeft: ci === 1 ? 7 : 0 }} />
                )
              )}
            </View>
          ))}
        </View>

        <FooterStrip />
      </Page>

      {/* ═══════════════════════════════════════
          PÁGINA 3 · ROADMAP & EMBER LAB
      ═══════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: CREAM, fontFamily: "Helvetica", paddingBottom: 40 }}>
        <PageStrip name={data.clientName} page={3} total={3} />

        <View style={{ padding: "20px 40px 0 40px" }}>
          <SecLabel text="PLAN DE ACCIÓN RECOMENDADO" mt={0} />

          {phases.map((phase, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 10, alignItems: "flex-start" }}>
              {/* Phase number */}
              <View style={{ width: 36, alignItems: "center", paddingTop: 2 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: PHASE_COLORS[i], alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: WHITE }}>{i + 1}</Text>
                </View>
              </View>
              {/* Phase card */}
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

          {/* Ember Lab help */}
          <SecLabel text="CÓMO PUEDE AYUDARTE EMBER LAB" />
          <View style={{ backgroundColor: PURPLE, borderRadius: 8, padding: "16px 20px", borderLeft: `4px solid ${RED}` }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <EmberLogo size={18} />
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: WHITE, marginLeft: 8 }}>Ember Lab</Text>
            </View>
            <Text style={{ fontSize: 9.5, color: "rgba(237,234,231,0.85)", lineHeight: 1.7, fontFamily: "Helvetica" }}>{data.emberLabHelp}</Text>
          </View>

          {/* CTA strip */}
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

// ── API handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY no configurada", { status: 503 });
  }

  const { messages }: { messages: Message[] } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const extraction = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `Eres un consultor senior de Ember Lab. Analiza esta conversación de auditoría web y extrae el diagnóstico en el siguiente JSON exacto. Responde SOLO con el JSON.

{
  "clientName": "nombre del cliente (usa 'Cliente' si no se mencionó)",
  "company": "descripción breve de la empresa",
  "website": "URL del sitio o 'Sin sitio web'",
  "email": "correo si fue mencionado, o vacío",
  "objective": "objetivo principal del sitio",
  "targetAudience": "cliente ideal descrito",
  "mainChallenge": "principal reto identificado",
  "marketingActions": "acciones de marketing actuales",
  "executiveSummary": "resumen ejecutivo de máximo 80 palabras. Evalúa comunicación, conversión, experiencia de usuario y posicionamiento. Tono consultivo directo, sin exageraciones.",
  "workingWell": ["punto positivo 1", "punto positivo 2", "punto positivo 3"],
  "opportunities": [
    {
      "title": "título corto de la oportunidad",
      "description": "qué hacer en 1-2 oraciones",
      "impact": "qué mejora concreta en 1 oración",
      "priority": "Alta"
    }
  ],
  "actionPlan": {
    "phase1": { "label": "Fase 1 · Ajustes rápidos", "description": "Semanas 1–4", "actions": ["acción", "acción", "acción"] },
    "phase2": { "label": "Fase 2 · Optimización", "description": "Meses 1–3", "actions": ["acción", "acción"] },
    "phase3": { "label": "Fase 3 · Crecimiento", "description": "Meses 3–6", "actions": ["acción", "acción"] }
  },
  "emberLabHelp": "3-4 oraciones sobre cómo Ember Lab puede acompañar este proyecto específico. Sin lenguaje comercial agresivo. Solo menciona servicios relevantes al caso: estrategia digital, desarrollo web, identidad de marca, SEO, automatización, contenido.",
  "scores": {
    "comunicacion": <entero 0-100: claridad del mensaje y propuesta de valor>,
    "conversion": <entero 0-100: efectividad en convertir visitas en contactos o ventas>,
    "experienciaUsuario": <entero 0-100: navegación, velocidad, estructura, mobile>,
    "posicionamiento": <entero 0-100: visibilidad en Google y presencia digital general>
  }
}

REGLAS:
- Genera entre 3 y 5 oportunidades.
- priority usa exactamente: "Alta", "Media" o "Baja".
- scores son enteros honestos basados en lo descrito. No inflados.
- Nunca inventes problemas no mencionados.
- Prioriza observaciones estratégicas sobre estéticas.`,
      },
      ...messages,
    ],
  });

  let reportData: ReportData;
  try {
    reportData = JSON.parse(extraction.choices[0].message.content ?? "{}") as ReportData;
  } catch {
    return new Response("Error generando el reporte", { status: 500 });
  }

  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pdfBuffer = await renderToBuffer(<ReportPDF data={reportData} date={date} />);

  const slug = reportData.clientName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-emberlab-${slug}.pdf"`,
    },
  });
}

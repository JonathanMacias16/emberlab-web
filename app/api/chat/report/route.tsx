import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
  Svg,
  Path,
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
  actionPlan: {
    phase1: ActionPhase;
    phase2: ActionPhase;
    phase3: ActionPhase;
  };
  emberLabHelp: string;
};

const RED = "#E73F40";
const PURPLE = "#301f4b";
const WHITE = "#edeae7";
const LIGHT_BG = "#f5f2ef";

const priorityColor = (p: string) => {
  if (p === "Alta") return "#E73F40";
  if (p === "Media") return "#f59e0b";
  return "#22c55e";
};

const phaseAccent = ["#4a3570", "#6d59a1", "#E73F40"];

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: WHITE, paddingBottom: 52 },
  // Header
  header: {
    backgroundColor: RED,
    padding: "30px 40px 24px 40px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: { fontSize: 8, color: "rgba(255,255,255,0.7)", letterSpacing: 2, marginBottom: 5 },
  headerTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#fff" },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 3 },
  // Client card
  clientCard: {
    backgroundColor: PURPLE,
    margin: "22px 40px 0 40px",
    borderRadius: 8,
    padding: "18px 22px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clientLeft: { flex: 1 },
  clientPrepLabel: { fontSize: 7, color: RED, letterSpacing: 2, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  clientName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: WHITE, marginBottom: 2 },
  clientDetail: { fontSize: 9, color: "rgba(237,234,231,0.65)", marginBottom: 1 },
  clientDate: { fontSize: 8, color: "rgba(237,234,231,0.4)", marginTop: 6 },
  // Body
  body: { padding: "0 40px" },
  sectionTitle: {
    fontSize: 8, fontFamily: "Helvetica-Bold", color: RED,
    letterSpacing: 2, marginBottom: 8, marginTop: 20,
    paddingBottom: 5, borderBottom: "1px solid #e73f40",
  },
  bodyText: { fontSize: 10, color: PURPLE, lineHeight: 1.65 },
  // Working well
  checkRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  checkBadge: {
    width: 18, height: 18, backgroundColor: "#22c55e",
    borderRadius: 4, alignItems: "center", justifyContent: "center",
    marginRight: 10, flexShrink: 0, marginTop: 1,
  },
  checkText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#fff" },
  checkContent: { flex: 1, fontSize: 10, color: PURPLE, lineHeight: 1.5 },
  // Opportunities
  oppCard: {
    backgroundColor: LIGHT_BG, borderRadius: 6,
    padding: "10px 12px", marginBottom: 8,
  },
  oppHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  oppTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: PURPLE, flex: 1 },
  oppPriority: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  oppPriorityText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#fff", letterSpacing: 0.5 },
  oppRow: { flexDirection: "row", marginTop: 3 },
  oppLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9080b0", marginRight: 4, width: 55 },
  oppValue: { fontSize: 9, color: "#5a4d7a", lineHeight: 1.45, flex: 1 },
  // Action plan
  phaseCard: { borderRadius: 6, padding: "12px 14px", marginBottom: 8 },
  phaseHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  phaseTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: WHITE },
  phaseDesc: { fontSize: 8, color: "rgba(237,234,231,0.6)", marginBottom: 8 },
  phaseAction: { flexDirection: "row", marginBottom: 4 },
  phaseArrow: { fontSize: 9, color: "rgba(237,234,231,0.5)", marginRight: 6 },
  phaseActionText: { fontSize: 9, color: "rgba(237,234,231,0.85)", lineHeight: 1.45, flex: 1 },
  // Ember Lab help
  helpCard: {
    backgroundColor: PURPLE, borderRadius: 6,
    padding: "14px 16px", marginTop: 0,
    borderLeft: `3px solid ${RED}`,
  },
  helpText: { fontSize: 10, color: "rgba(237,234,231,0.88)", lineHeight: 1.65 },
  // Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: PURPLE, padding: "10px 40px",
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  footerBrand: { fontSize: 8, color: RED, fontFamily: "Helvetica-Bold" },
  footerText: { fontSize: 8, color: "rgba(237,234,231,0.45)" },
  // Page 2 header
  p2Header: {
    backgroundColor: PURPLE, padding: "14px 40px",
    flexDirection: "row", justifyContent: "space-between",
  },
  p2Title: { fontSize: 9, color: "rgba(237,234,231,0.5)" },
  p2Brand: { fontSize: 9, color: RED, fontFamily: "Helvetica-Bold" },
});

function EmberLogo() {
  return (
    <Svg viewBox="0 0 118 118" width={26} height={26}>
      <Path d="M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z" fill="#fff"/>
      <Path d="M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z" fill="#fff"/>
      <Path d="M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z" fill="#fff"/>
      <Path d="M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z" fill="#fff"/>
      <Path d="M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z" fill="#fff"/>
      <Path d="M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z" fill="#fff"/>
    </Svg>
  );
}

function ReportPDF({ data, date }: { data: ReportData; date: string }) {
  return (
    <Document title={`Diagnóstico EmberLab — ${data.clientName}`} author="Ember Lab">
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>DIAGNÓSTICO DIGITAL</Text>
            <Text style={styles.headerTitle}>Ember Lab</Text>
            <Text style={styles.headerSub}>Auditoría Estratégica de Sitio Web</Text>
          </View>
          <EmberLogo />
        </View>

        {/* Client card */}
        <View style={styles.clientCard}>
          <View style={styles.clientLeft}>
            <Text style={styles.clientPrepLabel}>PREPARADO PARA</Text>
            <Text style={styles.clientName}>{data.clientName}</Text>
            {!!data.company && <Text style={styles.clientDetail}>{data.company}</Text>}
            {!!data.website && data.website !== "Sin sitio web" && (
              <Text style={styles.clientDetail}>{data.website}</Text>
            )}
            {!!data.email && <Text style={styles.clientDetail}>{data.email}</Text>}
            <Text style={styles.clientDate}>Generado el {date}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Resumen ejecutivo */}
          <Text style={styles.sectionTitle}>RESUMEN EJECUTIVO</Text>
          <Text style={styles.bodyText}>{data.executiveSummary}</Text>

          {/* Lo que está funcionando */}
          <Text style={styles.sectionTitle}>LO QUE ESTÁ FUNCIONANDO</Text>
          {data.workingWell.map((item, i) => (
            <View key={i} style={styles.checkRow}>
              <View style={styles.checkBadge}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.checkContent}>{item}</Text>
            </View>
          ))}

          {/* Oportunidades */}
          <Text style={styles.sectionTitle}>OPORTUNIDADES DE MEJORA</Text>
          {data.opportunities.map((opp, i) => (
            <View key={i} style={styles.oppCard}>
              <View style={styles.oppHeader}>
                <Text style={styles.oppTitle}>{opp.title}</Text>
                <View style={[styles.oppPriority, { backgroundColor: priorityColor(opp.priority) }]}>
                  <Text style={styles.oppPriorityText}>{opp.priority}</Text>
                </View>
              </View>
              <View style={styles.oppRow}>
                <Text style={styles.oppLabel}>Oportunidad</Text>
                <Text style={styles.oppValue}>{opp.description}</Text>
              </View>
              <View style={styles.oppRow}>
                <Text style={styles.oppLabel}>Impacto</Text>
                <Text style={styles.oppValue}>{opp.impact}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Ember Lab</Text>
          <Text style={styles.footerText}>Diagnóstico confidencial</Text>
          <Text style={styles.footerText}>1 / 2</Text>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.p2Header}>
          <Text style={styles.p2Title}>Diagnóstico para {data.clientName}</Text>
          <Text style={styles.p2Brand}>Ember Lab</Text>
        </View>

        <View style={styles.body}>
          {/* Plan de acción */}
          <Text style={styles.sectionTitle}>PLAN DE ACCIÓN RECOMENDADO</Text>
          {([data.actionPlan.phase1, data.actionPlan.phase2, data.actionPlan.phase3] as ActionPhase[]).map(
            (phase, i) => (
              <View key={i} style={[styles.phaseCard, { backgroundColor: phaseAccent[i] }]}>
                <View style={styles.phaseHeader}>
                  <View style={[styles.phaseDot, { backgroundColor: i === 2 ? "#fff" : RED }]} />
                  <Text style={styles.phaseTitle}>{phase.label}</Text>
                </View>
                <Text style={styles.phaseDesc}>{phase.description}</Text>
                {phase.actions.map((action, j) => (
                  <View key={j} style={styles.phaseAction}>
                    <Text style={styles.phaseArrow}>›</Text>
                    <Text style={styles.phaseActionText}>{action}</Text>
                  </View>
                ))}
              </View>
            )
          )}

          {/* Cómo puede ayudar Ember Lab */}
          <Text style={styles.sectionTitle}>CÓMO PUEDE AYUDARTE EMBER LAB</Text>
          <View style={styles.helpCard}>
            <Text style={styles.helpText}>{data.emberLabHelp}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Ember Lab</Text>
          <Text style={styles.footerText}>hola@emberlab.mx</Text>
          <Text style={styles.footerText}>2 / 2</Text>
        </View>
      </Page>
    </Document>
  );
}

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
        content: `Eres un consultor senior de Ember Lab. Analiza esta conversación de auditoría web y extrae el diagnóstico en el siguiente JSON exacto. Responde SOLO con el JSON, sin texto adicional.

{
  "clientName": "nombre del cliente (usa 'Cliente' si no se mencionó)",
  "company": "descripción breve de la empresa",
  "website": "URL del sitio web o 'Sin sitio web'",
  "email": "correo electrónico si fue mencionado, o vacío",
  "objective": "objetivo principal del sitio web",
  "targetAudience": "descripción del cliente ideal",
  "mainChallenge": "principal reto identificado",
  "marketingActions": "acciones de marketing que realiza",
  "executiveSummary": "resumen ejecutivo de máximo 120 palabras. Evalúa comunicación, conversión, experiencia de usuario y posicionamiento digital.",
  "workingWell": ["hallazgo positivo 1", "hallazgo positivo 2", "hallazgo positivo 3"],
  "opportunities": [
    {
      "title": "título corto de la oportunidad",
      "description": "descripción breve de qué hacer",
      "impact": "qué podría mejorar con esta acción",
      "priority": "Alta"
    }
  ],
  "actionPlan": {
    "phase1": {
      "label": "Fase 1 · Ajustes rápidos",
      "description": "Acciones que podrían realizarse en las próximas semanas",
      "actions": ["acción 1", "acción 2", "acción 3"]
    },
    "phase2": {
      "label": "Fase 2 · Optimización",
      "description": "Acciones estratégicas de mediano plazo",
      "actions": ["acción 1", "acción 2"]
    },
    "phase3": {
      "label": "Fase 3 · Crecimiento",
      "description": "Acciones orientadas a posicionamiento y generación de oportunidades",
      "actions": ["acción 1", "acción 2"]
    }
  },
  "emberLabHelp": "párrafo consultivo (3-4 oraciones) sobre cómo Ember Lab puede acompañar este proyecto. Solo menciona servicios que realmente aporten valor: estrategia digital, desarrollo web, identidad de marca, SEO, automatización, contenido. Habla como aliado estratégico, sin lenguaje comercial agresivo."
}

REGLAS:
- Genera entre 3 y 5 oportunidades.
- Para priority usa exactamente: "Alta", "Media" o "Baja".
- Nunca inventes problemas que no se mencionaron.
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
    year: "numeric", month: "long", day: "numeric",
  });

  const pdfBuffer = await renderToBuffer(<ReportPDF data={reportData} date={date} />);

  const slug = reportData.clientName
    .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-emberlab-${slug}.pdf"`,
    },
  });
}

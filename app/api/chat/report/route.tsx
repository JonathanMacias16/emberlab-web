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

type ReportData = {
  clientName: string;
  company: string;
  website: string;
  currentIssues: string[];
  goals: string[];
  targetAudience: string;
  executiveSummary: string;
  recommendations: { title: string; description: string }[];
  nextSteps: string[];
};

// EmberLab brand colors
const RED = "#E73F40";
const PURPLE = "#301f4b";
const WHITE = "#edeae7";
const PURPLE_SOFT = "#4a3570";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
    paddingBottom: 60,
  },
  // Header
  header: {
    backgroundColor: RED,
    padding: "32px 40px 28px 40px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },
  // Client card
  clientCard: {
    backgroundColor: PURPLE,
    margin: "24px 40px 0px 40px",
    borderRadius: 8,
    padding: "20px 24px",
  },
  clientLabel: {
    fontSize: 8,
    color: RED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
  },
  clientName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 10,
    color: "rgba(237,234,231,0.7)",
    marginBottom: 2,
  },
  clientDate: {
    fontSize: 9,
    color: "rgba(237,234,231,0.5)",
    marginTop: 8,
  },
  // Content sections
  body: {
    padding: "0 40px",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: RED,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `1px solid ${RED}`,
  },
  bodyText: {
    fontSize: 10,
    color: PURPLE,
    lineHeight: 1.6,
  },
  // Bullet items
  bulletItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 10,
    color: RED,
    marginRight: 8,
    marginTop: 1,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    fontSize: 10,
    color: PURPLE,
    lineHeight: 1.5,
    flex: 1,
  },
  // Recommendation cards
  recCard: {
    backgroundColor: "#f5f2ef",
    borderRadius: 6,
    padding: "12px 14px",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recBadge: {
    width: 22,
    height: 22,
    backgroundColor: RED,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
    marginTop: 1,
  },
  recBadgeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: PURPLE,
    marginBottom: 4,
  },
  recDescription: {
    fontSize: 9,
    color: "#5a4d7a",
    lineHeight: 1.5,
  },
  // Next steps
  stepItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  stepNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: RED,
    marginRight: 8,
    width: 16,
  },
  stepText: {
    fontSize: 10,
    color: PURPLE,
    lineHeight: 1.5,
    flex: 1,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: PURPLE,
    padding: "12px 40px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "rgba(237,234,231,0.6)",
  },
  footerBrand: {
    fontSize: 8,
    color: RED,
    fontFamily: "Helvetica-Bold",
  },
  // Page 2 header (continuation)
  continuationHeader: {
    backgroundColor: PURPLE,
    padding: "16px 40px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continuationTitle: {
    fontSize: 10,
    color: "rgba(237,234,231,0.6)",
  },
  continuationBrand: {
    fontSize: 10,
    color: RED,
    fontFamily: "Helvetica-Bold",
  },
});

function EmberLogoSvg() {
  return (
    <Svg viewBox="0 0 118 118" width={28} height={28}>
      <Path
        d="M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z"
        fill="#ffffff"
      />
      <Path
        d="M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z"
        fill="#ffffff"
      />
      <Path
        d="M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z"
        fill="#ffffff"
      />
      <Path
        d="M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z"
        fill="#ffffff"
      />
      <Path
        d="M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z"
        fill="#ffffff"
      />
      <Path
        d="M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z"
        fill="#ffffff"
      />
    </Svg>
  );
}

function ReportPDF({ data, date }: { data: ReportData; date: string }) {
  return (
    <Document
      title={`Diagnóstico EmberLab — ${data.clientName}`}
      author="EmberLab"
      subject="Diagnóstico Digital Personalizado"
    >
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>Diagnóstico Digital</Text>
            <Text style={styles.headerTitle}>EmberLab</Text>
            <Text style={styles.headerSubtitle}>
              Reporte Personalizado de Sitio Web
            </Text>
          </View>
          <EmberLogoSvg />
        </View>

        {/* Client card */}
        <View style={styles.clientCard}>
          <Text style={styles.clientLabel}>Preparado para</Text>
          <Text style={styles.clientName}>{data.clientName}</Text>
          {data.company && (
            <Text style={styles.clientDetail}>{data.company}</Text>
          )}
          {data.website && data.website !== "Sin sitio web" && (
            <Text style={styles.clientDetail}>{data.website}</Text>
          )}
          <Text style={styles.clientDate}>Generado el {date}</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Executive summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
            <Text style={styles.bodyText}>{data.executiveSummary}</Text>
          </View>

          {/* Current issues */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Situación Actual</Text>
            {data.currentIssues.map((issue, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{issue}</Text>
              </View>
            ))}
          </View>

          {/* Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objetivos Identificados</Text>
            {data.goals.map((goal, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{goal}</Text>
              </View>
            ))}
          </View>

          {/* Audience */}
          {data.targetAudience && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Audiencia Objetivo</Text>
              <Text style={styles.bodyText}>{data.targetAudience}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>EmberLab</Text>
          <Text style={styles.footerText}>hola@emberlab.mx</Text>
          <Text style={styles.footerText}>Pág. 1</Text>
        </View>
      </Page>

      {/* PAGE 2 — Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.continuationHeader}>
          <Text style={styles.continuationTitle}>
            Diagnóstico para {data.clientName}
          </Text>
          <Text style={styles.continuationBrand}>EmberLab</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Recomendaciones de EmberLab
            </Text>
            {data.recommendations.map((rec, i) => (
              <View key={i} style={styles.recCard}>
                <View style={styles.recBadge}>
                  <Text style={styles.recBadgeText}>{i + 1}</Text>
                </View>
                <View style={styles.recContent}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recDescription}>{rec.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximos Pasos</Text>
            {data.nextSteps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{i + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>EmberLab</Text>
          <Text style={styles.footerText}>hola@emberlab.mx</Text>
          <Text style={styles.footerText}>Pág. 2</Text>
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

  // Extract structured data from the conversation
  const extraction = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `Eres un experto en diseño y desarrollo web. Analiza esta conversación de diagnóstico y extrae la información en el siguiente JSON exacto. Responde SOLO con el JSON, sin texto adicional.

{
  "clientName": "nombre del cliente (usa 'Cliente' si no se mencionó)",
  "company": "nombre de empresa (vacío si no se mencionó)",
  "website": "URL del sitio web o 'Sin sitio web' si no tienen",
  "currentIssues": ["lista de 3-5 problemas identificados en la conversación"],
  "goals": ["lista de 2-4 objetivos que quiere lograr"],
  "targetAudience": "descripción breve de la audiencia objetivo",
  "executiveSummary": "párrafo de 2-3 oraciones resumiendo la situación del cliente y su necesidad principal",
  "recommendations": [
    {"title": "Título corto", "description": "Descripción de 1-2 oraciones de por qué y cómo implementar esta recomendación específica para este cliente"},
    ...5 recomendaciones mínimo basadas en los problemas y objetivos de la conversación
  ],
  "nextSteps": ["3-4 pasos concretos y accionables para comenzar a mejorar el sitio"]
}

Las recomendaciones deben ser ESPECÍFICAS para lo que mencionó el cliente, no genéricas.`,
      },
      ...messages,
    ],
  });

  let reportData: ReportData;
  try {
    reportData = JSON.parse(
      extraction.choices[0].message.content ?? "{}"
    ) as ReportData;
  } catch {
    return new Response("Error generando el reporte", { status: 500 });
  }

  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pdfBuffer = await renderToBuffer(
    <ReportPDF data={reportData} date={date} />
  );

  const clientSlug = reportData.clientName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="diagnostico-emberlab-${clientSlug}.pdf"`,
    },
  });
}

import OpenAI from "openai";
import { renderToBuffer } from "@react-pdf/renderer";

import { analyzeSite } from "@/lib/audit/analyzeSite";
import type { SiteAudit } from "@/lib/audit/types";
import type { Message } from "@/components/chat/types";
import { ReportPDF } from "./pdf";
import { SYSTEM_PROMPT, buildPromptInput, parseNarrative, type ReportNarrative } from "./prompt";
import { extractQuestionnaire, type Questionnaire } from "./questionnaire";

export type Report =
  | {
      ok: true;
      questionnaire: Questionnaire;
      audit: SiteAudit;
      narrative: ReportNarrative;
      pdf: Buffer;
      filename: string;
    }
  | {
      ok: false;
      questionnaire: Questionnaire;
      audit: SiteAudit | null;
      /** Para el equipo, no para el prospecto. */
      reason: string;
    };

/**
 * De la conversación al PDF: extrae el cuestionario, mide el sitio, le pide al
 * modelo que lo explique y arma el documento. Los números salen del audit; el
 * modelo solo pone las palabras.
 *
 * Si el sitio no se pudo medir no se genera nada: el prompt prohíbe redactar
 * sin datos y un reporte "de criterio" contradiría la promesa del diagnóstico.
 */
export async function generateReport(messages: Message[]): Promise<Report> {
  const questionnaire = extractQuestionnaire(messages);
  const fail = (reason: string, audit: SiteAudit | null = null): Report => ({ ok: false, questionnaire, audit, reason });

  if (!questionnaire.sitio) return fail("El prospecto no compartió la dirección de un sitio.");

  let audit: SiteAudit;
  try {
    audit = await analyzeSite(questionnaire.sitio);
  } catch (error) {
    return fail(`Falló el análisis de ${questionnaire.sitio}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const scores = [audit.scores.seoBasico, audit.scores.conversion, audit.scores.experienciaUsuario];
  if (scores.every((s) => s.status === "unavailable")) {
    const reason = audit.page.status === "unavailable" ? audit.page.reason : "No se pudo calcular ninguna calificación.";
    return fail(`No se pudo medir ${questionnaire.sitio}: ${reason}`, audit);
  }

  const narrative = await writeNarrative(questionnaire, audit);
  if (!narrative) return fail("El modelo no devolvió un reporte válido o declaró el sitio como no analizable.", audit);

  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Mexico_City",
  });
  const pdf = await renderToBuffer(
    <ReportPDF narrative={narrative} audit={audit} questionnaire={questionnaire} date={date} />
  );

  const slug = (questionnaire.nombre ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return { ok: true, questionnaire, audit, narrative, pdf, filename: `diagnostico-emberlab-${slug || "cliente"}.pdf` };
}

async function writeNarrative(questionnaire: Questionnaire, audit: SiteAudit): Promise<ReportNarrative | null> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const screenshot = audit.pagespeed.status === "ok" ? audit.pagespeed.value.screenshots.final : null;

  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: buildPromptInput(questionnaire, audit, Boolean(screenshot)) },
  ];
  if (screenshot) content.push({ type: "image_url", image_url: { url: screenshot } });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content },
    ],
  });

  try {
    return parseNarrative(JSON.parse(completion.choices[0].message.content ?? ""));
  } catch {
    return null;
  }
}

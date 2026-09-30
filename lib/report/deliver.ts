import { Resend } from "resend";

import type { Message } from "@/components/chat/types";
import { CONTACT_EMAIL, whatsappUrl } from "@/lib/contact";
import { generateReport, type Report } from "./generate";
import { PREGUNTA_TITULO, PREGUNTAS, scoreBand, scoreFor } from "./prompt";
import { extractQuestionnaire } from "./questionnaire";

const RED = "#e73f40";
const PURPLE = "#301f4b";
const CREAM = "#edeae7";
const TONE_COLOR = { alto: "#1f9d55", medio: "#e8900c", bajo: RED } as const;

const LOGO_URL = process.env.LOGO_EMAIL_URL || "https://www.emberlab.mx/logo-ember.png";
const TEAM_EMAIL = process.env.BRIEF_NOTIFICATION_EMAIL || CONTACT_EMAIL;

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hostOf(url: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function firstName(name: string | null): string {
  return (name ?? "").trim().split(/\s+/)[0] ?? "";
}

function layout(title: string, body: string, footer: string) {
  return `
  <div style="background:${CREAM};padding:28px 16px;font-family:sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:2px;color:${RED};font-weight:700;">EMBER LAB</p>
      <h1 style="margin:0 0 18px 0;font-size:24px;line-height:1.25;color:${PURPLE};">${title}</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:10px;border:1px solid #e5e0da;margin-bottom:18px;">
        <tr><td style="padding:20px;font-size:15px;line-height:1.6;color:${PURPLE};">${body}</td></tr>
      </table>
      <p style="margin:0;font-size:11px;color:${PURPLE};opacity:0.5;">${footer}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin-top:24px;border-top:1px solid #d9d3cd;">
        <tr><td align="center" style="padding-top:20px;">
          <img src="${LOGO_URL}" alt="EmberLab" width="140" height="49" style="display:block;width:140px;height:auto;border:0;outline:none;text-decoration:none;" />
        </td></tr>
      </table>
    </div>
  </div>`;
}

function whatsappButton(text: string) {
  return `<a href="${whatsappUrl(text)}" style="display:inline-block;background:#25d366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:11px 20px;border-radius:999px;">Escríbenos por WhatsApp</a>`;
}

// ── Al prospecto ───────────────────────────────────────────────────────────────

function reportEmail(report: Extract<Report, { ok: true }>) {
  const { questionnaire: q, narrative, audit } = report;
  const name = firstName(q.nombre);
  const host = hostOf(audit.page.status === "ok" ? audit.page.value.finalUrl : q.sitio);
  const first = narrative.oportunidades[0];

  const scoreRows = PREGUNTAS.map((p) => {
    const score = scoreFor(audit, p);
    if (score.status !== "ok") {
      return `<tr><td style="padding:6px 0;">${PREGUNTA_TITULO[p]}</td><td align="right" style="padding:6px 0;color:#9080b0;">No medido</td></tr>`;
    }
    const band = scoreBand(score.value);
    return `<tr>
      <td style="padding:6px 0;">${PREGUNTA_TITULO[p]}<br /><span style="font-size:12px;color:${TONE_COLOR[band.tone]};">${band.label}</span></td>
      <td align="right" valign="top" style="padding:6px 0;font-size:20px;font-weight:700;color:${TONE_COLOR[band.tone]};">${score.value}<span style="font-size:11px;color:#9080b0;font-weight:400;">/100</span></td>
    </tr>`;
  }).join("");

  const body = `
    <p style="margin:0 0 12px 0;">Hola${name ? `, ${escapeHtml(name)}` : ""}:</p>
    <p style="margin:0 0 16px 0;">Te compartimos el diagnóstico de <strong>${escapeHtml(host)}</strong>. Va adjunto en PDF, con lo que medimos en tu sitio y lo que te recomendamos hacer.</p>
    ${narrative.frase_sintesis ? `<p style="margin:0 0 16px 0;font-size:19px;font-weight:700;line-height:1.3;">${escapeHtml(narrative.frase_sintesis)}</p>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border-top:1px solid #eee;border-bottom:1px solid #eee;margin:0 0 16px 0;">${scoreRows}</table>
    ${first ? `<p style="margin:0 0 16px 0;"><strong>Por dónde empezar:</strong> ${escapeHtml(first.titulo)}. ${escapeHtml(first.que_hacer)}</p>` : ""}
    <p style="margin:0 0 14px 0;">Si quieres, lo revisamos juntos en una llamada de 20 minutos.</p>
    <p style="margin:0 0 14px 0;">${whatsappButton("Hola, recibí mi diagnóstico digital de Ember Lab.")}</p>
    <p style="margin:0 0 12px 0;font-size:13px;opacity:0.7;">O simplemente responde a este correo.</p>
    <p style="margin:0;">Saludos,<br />Ember Lab</p>`;

  const text = [
    `Hola${name ? `, ${name}` : ""}:`,
    `Te compartimos el diagnóstico de ${host}. Va adjunto en PDF.`,
    narrative.frase_sintesis,
    ...PREGUNTAS.map((p) => {
      const score = scoreFor(audit, p);
      return `${PREGUNTA_TITULO[p]} ${score.status === "ok" ? `${score.value}/100` : "No medido"}`;
    }),
    first ? `Por dónde empezar: ${first.titulo}. ${first.que_hacer}` : "",
    `Si quieres, lo revisamos juntos en una llamada de 20 minutos: ${whatsappUrl()} o responde a este correo.`,
    "Saludos,\nEmber Lab",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    subject: `Tu diagnóstico digital · ${host}`,
    html: layout("Tu diagnóstico digital está listo", body, "Recibes este correo porque pediste tu diagnóstico en el chat de emberlab.mx"),
    text,
  };
}

/**
 * Cuando no hubo reporte. Se promete seguimiento humano porque el equipo
 * recibe el lead con el motivo (ver `teamEmail`).
 */
function fallbackEmail(report: Extract<Report, { ok: false }>) {
  const name = firstName(report.questionnaire.nombre);
  const host = hostOf(report.questionnaire.sitio);
  const site = host ? `<strong>${escapeHtml(host)}</strong>` : "tu sitio";

  const body = `
    <p style="margin:0 0 12px 0;">Hola${name ? `, ${escapeHtml(name)}` : ""}:</p>
    <p style="margin:0 0 12px 0;">Gracias por tomarte el tiempo de responder.</p>
    <p style="margin:0 0 12px 0;">No pudimos analizar ${site} de forma automática, así que alguien de nuestro equipo lo va a revisar y te escribirá a este correo.</p>
    <p style="margin:0 0 14px 0;">Si prefieres adelantar la plática, escríbenos:</p>
    <p style="margin:0 0 14px 0;">${whatsappButton("Hola, pedí mi diagnóstico digital en el chat de Ember Lab.")}</p>
    <p style="margin:0;">Saludos,<br />Ember Lab</p>`;

  return {
    subject: "Recibimos tu solicitud de diagnóstico",
    html: layout("Recibimos tu solicitud", body, "Recibes este correo porque pediste tu diagnóstico en el chat de emberlab.mx"),
    text: `Hola${name ? `, ${name}` : ""}:\n\nGracias por tomarte el tiempo de responder.\n\nNo pudimos analizar ${host || "tu sitio"} de forma automática, así que alguien de nuestro equipo lo va a revisar y te escribirá a este correo.\n\nSi prefieres adelantar la plática, escríbenos por WhatsApp: ${whatsappUrl()}\n\nSaludos,\nEmber Lab`,
  };
}

// ── Al equipo ──────────────────────────────────────────────────────────────────

function teamEmail(report: Report, messages: Message[], prospectStatus: string) {
  const q = report.questionnaire;
  const host = hostOf(q.sitio) || "sin sitio";
  const who = q.nombre || "Sin nombre";

  const rows: Array<[string, string | null]> = [
    ["Nombre", q.nombre],
    ["Correo", q.email],
    ["Sitio", q.sitio],
    ["Giro", q.giro],
    ["Objetivo", q.objetivo],
    ["Cliente ideal", q.clienteIdeal],
    ["Marketing", q.accionesMarketing],
    ["Reto", q.reto],
    ["Quiere mejorar", q.quiereMejorar],
  ];
  if (report.audit) {
    for (const p of PREGUNTAS) {
      const score = scoreFor(report.audit, p);
      rows.push([PREGUNTA_TITULO[p], score.status === "ok" ? `${score.value}/100` : `No medido: ${score.reason}`]);
    }
  }

  const status = report.ok
    ? `<p style="margin:0 0 12px 0;color:#1f9d55;font-weight:700;">Reporte generado. Va adjunto.</p>`
    : `<p style="margin:0 0 12px 0;color:${RED};font-weight:700;">No se generó el reporte: ${escapeHtml(report.reason)}</p>`;

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td valign="top" style="padding:5px 12px 5px 0;font-size:13px;opacity:0.6;white-space:nowrap;">${label}</td><td style="padding:5px 0;font-size:14px;">${escapeHtml(value || "—")}</td></tr>`
    )
    .join("");

  const transcript = messages
    .map((m) => `${m.role === "user" ? "PROSPECTO" : "EMBER"}: ${m.content}`)
    .join("\n\n");

  const body = `
    ${status}
    <p style="margin:0 0 12px 0;font-size:14px;"><strong>Correo al prospecto:</strong> ${escapeHtml(prospectStatus)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 16px 0;">${table}</table>
    <p style="font-size:12px;letter-spacing:1px;opacity:0.6;margin:0 0 8px 0;">CONVERSACIÓN</p>
    <div style="font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(transcript)}</div>`;

  return {
    subject: report.ok ? `Nuevo diagnóstico del chat: ${who} · ${host}` : `⚠️ Diagnóstico sin reporte: ${who} · ${host}`,
    html: layout(report.ok ? "Nuevo lead del chat de diagnóstico" : "Lead del chat sin reporte", body, "Enviado automáticamente por el chat de diagnóstico de emberlab.mx"),
  };
}

// ── Envío ──────────────────────────────────────────────────────────────────────

/**
 * Corre en segundo plano (`after` en la ruta): el prospecto ya cerró el chat y
 * el reporte le llega por correo. Nada de aquí puede lanzar: un error se
 * convierte en correo de seguimiento para el prospecto y en aviso al equipo.
 */
export async function deliverReport(messages: Message[]): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  let report: Report;
  try {
    report = await generateReport(messages);
  } catch (error) {
    console.error("Error generando el reporte del chat:", error);
    report = {
      ok: false,
      questionnaire: extractQuestionnaire(messages),
      audit: null,
      reason: `Error inesperado: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const to = report.questionnaire.email;
  let prospectStatus = "no dejó correo";
  if (to) {
    const email = report.ok ? reportEmail(report) : fallbackEmail(report);
    try {
      const result = await resend.emails.send({
        from: `Ember Lab <${CONTACT_EMAIL}>`,
        to,
        replyTo: CONTACT_EMAIL,
        subject: email.subject,
        html: email.html,
        text: email.text,
        attachments: report.ok ? [{ filename: report.filename, content: report.pdf }] : undefined,
      });
      // El SDK de Resend no lanza en errores de la API: los devuelve aquí.
      prospectStatus = result.error
        ? `falló (${result.error.message})`
        : `enviado a ${to} (${report.ok ? "con PDF" : "aviso de seguimiento"})`;
      if (result.error) console.error("Resend rechazó el correo al prospecto:", result.error);
    } catch (error) {
      console.error("Error enviando el correo al prospecto:", error);
      prospectStatus = `falló (${error instanceof Error ? error.message : String(error)})`;
    }
  }

  const team = teamEmail(report, messages, prospectStatus);
  try {
    const result = await resend.emails.send({
      from: `EmberLab Diagnóstico <leads@emberlab.mx>`,
      to: TEAM_EMAIL,
      replyTo: to ?? undefined,
      subject: team.subject,
      html: team.html,
      attachments: report.ok ? [{ filename: report.filename, content: report.pdf }] : undefined,
    });
    if (result.error) console.error("Resend rechazó el aviso al equipo:", result.error);
  } catch (error) {
    console.error("Error enviando el aviso al equipo:", error);
  }
}

import { NextRequest } from "next/server";
import { Resend } from "resend";

interface AxisScore {
  percent: number;
  max: number;
  positive: number;
  negative: number;
}

interface BriefPayload {
  name: string;
  business: string;
  email: string;
  whatsapp: string;
  qualityScore: AxisScore;
  readinessScore: AxisScore;
  summaryText: string;
}

const RED = "#e73f40";
const PURPLE = "#301f4b";
const CREAM = "#edeae7";

function tier(percent: number): {
  label: string;
  emoji: string;
  color: string;
} {
  if (percent >= 60)
    return { label: "Lead caliente", emoji: "🔥", color: "#22c55e" };
  if (percent >= 30)
    return { label: "Lead tibio", emoji: "🟡", color: "#f59e0b" };
  return { label: "Lead frío", emoji: "❄️", color: RED };
}

function scoreBlock(label: string, axis: AxisScore) {
  const t = tier(axis.percent);
  return `
    <td style="padding:16px 18px;background:#ffffff;border-radius:10px;border:1px solid #e5e0da;width:50%;">
      <p style="margin:0 0 4px 0;font-size:12px;color:${PURPLE};opacity:0.6;font-family:sans-serif;">${label}</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:${t.color};font-family:sans-serif;">${axis.percent}%</p>
      <p style="margin:6px 0 0 0;font-size:12px;color:${PURPLE};font-family:sans-serif;">
        ${t.emoji} ${t.label} &middot; máx ${axis.max} pts &middot; <span style="color:#16a34a;">+${axis.positive}</span> / <span style="color:${RED};">${axis.negative}</span>
      </p>
    </td>`;
}

function buildEmailHtml(data: BriefPayload) {
  const t = tier(data.qualityScore.percent);
  return `
  <div style="background:${CREAM};padding:28px 16px;font-family:sans-serif;">
    <div style="max-width:560px;margin:0 auto;">
      <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:2px;color:${RED};font-weight:700;">EMBER LAB · NUEVO LEAD</p>
      <h1 style="margin:0 0 18px 0;font-size:24px;color:${PURPLE};">${data.name || "Sin nombre"} ${t.emoji}</h1>

      <table role="presentation" width="100%" style="border-collapse:separate;border-spacing:12px 0;margin:0 0 18px -12px;">
        <tr>
          ${scoreBlock("Calidad de lead", data.qualityScore)}
          ${scoreBlock("Preparación", data.readinessScore)}
        </tr>
      </table>

      <table role="presentation" width="100%" style="background:#ffffff;border-radius:10px;border:1px solid #e5e0da;margin-bottom:18px;">
        <tr>
          <td style="padding:14px 18px;font-size:14px;color:${PURPLE};">
            <p style="margin:0 0 6px 0;"><strong>Empresa:</strong> ${data.business || "—"}</p>
            <p style="margin:0 0 6px 0;"><strong>Correo:</strong> ${data.email || "—"}</p>
            <p style="margin:0;"><strong>WhatsApp:</strong> ${data.whatsapp || "—"}</p>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;letter-spacing:1px;color:${PURPLE};opacity:0.6;margin:0 0 8px 0;">RESPUESTAS COMPLETAS</p>
      <div style="background:#ffffff;border-radius:10px;border:1px solid #e5e0da;padding:16px 18px;font-size:13px;line-height:1.6;color:${PURPLE};white-space:pre-wrap;">${escapeHtml(
        data.summaryText,
      )}</div>

      <p style="margin:20px 0 0 0;font-size:11px;color:${PURPLE};opacity:0.5;">Enviado automáticamente desde el formulario de brief de emberlab.mx</p>
    </div>
  </div>`;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildLeadConfirmationHtml(data: BriefPayload) {
  const name = escapeHtml(data.name || "").trim();
  const business = escapeHtml(data.business || "").trim();
  return `
  <div style="background:${CREAM};padding:28px 16px;font-family:sans-serif;">
    <div style="max-width:520px;margin:0 auto;">
      <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:2px;color:${RED};font-weight:700;">EMBER LAB</p>
      <div style="background:#ffffff;border-radius:10px;border:1px solid #e5e0da;padding:24px;font-size:14px;line-height:1.7;color:${PURPLE};">
        <p style="margin:0 0 16px 0;">Hola${name ? `, ${name}` : ""}:</p>
        <p style="margin:0 0 16px 0;">Gracias por compartirnos información${business ? ` sobre ${business}` : ""}.</p>
        <p style="margin:0 0 16px 0;">Ya estamos revisando tus respuestas para entender en qué etapa se encuentra tu proyecto y cuál puede ser el mejor camino para tu sitio web.</p>
        <p style="margin:0 0 16px 0;">Te contactaremos en las próximas 24 horas hábiles por WhatsApp o correo.</p>
        <p style="margin:0;">Saludos,<br/>Equipo Ember Lab</p>
      </div>
      <p style="margin:16px 0 0 0;font-size:12px;color:${PURPLE};opacity:0.7;">Si quieres adelantar algo, puedes responder este correo o escríbenos por WhatsApp.</p>
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return new Response("RESEND_API_KEY no configurada", { status: 503 });
  }

  const data: BriefPayload = await req.json();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.BRIEF_NOTIFICATION_EMAIL || "hola@emberlab.mx";
  const t = tier(data.qualityScore?.percent ?? 0);

  try {
    const result = await resend.emails.send({
      from: "EmberLab Brief <leads@emberlab.mx>",
      to,
      replyTo: data.email || undefined,
      subject: `${t.emoji} Nuevo lead: ${data.business || data.name || "Sin nombre"} — Calidad ${data.qualityScore?.percent ?? 0}%`,
      html: buildEmailHtml(data),
    });

    // El SDK de Resend no lanza excepción en errores de la API (dominio no
    // verificado, remitente inválido, etc.) — los devuelve en result.error.
    if (result.error) {
      console.error("Resend rechazó el correo del brief-web:", result.error);
      return new Response(JSON.stringify(result.error), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error enviando el correo del brief-web:", error);
    return new Response("Error enviando el correo", { status: 500 });
  }

  if (data.email) {
    try {
      const confirmationResult = await resend.emails.send({
        from: "Ember Lab <hola@emberlab.mx>",
        to: data.email,
        subject: "Recibimos tu información — Ember Lab",
        html: buildLeadConfirmationHtml(data),
      });

      if (confirmationResult.error) {
        console.error(
          "Resend rechazó el correo de confirmación al lead:",
          confirmationResult.error,
        );
      }
    } catch (error) {
      console.error("Error enviando el correo de confirmación al lead:", error);
    }
  }

  return new Response(null, { status: 204 });
}

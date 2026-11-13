import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/contact";
import { validateLead, type ContactLeadRequest, type LeadNeed } from "@/lib/contactLead";

const TEAM_EMAIL = process.env.BRIEF_NOTIFICATION_EMAIL || CONTACT_EMAIL;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Enlace para escribirle al prospecto por WhatsApp; 10 dígitos = número de México. */
function whatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`;
}

/**
 * Recibe el formulario corto de `/hablemos` y avisa al equipo por correo,
 * con un enlace directo para escribirle al prospecto por WhatsApp.
 *
 * Sin `RESEND_API_KEY` (previews, local) el lead solo queda en los logs.
 */
export async function POST(req: NextRequest) {
  const raw = (await req.json().catch(() => null)) as Partial<ContactLeadRequest> | null;
  if (!raw) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });

  const lead: ContactLeadRequest = {
    name: clean(raw.name),
    whatsapp: clean(raw.whatsapp, 40),
    email: clean(raw.email),
    need: clean(raw.need, 60) as LeadNeed,
    business: clean(raw.business, 300),
  };
  if (Object.keys(validateLead(lead)).length > 0) {
    return NextResponse.json({ error: "Revisa tus datos e inténtalo de nuevo." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.info("[contacto] nuevo lead (sin RESEND_API_KEY)", JSON.stringify(lead));
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const wa = whatsappLink(lead.whatsapp);
    const result = await resend.emails.send({
      from: "EmberLab Leads <leads@emberlab.mx>",
      to: TEAM_EMAIL,
      replyTo: lead.email,
      subject: `💬 Nuevo lead (Hablemos): ${lead.business || lead.name} — ${lead.need}`,
      html: `<div style="font-family:sans-serif;color:#301f4b;">
        <p style="font-size:12px;letter-spacing:2px;color:#e73f40;font-weight:700;">EMBER LAB · NUEVO LEAD · FORMULARIO HABLEMOS</p>
        <h1 style="font-size:22px;margin:0 0 12px 0;">${escapeHtml(lead.name)}</h1>
        <p><strong>Necesita:</strong> ${escapeHtml(lead.need)}</p>
        <p><strong>Negocio o sitio:</strong> ${escapeHtml(lead.business)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(lead.whatsapp)}</p>
        <p><a href="${wa}" style="display:inline-block;background:#25d366;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;">Escribirle por WhatsApp</a></p>
        <p style="font-size:12px;opacity:0.6;">Le prometimos respuesta en menos de 24 h hábiles. Enviado desde tuweb.emberlab.mx/hablemos.</p>
      </div>`,
    });
    if (result.error) {
      console.error("[contacto] Resend rechazó el aviso:", result.error, JSON.stringify(lead));
      return NextResponse.json(
        { error: "No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contacto] error enviando el aviso:", error, JSON.stringify(lead));
    return NextResponse.json(
      { error: "No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

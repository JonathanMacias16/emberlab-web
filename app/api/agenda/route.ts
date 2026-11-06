import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formatSlot, isValidSlot, overlapsBusy, SLOT_MINUTES, type AgendaRequest } from "@/lib/agenda";
import { busyRanges, calendarConfigured, createEvent } from "@/lib/googleCalendar";
import { CONTACT_EMAIL } from "@/lib/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEAM_EMAIL = process.env.BRIEF_NOTIFICATION_EMAIL || CONTACT_EMAIL;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Recibe una cita de `/agenda`: valida datos y horario, revisa que la hora
 * siga libre en Google Calendar, crea el evento con Meet (Google invita al
 * prospecto) y avisa al equipo por correo.
 *
 * Sin las variables de Google (previews, local) la cita solo queda en los logs.
 */
export async function POST(req: NextRequest) {
  const raw = (await req.json().catch(() => null)) as Partial<AgendaRequest> | null;
  if (!raw) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });

  const cita: AgendaRequest = {
    slot: clean(raw.slot, 40),
    name: clean(raw.name),
    business: clean(raw.business),
    email: clean(raw.email),
    whatsapp: clean(raw.whatsapp, 40),
    website: clean(raw.website, 300) || undefined,
  };

  if (!isValidSlot(cita.slot)) {
    return NextResponse.json(
      { error: "Ese horario ya no está disponible. Elige otro, por favor." },
      { status: 409 },
    );
  }
  if (!cita.name || !cita.business || !EMAIL_RE.test(cita.email) || cita.whatsapp.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "Revisa tus datos e inténtalo de nuevo." }, { status: 400 });
  }

  if (!calendarConfigured()) {
    console.info("[agenda] nueva cita (sin Google Calendar configurado)", JSON.stringify(cita));
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const start = new Date(cita.slot);
  const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);

  let event: Awaited<ReturnType<typeof createEvent>>;
  try {
    // Segunda revisión justo antes de crear: alguien pudo tomar la hora
    // mientras el prospecto llenaba sus datos.
    if (overlapsBusy(cita.slot, await busyRanges(start, end))) {
      return NextResponse.json(
        { error: "Alguien acaba de tomar ese horario. Elige otro, por favor." },
        { status: 409 },
      );
    }

    const details = [
      `Nombre: ${cita.name}`,
      `Negocio: ${cita.business}`,
      `Correo: ${cita.email}`,
      `WhatsApp: ${cita.whatsapp}`,
      cita.website ? `Sitio: ${cita.website}` : null,
      "",
      "Agendada desde tuweb.emberlab.mx/agenda",
    ]
      .filter((l) => l !== null)
      .join("\n");

    event = await createEvent({
      start,
      end,
      summary: `Ember Lab × ${cita.business} (20 min)`,
      description: details,
      attendeeEmail: cita.email,
      attendeeName: cita.name,
      requestId: `agenda-${start.getTime()}-${cita.email}`.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 60),
    });
  } catch (error) {
    console.error("[agenda] no se pudo crear la cita en Google Calendar:", error, JSON.stringify(cita));
    return NextResponse.json(
      { error: "No pudimos agendar tu llamada. Inténtalo de nuevo o escríbenos por WhatsApp." },
      { status: 502 },
    );
  }

  // Aviso al equipo con los datos. Si falla, la cita ya está en el calendario.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const when = formatSlot(cita.slot);
      const result = await resend.emails.send({
        from: "EmberLab Agenda <leads@emberlab.mx>",
        to: TEAM_EMAIL,
        replyTo: cita.email,
        subject: `📅 Nueva llamada: ${cita.business} — ${when}`,
        html: `<div style="font-family:sans-serif;color:#301f4b;">
          <p style="font-size:12px;letter-spacing:2px;color:#e73f40;font-weight:700;">EMBER LAB · NUEVA LLAMADA DE 20 MIN</p>
          <h1 style="font-size:22px;margin:0 0 12px 0;">${escapeHtml(when)} (hora del centro)</h1>
          <p><strong>${escapeHtml(cita.name)}</strong> · ${escapeHtml(cita.business)}</p>
          <p>${escapeHtml(cita.email)} · WhatsApp ${escapeHtml(cita.whatsapp)}</p>
          ${cita.website ? `<p>Sitio: ${escapeHtml(cita.website)}</p>` : ""}
          ${event.meetLink ? `<p>Meet: <a href="${event.meetLink}">${event.meetLink}</a></p>` : ""}
          <p><a href="${event.htmlLink}">Ver en Google Calendar</a></p>
        </div>`,
      });
      if (result.error) console.error("[agenda] Resend rechazó el aviso:", result.error);
    } catch (error) {
      console.error("[agenda] error enviando el aviso:", error);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { isValidSlot, type AgendaRequest } from "@/lib/agenda";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Recibe una cita de `/agenda`. Valida los datos y el horario.
 *
 * PENDIENTE: todavía no se envía a ningún lado. Falta decidir con Jonathan
 * cómo se reciben las citas (correo, calendario, WhatsApp). Mientras tanto
 * la cita queda en los logs de Vercel para no perderla.
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

  console.info("[agenda] nueva cita", JSON.stringify(cita));
  return NextResponse.json({ ok: true }, { status: 202 });
}

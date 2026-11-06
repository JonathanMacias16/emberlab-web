import { NextResponse } from "next/server";
import { busyRanges, calendarConfigured } from "@/lib/googleCalendar";

export const dynamic = "force-dynamic";

/**
 * Horarios ocupados del calendario en las próximas dos semanas, para que
 * `/agenda` solo ofrezca horas libres. Devuelve solo inicio y fin: ningún
 * dato de los eventos sale del servidor.
 */
export async function GET() {
  if (!calendarConfigured()) return NextResponse.json({ busy: [] });

  const now = new Date();
  const until = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  try {
    const busy = await busyRanges(now, until);
    return NextResponse.json(
      { busy },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[agenda] no se pudo leer la disponibilidad:", error);
    // Sin disponibilidad se muestran todos los horarios; el POST revisa de
    // nuevo antes de crear la cita, así que un choque no llega al calendario.
    return NextResponse.json({ busy: [], unavailable: true });
  }
}

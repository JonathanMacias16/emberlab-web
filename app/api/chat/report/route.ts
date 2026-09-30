import { after, NextRequest } from "next/server";

import type { Message } from "@/components/chat/types";
import { deliverReport } from "@/lib/report/deliver";
import { generateReport } from "@/lib/report/generate";

// El audit usa módulos de Node (dns, http, zlib) para el fetch seguro.
export const runtime = "nodejs";
// El análisis (PageSpeed puede tomarse 75 s), el modelo y los correos corren en
// segundo plano con `after`, pero dentro del mismo límite de la función.
export const maxDuration = 300;

// Una conversación completa del chat son ~20 mensajes cortos. Esto solo evita
// que alguien use el endpoint para mandarle al modelo un libro.
const MAX_MESSAGES = 60;
const MAX_CHARS = 4_000;

function parseMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;
  const valid = value.every(
    (m) =>
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length <= MAX_CHARS
  );
  return valid ? value.map((m) => ({ role: m.role, content: m.content })) : null;
}

/**
 * POST { messages, delivery? } → 202
 *
 * El reporte tarda entre 30 s y dos minutos, así que no se hace esperar al
 * prospecto: la ruta responde de inmediato y el PDF le llega por correo, con
 * copia al equipo (ver `deliverReport`).
 *
 * `delivery: "download"` devuelve el PDF en la respuesta, sin mandar correos.
 * Solo en desarrollo, para revisar el diseño con la conversación de prueba.
 */
export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY no configurada", { status: 503 });
  }

  let body: { messages?: unknown; delivery?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }
  const messages = parseMessages(body.messages);
  if (!messages) return new Response("Falta la conversación", { status: 400 });

  if (body.delivery === "download") {
    if (process.env.NODE_ENV !== "development") return new Response("No disponible", { status: 404 });
    const report = await generateReport(messages);
    if (!report.ok) return new Response(report.reason, { status: 422 });
    return new Response(new Uint8Array(report.pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.filename}"`,
      },
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return new Response("RESEND_API_KEY no configurada", { status: 503 });
  }

  after(() => deliverReport(messages));
  return Response.json({ status: "queued" }, { status: 202 });
}

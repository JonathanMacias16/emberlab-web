import { NextRequest } from "next/server";
import { analyzeSite } from "@/lib/audit/analyzeSite";

// Usa módulos de Node (dns, http, zlib) para el fetch seguro.
export const runtime = "nodejs";
// Peor caso: página por https y reintento por http (10 s c/u) + robots.txt (5 s)
// + hasta 4 candidatos de sitemap (5 s c/u) ≈ 45 s.
export const maxDuration = 60;

/**
 * POST { url } → SiteAudit
 *
 * Responde 200 aunque el sitio analizado no se haya podido leer: eso es un
 * resultado válido del análisis y viene explicado en `page.reason`. Solo el
 * cuerpo mal formado es un 400.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });
  }

  const url = (body as { url?: unknown })?.url;
  if (typeof url !== "string" || url.length === 0 || url.length > 2048) {
    return Response.json({ error: "Falta `url` (texto de hasta 2048 caracteres)." }, { status: 400 });
  }

  const audit = await analyzeSite(url);
  return Response.json(audit);
}

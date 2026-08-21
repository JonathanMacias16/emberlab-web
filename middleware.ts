import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * tuweb.emberlab.mx es el mismo proyecto, sirviendo /landing en la raíz del
 * subdominio. El resto de las rutas (/brief-web, /api/brief, etc.) ya son
 * accesibles tal cual bajo ese host, así que no necesitan rewrite.
 */
const LANDING_SUBDOMAIN = "tuweb.emberlab.mx";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === LANDING_SUBDOMAIN) {
    return NextResponse.rewrite(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";
import type { IncomingMessage } from "node:http";
import type { Readable } from "node:stream";

/**
 * `fetch` para URLs que escribe un desconocido.
 *
 * El análisis sale de nuestro servidor hacia cualquier dirección, así que sin
 * esto alguien podría apuntarlo a `localhost`, a la red interna o al endpoint
 * de metadata de la nube (SSRF). Reglas:
 *
 * - Solo http/https, puertos 80/443 y sin credenciales en la URL.
 * - Toda IP destino tiene que ser pública. Se valida en dos sitios porque Node
 *   no llama al `lookup` cuando el host ya es una IP literal:
 *     1. IPs literales, antes de conectar.
 *     2. Nombres de dominio, dentro del `lookup` del socket. Validar ahí (y no
 *        resolviendo aparte antes) evita el DNS rebinding: la IP que se valida
 *        es exactamente la IP a la que se conecta.
 * - Los redirects se siguen a mano y cada salto pasa por las mismas reglas.
 * - Tiempo total y tamaño máximo acotados, medidos sobre el cuerpo ya
 *   descomprimido para que un gzip bomba no reviente la memoria.
 */

const BLOCKED = new net.BlockList();

const BLOCKED_V4: Array<[string, number]> = [
  ["0.0.0.0", 8], // "esta red"
  ["10.0.0.0", 8], // privada
  ["100.64.0.0", 10], // CGNAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, incluye metadata de la nube
  ["172.16.0.0", 12], // privada
  ["192.0.0.0", 24], // IETF
  ["192.0.2.0", 24], // documentación
  ["192.88.99.0", 24], // relay 6to4
  ["192.168.0.0", 16], // privada
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // documentación
  ["203.0.113.0", 24], // documentación
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reservada + broadcast
];

// Las IPv4 mapeadas (::ffff:a.b.c.d) ya las cubren las reglas de arriba: el
// BlockList de Node las compara contra las reglas IPv4. Los prefijos que
// incrustan IPv4 de otra forma (NAT64, 6to4, Teredo) se bloquean completos.
const BLOCKED_V6: Array<[string, number]> = [
  ["::", 128], // no especificada
  ["::1", 128], // loopback
  ["64:ff9b::", 96], // NAT64
  ["100::", 64], // descarte
  ["2001::", 32], // Teredo
  ["2001:db8::", 32], // documentación
  ["2002::", 16], // 6to4
  ["fc00::", 7], // única local
  ["fe80::", 10], // link-local
  ["ff00::", 8], // multicast
];

for (const [addr, prefix] of BLOCKED_V4) BLOCKED.addSubnet(addr, prefix, "ipv4");
for (const [addr, prefix] of BLOCKED_V6) BLOCKED.addSubnet(addr, prefix, "ipv6");

export function isBlockedAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 0) return true; // lo que no es IP válida no pasa
  return BLOCKED.check(address, family === 4 ? "ipv4" : "ipv6");
}

export type FetchErrorCode =
  | "invalid_url"
  | "blocked_address"
  | "dns_failed"
  | "timeout"
  | "too_many_redirects"
  | "connection_failed";

export class SafeFetchError extends Error {
  code: FetchErrorCode;

  constructor(code: FetchErrorCode, message: string) {
    super(message);
    this.name = "SafeFetchError";
    this.code = code;
  }
}

export interface SafeResponse {
  /** URL después de seguir los redirects. */
  finalUrl: string;
  status: number;
  headers: IncomingMessage["headers"];
  body: Buffer;
  /** `true` si se cortó el cuerpo al llegar a `maxBytes`. */
  truncated: boolean;
  /** Cadena de URLs por las que pasó antes de la final. */
  redirects: string[];
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  accept?: string;
}

// Nos identificamos tal cual. Algunos sitios bloquean agentes que no son un
// navegador; en ese caso el análisis lo reporta en vez de disfrazarse.
const USER_AGENT =
  "Mozilla/5.0 (compatible; EmberLabSiteAudit/1.0; +https://emberlab.mx)";

function assertAllowedUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SafeFetchError("invalid_url", "Solo se permiten direcciones http o https.");
  }
  if (url.username || url.password) {
    throw new SafeFetchError("invalid_url", "La dirección no puede incluir usuario o contraseña.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new SafeFetchError("invalid_url", "Solo se permiten los puertos 80 y 443.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isBlockedAddress(host)) {
    throw new SafeFetchError("blocked_address", "La dirección apunta a una red privada o reservada.");
  }
}

/**
 * `lookup` del socket: resuelve y rechaza si alguna IP es privada. Si un
 * dominio resuelve a varias IPs y una sola es interna, se rechaza entero.
 */
const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "", 4);
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0) {
      return callback(new SafeFetchError("dns_failed", "El dominio no tiene direcciones."), "", 4);
    }
    if (list.some((a) => isBlockedAddress(a.address))) {
      return callback(
        new SafeFetchError("blocked_address", "El dominio resuelve a una red privada o reservada."),
        "",
        4
      );
    }
    // Node pide `all: true` cuando usa autoSelectFamily; en ese caso espera el
    // arreglo completo, si no, una sola dirección.
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

function decompress(res: IncomingMessage): Readable {
  switch ((res.headers["content-encoding"] ?? "").toLowerCase()) {
    case "gzip":
    case "x-gzip":
      return res.pipe(zlib.createGunzip());
    case "deflate":
      return res.pipe(zlib.createInflate());
    case "br":
      return res.pipe(zlib.createBrotliDecompress());
    default:
      return res;
  }
}

function requestOnce(
  url: URL,
  accept: string,
  signal: AbortSignal
): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(url, {
      method: "GET",
      lookup: safeLookup,
      signal,
      headers: {
        "user-agent": USER_AGENT,
        accept,
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "es-MX,es;q=0.9,en;q=0.5",
      },
    });
    req.on("response", resolve);
    req.on("error", reject);
    req.end();
  });
}

function readBody(
  res: IncomingMessage,
  maxBytes: number
): Promise<{ body: Buffer; truncated: boolean }> {
  return new Promise((resolve, reject) => {
    const stream = decompress(res);
    const chunks: Buffer[] = [];
    let size = 0;
    let done = false;

    const finish = (truncated: boolean) => {
      if (done) return;
      done = true;
      resolve({ body: Buffer.concat(chunks), truncated });
    };

    stream.on("data", (chunk: Buffer) => {
      if (done) return;
      const room = maxBytes - size;
      if (chunk.length >= room) {
        chunks.push(chunk.subarray(0, room));
        size = maxBytes;
        // Lo que ya llegó sirve (el <head> va al principio); cortamos el resto.
        res.destroy();
        stream.destroy();
        finish(true);
        return;
      }
      chunks.push(chunk);
      size += chunk.length;
    });
    stream.on("end", () => finish(false));
    stream.on("error", (err) => {
      if (done) return;
      done = true;
      reject(err);
    });
  });
}

function toSafeError(err: unknown, signal: AbortSignal): SafeFetchError {
  if (err instanceof SafeFetchError) return err;
  if (signal.aborted) {
    return new SafeFetchError("timeout", "El sitio tardó demasiado en responder.");
  }
  const code = (err as NodeJS.ErrnoException)?.code;
  // El error de nuestro lookup puede llegar envuelto por el socket.
  const cause = (err as { cause?: unknown })?.cause;
  if (cause instanceof SafeFetchError) return cause;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return new SafeFetchError("dns_failed", "No se encontró el dominio. ¿Está bien escrita la dirección?");
  }
  return new SafeFetchError("connection_failed", "No se pudo establecer conexión con el sitio.");
}

export async function safeFetch(
  input: string | URL,
  {
    timeoutMs = 10_000,
    maxBytes = 2 * 1024 * 1024,
    maxRedirects = 5,
    accept = "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
  }: SafeFetchOptions = {}
): Promise<SafeResponse> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new SafeFetchError("invalid_url", "La dirección no es válida.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const redirects: string[] = [];

  try {
    for (let hop = 0; ; hop++) {
      assertAllowedUrl(url);

      let res: IncomingMessage;
      try {
        res = await requestOnce(url, accept, controller.signal);
      } catch (err) {
        throw toSafeError(err, controller.signal);
      }

      const status = res.statusCode ?? 0;
      const location = res.headers.location;
      if (status >= 300 && status < 400 && location) {
        res.resume(); // descartar el cuerpo del redirect
        if (hop >= maxRedirects) {
          throw new SafeFetchError("too_many_redirects", "El sitio redirige demasiadas veces.");
        }
        redirects.push(url.href);
        try {
          url = new URL(location, url);
        } catch {
          throw new SafeFetchError("invalid_url", "El sitio redirige a una dirección inválida.");
        }
        continue;
      }

      let read: { body: Buffer; truncated: boolean };
      try {
        read = await readBody(res, maxBytes);
      } catch (err) {
        throw toSafeError(err, controller.signal);
      }

      return {
        finalUrl: url.href,
        status,
        headers: res.headers,
        body: read.body,
        truncated: read.truncated,
        redirects,
      };
    }
  } finally {
    clearTimeout(timer);
  }
}

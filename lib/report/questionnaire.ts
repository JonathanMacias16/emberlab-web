import { normalizeInputUrl } from "@/lib/audit/analyzeSite";
import type { Message } from "@/components/chat/types";

/**
 * Las respuestas del chat, campo por campo. Lo que no se encontró queda en
 * `null` y el prompt lo recibe como "sin respuesta": no se adivina.
 */
export interface Questionnaire {
  nombre: string | null;
  sitio: string | null;
  giro: string | null;
  objetivo: string | null;
  clienteIdeal: string | null;
  accionesMarketing: string | null;
  reto: string | null;
  quiereMejorar: string | null;
  email: string | null;
}

type TextField = Exclude<keyof Questionnaire, "sitio" | "email">;

/**
 * Cómo reconocer cada pregunta en los mensajes del asistente. El flujo del chat
 * (`/api/chat`) es fijo, pero el modelo parafrasea algunas preguntas y a veces
 * las junta con un acuse ("Entiendo tu objetivo. ¿Quién es tu cliente ideal?"),
 * así que manda la coincidencia que aparece más tarde en el mensaje.
 */
const QUESTIONS: Array<[TextField, RegExp]> = [
  ["nombre", /c[oó]mo te llamas|tu nombre/i],
  ["giro", /a qu[eé] se dedica/i],
  ["objetivo", /\bobjetivo\b|\bmeta principal\b/i],
  ["clienteIdeal", /cliente ideal/i],
  ["accionesMarketing", /\bmarketing\b|publicidad/i],
  ["reto", /\breto\b|desaf[ií]o/i],
  ["quiereMejorar", /mejorar una sola cosa/i],
];

function questionIn(text: string): TextField | null {
  let best: { field: TextField; at: number } | null = null;
  for (const [field, pattern] of QUESTIONS) {
    const match = pattern.exec(text);
    if (match && (!best || match.index > best.at)) best = { field, at: match.index };
  }
  return best?.field ?? null;
}

/** "Me llamo Rocío" → "Rocío". */
function cleanName(answer: string): string {
  return answer
    .replace(/^(hola[,!.]?\s*)?(me llamo|mi nombre es|soy)\s+/i, "")
    .replace(/[.!]+$/, "")
    .trim();
}

const EMAIL = /[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}/gi;

/** El último correo que escribió el prospecto: si lo corrigió, ese es el bueno. */
export function findEmailInMessages(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const found = messages[i].content.match(EMAIL);
    if (found) return found[found.length - 1].replace(/[.]+$/, "").toLowerCase();
  }
  return null;
}

/**
 * Forma de dominio, para leer prosa sin falsos positivos: la última etiqueta
 * tiene que ser un TLD de letras. Así "3.5" o "1.2" se quedan fuera.
 */
const DOMAIN_SHAPE = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:[/?#].*)?$/i;

/**
 * Busca la dirección que el prospecto escribió en la conversación. Se recorre
 * al revés porque si corrigió la URL, la última es la buena.
 *
 * El filtro del arroba no es cosmético: la conversación termina pidiendo el
 * correo, y "hola@susitio.com" se parsea como una URL válida con "hola" de
 * usuario. Sin esto el reporte analizaría el correo en vez del sitio.
 */
export function findUrlInMessages(messages: Message[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== "user") continue;
    for (const raw of message.content.split(/[\s,;()<>"']+/)) {
      if (raw.includes("@")) continue;
      // La dirección suele venir al final de una frase: "es tusitio.com."
      const token = raw.replace(/[.,;:!?)\]]+$/, "");
      if (!DOMAIN_SHAPE.test(token)) continue;
      const parsed = normalizeInputUrl(token);
      if (parsed && !parsed.url.username && !parsed.url.password) return parsed.url.href;
    }
  }
  return null;
}

/**
 * Empareja cada pregunta del asistente con la respuesta que le sigue. Si una
 * pregunta se repite (el prospecto corrigió algo), gana la última respuesta.
 */
export function extractQuestionnaire(messages: Message[]): Questionnaire {
  const answers: Partial<Record<TextField, string>> = {};

  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role !== "assistant" || messages[i + 1].role !== "user") continue;
    const field = questionIn(messages[i].content);
    const answer = messages[i + 1].content.trim();
    if (field && answer) answers[field] = answer;
  }

  return {
    nombre: answers.nombre ? cleanName(answers.nombre) || null : null,
    sitio: findUrlInMessages(messages),
    giro: answers.giro ?? null,
    objetivo: answers.objetivo ?? null,
    clienteIdeal: answers.clienteIdeal ?? null,
    accionesMarketing: answers.accionesMarketing ?? null,
    reto: answers.reto ?? null,
    quiereMejorar: answers.quiereMejorar ?? null,
    email: findEmailInMessages(messages),
  };
}

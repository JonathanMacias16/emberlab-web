/**
 * Horarios de la llamada de 20 minutos. Todo se calcula en hora del centro de
 * México (sin horario de verano desde 2022, siempre UTC-6), sin importar la
 * zona del navegador: el equipo atiende en esa hora y así se lo mostramos al
 * prospecto.
 */

export const AGENDA_TZ = "America/Mexico_City";
const UTC_OFFSET = "-06:00";

/** Horas de inicio que ofrecemos cada día hábil. */
export const SLOT_TIMES = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
] as const;

/** Días hábiles que se muestran para elegir. */
export const BUSINESS_DAYS = 5;

/** Un horario de hoy se ofrece solo si falta al menos este tiempo. */
const MIN_LEAD_MINUTES = 120;

export interface AgendaDay {
  /** Fecha en hora de México, `YYYY-MM-DD`. */
  date: string;
  /** "Hoy", "Mañana" o el día de la semana. */
  label: string;
  /** "mié". */
  weekday: string;
  /** "4 nov". */
  short: string;
  /** Horarios disponibles, `HH:mm`. */
  times: string[];
}

/** Fecha y hora actuales en México, como `YYYY-MM-DDTHH:mm`. */
export function nowInMexico(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: AGENDA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Los próximos días hábiles con horario libre, a partir de `nowKey`
 * (`nowInMexico()`). Hoy cuenta si todavía le queda algún horario.
 */
export function upcomingDays(nowKey: string, count = BUSINESS_DAYS): AgendaDay[] {
  const [today, nowTime] = nowKey.split("T");
  const nowMin = toMinutes(nowTime);
  // Mediodía UTC: sumar días nunca cruza de fecha por la zona.
  const cursor = new Date(`${today}T12:00:00Z`);
  const days: AgendaDay[] = [];

  for (let offset = 0; days.length < count && offset < 14; offset++) {
    const weekday = cursor.getUTCDay();
    const date = cursor.toISOString().slice(0, 10);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (weekday === 0 || weekday === 6) continue;

    const times =
      offset === 0
        ? SLOT_TIMES.filter((t) => toMinutes(t) - nowMin >= MIN_LEAD_MINUTES)
        : [...SLOT_TIMES];
    if (times.length === 0) continue;

    days.push({ date, label: dayLabel(date, offset), weekday: shortWeekday(date), short: shortDate(date), times });
  }
  return days;
}

function dayLabel(date: string, offset: number): string {
  if (offset === 0) return "Hoy";
  if (offset === 1) return "Mañana";
  const name = new Intl.DateTimeFormat("es-MX", { weekday: "long", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function shortWeekday(date: string): string {
  return new Intl.DateTimeFormat("es-MX", { weekday: "short", timeZone: "UTC" })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(".", "");
}

function shortDate(date: string): string {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(".", "");
}

/** Inicio de la cita como ISO con la zona de México: `2026-11-04T10:00:00-06:00`. */
export function slotIso(date: string, time: string): string {
  return `${date}T${time}:00${UTC_OFFSET}`;
}

/** "miércoles 4 de noviembre, 10:00 a. m." en hora de México. */
export function formatSlot(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: AGENDA_TZ,
  }).format(d);
  const time = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: AGENDA_TZ,
  }).format(d);
  return `${day}, ${time}`;
}

/** "16:30" → "4:30 p.m.", para los botones de horario. */
export function formatTime(time: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: AGENDA_TZ,
  }).format(new Date(slotIso("2026-01-05", time)));
}

/** Cita que manda el formulario a `/api/agenda`. */
export interface AgendaRequest {
  slot: string;
  name: string;
  business: string;
  email: string;
  whatsapp: string;
  website?: string;
}

/**
 * ¿El horario es uno de los que ofrecemos, en día hábil, futuro y dentro de
 * las próximas dos semanas? Sin el margen de dos horas de `upcomingDays`: quien
 * eligió justo antes del corte no debe ver un error.
 */
export function isValidSlot(iso: string, now = new Date()): boolean {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}):00-06:00$/.exec(iso);
  if (!match) return false;
  const [, date, time] = match;
  if (!(SLOT_TIMES as readonly string[]).includes(time)) return false;
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (weekday === 0 || weekday === 6) return false;
  const start = new Date(iso).getTime();
  return start > now.getTime() && start - now.getTime() < 14 * 24 * 60 * 60 * 1000;
}

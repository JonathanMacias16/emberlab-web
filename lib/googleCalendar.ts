/**
 * Google Calendar para la agenda de 20 minutos: horarios ocupados y alta de
 * citas en el calendario de Ember Lab (la cuenta que autorizó el refresh token).
 *
 * Se autentica con un refresh token de OAuth de esa cuenta (sirve igual para
 * Google Workspace que para Gmail). Variables en Vercel:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 *   AGENDA_CALENDAR_ID (opcional, por defecto "primary")
 * Sin ellas `calendarConfigured()` es false y la agenda solo registra la cita
 * en los logs, para que los previews sigan funcionando.
 */

import type { BusyRange } from "@/lib/agenda";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/calendar/v3";

export function calendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

function calendarId(): string {
  return process.env.AGENDA_CALENDAR_ID || "primary";
}

let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Google OAuth respondió ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function google<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Google Calendar respondió ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/** Rangos ocupados del calendario entre dos instantes. */
export async function busyRanges(timeMin: Date, timeMax: Date): Promise<BusyRange[]> {
  const id = calendarId();
  const data = await google<{
    calendars: Record<string, { busy?: BusyRange[]; errors?: unknown[] }>;
  }>("/freeBusy", {
    method: "POST",
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id }],
    }),
  });
  const cal = data.calendars[id] ?? Object.values(data.calendars)[0];
  if (cal?.errors?.length) {
    throw new Error(`Google Calendar no pudo leer el calendario: ${JSON.stringify(cal.errors)}`);
  }
  return cal?.busy ?? [];
}

export interface NewEvent {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  attendeeEmail: string;
  attendeeName: string;
  /** Id estable para que un reintento no duplique la cita. */
  requestId: string;
}

/**
 * Crea la cita con enlace de Google Meet e invita al prospecto. Google le
 * manda la invitación por correo (`sendUpdates=all`).
 */
export async function createEvent(ev: NewEvent): Promise<{ id: string; htmlLink: string; meetLink?: string }> {
  const data = await google<{
    id: string;
    htmlLink: string;
    hangoutLink?: string;
  }>(
    `/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      body: JSON.stringify({
        summary: ev.summary,
        description: ev.description,
        start: { dateTime: ev.start.toISOString(), timeZone: "America/Mexico_City" },
        end: { dateTime: ev.end.toISOString(), timeZone: "America/Mexico_City" },
        attendees: [{ email: ev.attendeeEmail, displayName: ev.attendeeName }],
        conferenceData: {
          createRequest: {
            requestId: ev.requestId,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 10 },
          ],
        },
      }),
    },
  );
  return { id: data.id, htmlLink: data.htmlLink, meetLink: data.hangoutLink };
}

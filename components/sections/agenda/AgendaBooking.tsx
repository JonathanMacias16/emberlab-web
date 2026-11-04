"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { trackCustomEvent, trackEvent } from "@/lib/analytics";
import {
  formatSlot,
  formatTime,
  nowInMexico,
  slotIso,
  upcomingDays,
  type AgendaRequest,
} from "@/lib/agenda";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// La hora actual solo existe en el navegador: en el servidor no se pintan
// horarios, así no hay desajuste de hidratación ni horarios de otro día en caché.
const noopSubscribe = () => () => {};
const getNowKey = () => nowInMexico().slice(0, 15); // cambia cada 10 min
const getServerNowKey = () => null;

type Field = "name" | "business" | "email" | "whatsapp" | "website";

const FIELDS: { id: Field; label: string; type: string; placeholder: string; required: boolean; autoComplete: string }[] = [
  { id: "name", label: "Tu nombre", type: "text", placeholder: "Ana López", required: true, autoComplete: "name" },
  { id: "business", label: "Tu negocio", type: "text", placeholder: "Nombre de tu empresa", required: true, autoComplete: "organization" },
  { id: "email", label: "Correo", type: "email", placeholder: "ana@tunegocio.com", required: true, autoComplete: "email" },
  { id: "whatsapp", label: "WhatsApp", type: "tel", placeholder: "442 123 4567", required: true, autoComplete: "tel" },
  { id: "website", label: "Tu sitio actual (opcional)", type: "url", placeholder: "tunegocio.com", required: false, autoComplete: "url" },
];

/**
 * Agenda de la llamada de 20 minutos, en dos pasos: día y hora, luego datos
 * de contacto. Al confirmar manda la cita a `/api/agenda`, dispara `Schedule`
 * y navega a `/agenda/gracias` (la conversión se mide por URL, igual que el brief).
 */
export default function AgendaBooking() {
  const router = useRouter();
  const nowKey = useSyncExternalStore(noopSubscribe, getNowKey, getServerNowKey);
  const days = nowKey ? upcomingDays(`${nowKey}0`) : [];

  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState<"slot" | "contact">("slot");
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    business: "",
    email: "",
    whatsapp: "",
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const day = days[Math.min(dayIndex, days.length - 1)];
  const slot = day && time ? slotIso(day.date, time) : null;

  function pickDay(i: number) {
    setDayIndex(i);
    setTime(null);
  }

  function continueToContact() {
    if (!slot) return;
    trackCustomEvent("AgendaHorarioElegido", { content_name: "Agenda 20 min", slot });
    setStep("contact");
  }

  function validate(): boolean {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = "Escribe tu nombre.";
    if (!values.business.trim()) next.business = "¿Cómo se llama tu negocio?";
    if (!EMAIL_RE.test(values.email.trim())) next.email = "Revisa tu correo.";
    if (values.whatsapp.replace(/\D/g, "").length < 10) next.whatsapp = "Escribe tu número a 10 dígitos.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot || sending || !validate()) return;
    setSending(true);
    setSendError(null);

    const body: AgendaRequest = {
      slot,
      name: values.name.trim(),
      business: values.business.trim(),
      email: values.email.trim(),
      whatsapp: values.whatsapp.trim(),
      website: values.website.trim() || undefined,
    };

    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "No pudimos agendar tu llamada.");
      }
    } catch (err) {
      setSending(false);
      setSendError(err instanceof Error ? err.message : "No pudimos agendar tu llamada.");
      return;
    }

    // Evento estándar de Meta para citas. Aquí y no en la página de gracias:
    // recargar ese link no debe contar como conversión.
    trackEvent("Schedule", { content_name: "Agenda 20 min" });
    // TODO: falta crear la acción de conversión "Agenda 20 min" en Google Ads
    // y agregar su `send_to` a ADS_CONVERSIONS para llamar trackAdsConversion aquí.

    router.push(`/agenda/gracias?cita=${encodeURIComponent(slot)}`);
  }

  return (
    <div className="w-full rounded-3xl bg-(--white) text-(--purple) p-5 sm:p-7 md:p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
      {/* Pasos */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[-0.02em]">
        <span className={step === "slot" ? "text-(--red)" : "text-(--purple-mid)"}>1. Día y hora</span>
        <span className="h-px w-6 bg-(--purple-pale)" aria-hidden />
        <span className={step === "contact" ? "text-(--red)" : "text-(--purple-mid)"}>2. Tus datos</span>
      </div>

      {step === "slot" && (
        <div className="mt-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em] leading-[1.05]">
            Elige un día
          </h2>

          {!nowKey ? (
            <div className="mt-4 h-[19rem] rounded-2xl bg-(--purple-pale)/20 animate-pulse" aria-label="Cargando horarios" />
          ) : (
            <>
              <div role="radiogroup" aria-label="Día" className="mt-4 grid grid-cols-5 gap-2">
                {days.map((d, i) => {
                  const selected = i === dayIndex;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickDay(i)}
                      className={`flex flex-col items-center rounded-2xl px-1 py-3 transition-colors cursor-pointer border ${
                        selected
                          ? "bg-(--purple) border-(--purple) text-(--white)"
                          : "border-(--purple-pale) hover:border-(--purple-soft)"
                      }`}
                    >
                      <span className="text-[0.7rem] sm:text-xs font-bold uppercase tracking-wide">
                        {d.weekday}
                      </span>
                      <span className="mt-1 text-sm sm:text-base font-light whitespace-nowrap">{d.short}</span>
                    </button>
                  );
                })}
              </div>

              <h3 className="mt-6 text-base sm:text-lg font-bold tracking-[-0.03em]">
                {day?.label} · elige la hora
              </h3>
              <div role="radiogroup" aria-label="Hora" className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {day?.times.map((t) => {
                  const selected = t === time;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setTime(t)}
                      className={`rounded-xl py-2.5 text-sm sm:text-base transition-colors cursor-pointer border ${
                        selected
                          ? "bg-(--red) border-(--red) text-(--white) font-bold"
                          : "border-(--purple-pale) hover:border-(--red)"
                      }`}
                    >
                      {formatTime(t)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs sm:text-sm text-(--purple-mid)">Hora del centro de México.</p>
            </>
          )}

          <button
            type="button"
            onClick={continueToContact}
            disabled={!slot}
            className="mt-6 w-full bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-7 py-4 text-base sm:text-lg font-bold tracking-[-0.03em] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
          >
            {slot ? `Continuar con ${formatSlot(slot)}` : "Elige un horario"}
          </button>
        </div>
      )}

      {step === "contact" && slot && (
        <form onSubmit={submit} noValidate className="mt-5">
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-(--green-light) px-4 py-3">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wide text-(--purple-soft)">Tu llamada</p>
              <p className="text-base sm:text-lg font-bold tracking-[-0.03em] first-letter:uppercase">
                {formatSlot(slot)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("slot")}
              className="shrink-0 text-sm font-bold text-(--purple) underline underline-offset-4 hover:text-(--red) cursor-pointer"
            >
              Cambiar
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {FIELDS.map((f) => (
              <label key={f.id} className="flex flex-col gap-1.5">
                <span className="text-sm font-bold tracking-[-0.02em]">{f.label}</span>
                <input
                  type={f.type}
                  name={f.id}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  value={values[f.id]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.id]: e.target.value }));
                    if (errors[f.id]) setErrors((er) => ({ ...er, [f.id]: undefined }));
                  }}
                  placeholder={f.placeholder}
                  aria-invalid={Boolean(errors[f.id])}
                  className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-base sm:text-lg outline-none transition-colors placeholder:text-(--purple-pale) focus:border-(--red) ${
                    errors[f.id] ? "border-(--red)" : "border-(--purple-pale)"
                  }`}
                />
                {errors[f.id] && <span className="text-sm text-(--red)">{errors[f.id]}</span>}
              </label>
            ))}
          </div>

          {sendError && (
            <p role="alert" className="mt-4 text-sm text-(--red)">
              {sendError}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-6 w-full bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-7 py-4 text-base sm:text-lg font-bold tracking-[-0.03em] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {sending ? "Agendando…" : "Confirmar mi llamada"}
          </button>
          <p className="mt-3 text-xs sm:text-sm text-center text-(--purple-mid)">
            Te confirmamos la cita antes de la llamada.
          </p>
        </form>
      )}
    </div>
  );
}

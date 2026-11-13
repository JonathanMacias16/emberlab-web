"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { LEAD_NEEDS, validateLead, type ContactLeadRequest, type LeadNeed } from "@/lib/contactLead";

type Field = "name" | "whatsapp" | "email" | "business";

const INPUT =
  "w-full rounded-xl border bg-white/60 px-4 py-3 text-base sm:text-lg text-(--purple) outline-none transition-colors placeholder:text-(--purple-pale) focus:border-(--red)";

/**
 * "Hablemos de tu proyecto": el formulario del banner de `/hablemos`, como en
 * el Figma ("LANDING WEB TRES"). Manda los datos a `/api/contacto`, dispara
 * `Lead` y navega a `/hablemos/gracias` (la conversión se mide por URL).
 */
export default function LeadForm() {
  const router = useRouter();
  const [values, setValues] = useState<Record<Field, string>>({ name: "", whatsapp: "", email: "", business: "" });
  const [need, setNeed] = useState<LeadNeed | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactLeadRequest, string>>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  function set(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const lead: Partial<ContactLeadRequest> = {
      name: values.name.trim(),
      whatsapp: values.whatsapp.trim(),
      email: values.email.trim(),
      need: need ?? undefined,
      business: values.business.trim(),
    };
    const found = validateLead(lead);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "No pudimos enviar tus datos.");
      }
    } catch (err) {
      setSending(false);
      setSendError(err instanceof Error ? err.message : "No pudimos enviar tus datos.");
      return;
    }

    // Aquí y no en la página de gracias: recargar ese link no debe contar.
    trackEvent("Lead", { content_name: "Formulario Hablemos", need: lead.need });
    // TODO: crear la acción de conversión "Formulario Hablemos" en Google Ads y
    // agregar su `send_to` a ADS_CONVERSIONS para llamar trackAdsConversion aquí.
    router.push("/hablemos/gracias");
  }

  const label = "text-sm font-bold tracking-[-0.02em] text-(--purple)";
  const error = (field: keyof ContactLeadRequest) =>
    errors[field] ? <span className="text-sm text-(--red)">{errors[field]}</span> : null;
  const border = (field: keyof ContactLeadRequest) => (errors[field] ? "border-(--red)" : "border-(--purple-pale)");

  return (
    <form
      onSubmit={submit}
      noValidate
      className="w-full rounded-3xl bg-(--white) p-5 sm:p-7 md:p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em] leading-[1.05] text-(--purple)">
          Hablemos de tu proyecto
        </h2>
        <span className="shrink-0 text-xs sm:text-sm text-(--purple-soft)">5 datos</span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={label}>1. Nombre</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Tu nombre"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={`${INPUT} ${border("name")}`}
          />
          {error("name")}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>2. WhatsApp</span>
          <input
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            placeholder="10 dígitos"
            value={values.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            aria-invalid={Boolean(errors.whatsapp)}
            className={`${INPUT} ${border("whatsapp")}`}
          />
          {error("whatsapp")}
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className={label}>3. Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          className={`${INPUT} ${border("email")}`}
        />
        {error("email")}
      </label>

      <fieldset className="mt-4">
        <legend className={label}>4. ¿Qué necesitas?</legend>
        <div role="radiogroup" aria-label="¿Qué necesitas?" className="mt-2 flex flex-wrap gap-2">
          {LEAD_NEEDS.map((option) => {
            const selected = option === need;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setNeed(option);
                  if (errors.need) setErrors((er) => ({ ...er, need: undefined }));
                }}
                className={`rounded-full border px-4 py-2 text-sm sm:text-base tracking-[-0.02em] transition-colors cursor-pointer ${
                  selected
                    ? "bg-(--purple) border-(--purple) text-(--white)"
                    : "border-(--purple-pale) text-(--purple) hover:border-(--purple-soft)"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {errors.need && <p className="mt-1.5 text-sm text-(--red)">{errors.need}</p>}
      </fieldset>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className={label}>5. Tu negocio o sitio web</span>
        <input
          type="text"
          name="business"
          autoComplete="organization"
          placeholder="Nombre o link, si ya tienes"
          value={values.business}
          onChange={(e) => set("business", e.target.value)}
          aria-invalid={Boolean(errors.business)}
          className={`${INPUT} ${border("business")}`}
        />
        {error("business")}
      </label>

      {sendError && (
        <p role="alert" className="mt-4 text-sm text-(--red)">
          {sendError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 w-full bg-(--red) hover:brightness-110 text-(--white) rounded-xl px-7 py-4 text-base sm:text-lg font-bold tracking-[-0.03em] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {sending ? "Enviando…" : "Quiero que me contacten →"}
      </button>
      <p className="mt-3 text-xs sm:text-sm text-(--purple-soft)">Usamos tus datos solo para contactarte.</p>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";
import { formatSlot } from "@/lib/agenda";

export const metadata: Metadata = {
  title: "Tu llamada está agendada — EmberLab",
  description: "Recibimos tu cita. Te confirmamos antes de la llamada.",
  // Solo se llega aquí al agendar: no tiene caso indexarla.
  robots: { index: false, follow: false },
};

/**
 * Cierre de la agenda con URL propia, para medir la cita agendada por URL en
 * Meta y Google Ads (igual que `/brief-web/gracias`).
 */
export default async function AgendaThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ cita?: string }>;
}) {
  const { cita } = await searchParams;
  const when = cita ? formatSlot(cita) : "";

  return (
    <main className="min-h-screen w-full bg-(--purple) flex flex-col font-dm">
      <div className="px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        <Link href="/landing" aria-label="Volver a EmberLab" className="inline-flex">
          <LogoIcon className="w-8 h-8" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 md:px-12 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          <div
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-6"
            style={{ backgroundColor: "rgba(199,221,163,0.15)", border: "1px solid var(--green-light)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--green-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-(--green-light) text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.04em] leading-[1.05]">
            Listo, tu llamada está agendada.
          </h1>
          {when && (
            <p className="text-(--white) text-xl sm:text-2xl mt-4 font-bold tracking-[-0.03em] first-letter:uppercase">
              {when} <span className="font-light text-(--purple-light)">(hora del centro de México)</span>
            </p>
          )}
          <p className="text-(--white) text-base sm:text-lg mt-3 font-light">
            Te confirmamos la cita y te mandamos el enlace de la videollamada antes de la hora. Si
            necesitas cambiarla, escríbenos por WhatsApp.
          </p>
        </div>
      </div>
    </main>
  );
}

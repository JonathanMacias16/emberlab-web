import type { Metadata } from "next";
import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";

export const metadata: Metadata = {
  title: "Recibimos tus datos — EmberLab",
  description: "Recibimos tus datos. Te escribimos por WhatsApp en menos de 24 h hábiles.",
  // Solo se llega aquí al mandar el formulario: no tiene caso indexarla.
  robots: { index: false, follow: false },
};

/**
 * Cierre del formulario de `/hablemos` con URL propia, para medir el lead por
 * URL en Meta y Google Ads (igual que `/brief-web/gracias`).
 */
export default function HablemosThanksPage() {
  return (
    <main className="min-h-screen w-full bg-(--purple) flex flex-col font-dm">
      <div className="px-5 sm:px-8 md:px-12 py-5 sm:py-6">
        <Link href="/hablemos" aria-label="Volver a EmberLab" className="inline-flex">
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
            Listo, recibimos tus datos.
          </h1>
          <p className="text-(--white) text-base sm:text-lg mt-3 font-light">
            Te escribimos por WhatsApp en menos de 24 horas hábiles para entender tu proyecto y
            decirte qué tipo de sitio te conviene.
          </p>
        </div>
      </div>
    </main>
  );
}

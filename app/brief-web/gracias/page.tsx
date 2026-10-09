import type { Metadata } from "next";
import BriefHeader from "@/components/ui/BriefHeader";

export const metadata: Metadata = {
  title: "Gracias — EmberLab",
  description: "Recibimos tus respuestas. Te contactaremos pronto.",
  // Solo se llega aquí al terminar el brief: no tiene caso indexarla.
  robots: { index: false, follow: false },
};

/**
 * Cierre del brief con URL propia, para que Meta y Google Ads puedan medir el
 * brief completado por URL. El formulario navega aquí después de enviar las
 * respuestas y disparar `Lead`.
 */
export default function BriefThanksPage() {
  return (
    <main className="min-h-screen w-full bg-(--purple) flex flex-col">
      <BriefHeader progress={100} done />

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 md:px-12 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          {/* Palomita en verde: el mismo acento afirmativo que usa la marca, para que
              se lea de inmediato que el formulario ya terminó. */}
          <div
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(199,221,163,0.15)",
              border: "1px solid var(--green-light)",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--green-light)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-(--green-light) text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.04em] leading-[1.05]">
            Gracias por compartirnos esta información.
          </h1>
          <p className="text-(--white) text-base sm:text-lg mt-3 font-light">
            Con tus respuestas revisaremos en qué etapa se encuentra tu proyecto
            y te contactaremos para recomendarte el mejor camino para tu sitio
            web.
          </p>
        </div>
      </div>
    </main>
  );
}

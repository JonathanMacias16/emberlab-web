import type { Metadata } from "next";
import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";
import EmberText from "@/components/ui/EmberText";
import LabText from "@/components/ui/LabText";
import SectionTitle, { TITLE_SIZE } from "@/components/ui/SectionTitle";
import LandingFooter from "@/components/sections/landing/LandingFooter";
import AgendaBooking from "@/components/sections/agenda/AgendaBooking";
import WhatsAppBubble from "@/components/ui/WhatsAppBubble";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/animations";
import {
  CONTAINER,
  SECTION_Y,
  TEXT_BODY,
  TEXT_LEAD,
  GAP_TITLE,
} from "@/components/sections/landing/styles";
import { defaultLandingWebData as footer } from "@/sanity/lib/landing-web-defaults";

export const metadata: Metadata = {
  title: "Agenda 20 minutos con un especialista | EmberLab",
  description:
    "Elige día y hora. En 20 minutos revisamos tu sitio o tu idea y te decimos qué te conviene hacer, sin compromiso.",
  alternates: { canonical: "https://tuweb.emberlab.mx/agenda" },
};

const STEPS = [
  {
    number: "01",
    title: "Entendemos tu negocio",
    description: "Nos cuentas qué vendes, a quién y qué esperas de tu sitio web.",
  },
  {
    number: "02",
    title: "Revisamos lo que tienes",
    description: "Si ya tienes sitio, lo vemos juntos en pantalla. Si no, aterrizamos tu idea.",
  },
  {
    number: "03",
    title: "Te llevas un siguiente paso",
    description: "Sales con una recomendación clara de qué hacer, la hagas con nosotros o no.",
  },
];

export default function AgendaPage() {
  return (
    <div id="top" className="min-h-screen w-full bg-(--white) font-dm">
      <header className="bg-(--white)">
        <div className={`${CONTAINER} py-4 sm:py-6 lg:py-8`}>
          <Link href="/landing" aria-label="EmberLab — inicio" className="inline-flex items-center gap-2 sm:gap-3">
            <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden />
            <div className="flex gap-1 items-center">
              <EmberText className="h-5 sm:h-6 w-auto" aria-hidden />
              <LabText className="h-5 sm:h-6 w-auto" />
            </div>
          </Link>
        </div>
      </header>

      {/* Hero + agenda: el selector va arriba del pliegue, es la acción de la página. */}
      <section className="bg-(--purple) pt-8 sm:pt-10 pb-16 sm:pb-20 lg:pb-28">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,34rem)] gap-10 lg:gap-16 items-start`}>
          <div className="pt-4 sm:pt-8 lg:pt-16">
            <SlideIn from="left">
              <SectionTitle as="h1" className="text-(--white)">
                Agenda 20 minutos con un especialista
              </SectionTitle>
            </SlideIn>
            <FadeIn direction="up">
              <p
                className={`mt-5 sm:mt-7 text-(--green-light) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
              >
                Elige el día y la hora que te queden. Revisamos tu sitio o tu idea y te decimos qué te conviene hacer.
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <ul className={`mt-6 sm:mt-8 flex flex-col gap-2 text-(--purple-light) font-light tracking-[-0.04em] ${TEXT_BODY}`}>
                <li>· Videollamada de 20 minutos</li>
                <li>· Sin costo y sin compromiso</li>
                <li>· Con alguien del equipo que diseña y programa</li>
              </ul>
            </FadeIn>
          </div>

          <div id="agendar" className="scroll-mt-6">
            <AgendaBooking />
          </div>
        </div>
      </section>

      <section className={`bg-(--green-light) ${SECTION_Y}`}>
        <div className={CONTAINER}>
          <FadeIn direction="up">
            <SectionTitle className="text-(--purple)">¿Qué pasa en esos 20 minutos?</SectionTitle>
          </FadeIn>
          <StaggerContainer className={`${GAP_TITLE} grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10`}>
            {STEPS.map((step) => (
              <StaggerItem key={step.number}>
                <div className="max-w-[24rem]">
                  <p className={`text-(--purple-soft) font-bold tracking-[-0.04em] leading-[0.85] ${TITLE_SIZE}`}>
                    {step.number}
                  </p>
                  <h3 className={`mt-4 sm:mt-6 text-(--purple) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}>
                    {step.title}
                  </h3>
                  <p className={`text-(--purple-soft) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}>
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className={`bg-(--white) ${SECTION_Y}`}>
        <div className={`${CONTAINER} text-center`}>
          <FadeIn direction="up">
            <SectionTitle className="text-(--red)">No es una llamada de ventas.</SectionTitle>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p
              className={`mx-auto mt-6 sm:mt-8 max-w-[52rem] text-(--purple) font-light tracking-[-0.04em] leading-[1.2] ${TEXT_LEAD}`}
            >
              No hay presentación ni cotización forzada. Es una plática para entender tu caso y darte una
              opinión honesta. Si al final no somos lo que necesitas, también te lo decimos.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <a
              href="#agendar"
              className="mt-8 sm:mt-10 inline-block bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-8 py-4 text-base sm:text-lg font-bold tracking-[-0.03em] transition-all"
            >
              Elegir mi horario
            </a>
          </FadeIn>
        </div>
      </section>

      <LandingFooter
        tagline={footer.footerTagline}
        brandLine1={footer.footerBrandLine1}
        brandLine2={footer.footerBrandLine2}
        copyright={footer.footerCopyright}
      />
      <WhatsAppBubble />
    </div>
  );
}

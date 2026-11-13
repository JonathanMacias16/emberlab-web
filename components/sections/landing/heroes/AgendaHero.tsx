import SectionTitle from "@/components/ui/SectionTitle";
import AgendaBooking from "@/components/sections/agenda/AgendaBooking";
import { SlideIn, FadeIn } from "@/components/animations";
import { HERO_ANCHOR } from "../variants";
import { TEXT_BODY, TEXT_SMALL } from "../styles";
import { TagIcon, ClockIcon, VideoIcon } from "./HeroIcons";

const FACTS = [
  { icon: TagIcon, label: "Sin costo" },
  { icon: ClockIcon, label: "20 minutos" },
  { icon: VideoIcon, label: "Por videollamada" },
];

/**
 * Banner de la landing de agenda (`/mejorar-mi-sitio`), tal cual el Figma
 * ("LANDING WEB CUATRO"). La tarjeta de la derecha es el mismo calendario de
 * `/agenda` (Google Calendar + Meet), sin cambios.
 */
export default function AgendaHero() {
  return (
    <section id="nosotros" className="bg-(--purple)">
      <div className="mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,36rem)] gap-10 lg:gap-16 items-center px-7 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 sm:py-16 md:py-20 lg:py-24">
        <div>
          <FadeIn direction="up">
            <span
              className={`inline-block rounded-full border border-(--green-light) px-4 py-1.5 text-(--green-light) tracking-[-0.02em] ${TEXT_SMALL}`}
            >
              Para negocios que ya tienen sitio web
            </span>
          </FadeIn>

          <SlideIn from="left">
            <SectionTitle as="h1" className="mt-6 sm:mt-8 text-(--white)">
              ¿Ya tienes sitio web y quieres mejorarlo?
            </SectionTitle>
          </SlideIn>

          <FadeIn direction="up">
            <p
              className={`mt-5 sm:mt-7 max-w-[40rem] text-(--green-light) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              Agenda 20 minutos con un especialista de Ember Lab. Revisamos tu sitio contigo y sales con las 3
              mejoras que más impacto tendrían.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <ul className="mt-6 sm:mt-8 flex flex-wrap gap-x-7 gap-y-3 text-(--white) text-base sm:text-lg tracking-[-0.03em]">
              {FACTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="text-(--red-light)">
                    <Icon />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className={`mt-6 sm:mt-8 max-w-[36rem] text-(--purple-light) font-light tracking-[-0.02em] leading-[1.4] ${TEXT_SMALL}`}>
              Confían en nosotros: Pixeron · Carolina Performance Fabrics · Mita Residential · Casa Morgandez ·
              Grizzly Adventure
            </p>
          </FadeIn>
        </div>

        <div id={HERO_ANCHOR.agenda} className="scroll-mt-6">
          <AgendaBooking />
        </div>
      </div>
    </section>
  );
}

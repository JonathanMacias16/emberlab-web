import SectionTitle from "@/components/ui/SectionTitle";
import { SlideIn, FadeIn } from "@/components/animations";
import { HERO_ANCHOR } from "../variants";
import { TEXT_BODY } from "../styles";
import { CheckIcon } from "./HeroIcons";
import LeadForm from "./LeadForm";

const PROMISES = [
  "Toma 30 segundos",
  "Te respondemos en menos de 24 h hábiles",
  "Te decimos qué tipo de proyecto te conviene",
];

/**
 * Banner de la landing de formulario (`/hablemos`), tal cual el Figma
 * ("LANDING WEB TRES").
 */
export default function FormHero() {
  return (
    <section id="nosotros" className="bg-(--purple)">
      <div className="mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,36rem)] gap-10 lg:gap-16 items-center px-7 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 sm:py-16 md:py-20 lg:py-24">
        <div>
          <SlideIn from="left">
            <SectionTitle as="h1" className="text-(--white)">
              Cuéntanos qué necesita tu sitio web.
            </SectionTitle>
          </SlideIn>

          <FadeIn direction="up">
            <p
              className={`mt-5 sm:mt-7 max-w-[36rem] text-(--green-light) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              Déjanos 5 datos y te escribimos por WhatsApp para entender tu proyecto. Sin compromiso.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <ul className="mt-6 sm:mt-8 flex flex-col gap-3 text-(--white) text-base sm:text-lg tracking-[-0.03em]">
              {PROMISES.map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="text-(--green-light)">
                    <CheckIcon />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <div id={HERO_ANCHOR.formulario} className="scroll-mt-6">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

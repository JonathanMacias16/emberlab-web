import LogoIcon from "@/components/ui/LogoIcon";
import ButtonBlock from "@/components/ui/ButtonBlock";
import CreativeWordmark from "@/components/ui/CreativeWordmark";
import { FadeIn, ScaleIn } from "@/components/animations";
import { CONTAINER, SECTION_Y, TEXT_LEAD, GAP_CTA } from "./styles";
import type { CtaButtonData } from "@/types/sanity";

interface LandingIntroProps {
  text?: string;
  cta?: CtaButtonData;
}

export default function LandingIntro({ text, cta }: LandingIntroProps) {
  return (
    <section className={`bg-(--white) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <ScaleIn initialScale={0.6}>
            <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
          </ScaleIn>

          <FadeIn direction="up">
            <p
              className={`mt-8 sm:mt-10 md:mt-12 max-w-[62rem] whitespace-pre-line text-(--purple) font-normal tracking-[-0.05em] leading-[1.1] ${TEXT_LEAD}`}
            >
              {text}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <div className={GAP_CTA}>
              <ButtonBlock cta={cta} />
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="up">
          <CreativeWordmark className="mt-14 sm:mt-16 md:mt-20 lg:mt-24" />
        </FadeIn>
      </div>
    </section>
  );
}

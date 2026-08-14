import SectionTitle from "@/components/ui/SectionTitle";
import ButtonBlock from "@/components/ui/ButtonBlock";
import { FadeIn } from "@/components/animations";
import { CONTAINER, SECTION_Y, TEXT_BODY, GAP_CTA } from "./styles";
import type { CtaButtonData } from "@/types/sanity";

interface TalkToUsProps {
  title?: string;
  description?: string;
  cta?: CtaButtonData;
}

export default function TalkToUs({ title, description, cta }: TalkToUsProps) {
  return (
    <section id="contacto" className={`bg-(--purple-pale) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[56rem]">{title}</SectionTitle>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p
              className={`mt-4 sm:mt-6 md:mt-8 max-w-[44rem] text-(--white) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              {description}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <div className={GAP_CTA}>
              <ButtonBlock cta={cta} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

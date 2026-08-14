import SectionTitle, { TITLE_SIZE } from "@/components/ui/SectionTitle";
import ButtonBlock from "@/components/ui/ButtonBlock";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { CONTAINER, SECTION_Y, TEXT_BODY, GAP_TITLE, GAP_CTA } from "./styles";
import type { CtaButtonData, SimpleStepData } from "@/types/sanity";

interface HowItWorksProps {
  title?: string;
  steps?: SimpleStepData[];
  cta?: CtaButtonData;
}

export default function HowItWorks({ title, steps, cta }: HowItWorksProps) {
  return (
    <section id="proceso" className={`bg-(--green-light) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <FadeIn direction="up">
          <SectionTitle className="text-(--purple)">{title}</SectionTitle>
        </FadeIn>

        <StaggerContainer
          className={`${GAP_TITLE} grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10`}
        >
          {steps?.map((step, i) => (
            <StaggerItem key={i}>
              <div className="max-w-[24rem]">
                {/* El número usa la misma escala que los titulares, como en Figma. */}
                <p
                  className={`text-(--purple-soft) font-bold tracking-[-0.04em] leading-[0.85] ${TITLE_SIZE}`}
                >
                  {step.number}
                </p>
                <h3
                  className={`mt-4 sm:mt-6 text-(--purple) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-(--purple-soft) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn direction="up">
          <div className={`${GAP_CTA} flex justify-center`}>
            <ButtonBlock cta={cta} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

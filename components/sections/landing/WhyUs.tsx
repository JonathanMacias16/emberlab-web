import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { SECTION_Y, TEXT_BODY } from "./styles";
import type { ReasonItemData } from "@/types/sanity";

interface WhyUsProps {
  title?: string;
  reasons?: ReasonItemData[];
}

/**
 * Bloque de dos tonos: el panel izquierdo usa --purple-soft y el derecho
 * --purple-mid. En Figma el corte cae en 728/1728 (42.13%).
 */
export default function WhyUs({ title, reasons }: WhyUsProps) {
  return (
    <section className="relative bg-(--purple-mid)">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full lg:w-[42.13%] bg-(--purple-soft)"
      />

      <div
        className={`relative mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-[42.13%_1fr] ${SECTION_Y}`}
      >
        <div className="px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[20rem]">{title}</SectionTitle>
          </FadeIn>
        </div>

        <div className="px-7 sm:px-8 md:px-12 lg:pl-8 lg:pr-20 xl:pl-16 xl:pr-28 mt-10 lg:mt-0">
          <StaggerContainer className="flex flex-col gap-8 sm:gap-10 max-w-[30rem]">
            {reasons?.map((reason, i) => (
              <StaggerItem key={i}>
                <p className={`tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}>
                  <span className="font-bold text-(--green-light)">{reason.title}</span>
                  <br />
                  <span className="font-light text-(--white)">{reason.description}</span>
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

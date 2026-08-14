import SectionTitle from "@/components/ui/SectionTitle";
import ButtonBlock from "@/components/ui/ButtonBlock";
import { FadeIn } from "@/components/animations";
import { SECTION_Y, TEXT_BODY, TEXT_SMALL, GAP_CTA } from "./styles";
import type { CtaButtonData } from "@/types/sanity";

interface AnalyzerProps {
  title?: string;
  description?: string;
  cta?: CtaButtonData;
  note?: string;
}

export default function Analyzer({ title, description, cta, note }: AnalyzerProps) {
  return (
    <section className="bg-(--purple)">
      <div className={`mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-2 ${SECTION_Y}`}>
        <div className="px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[30rem]">{title}</SectionTitle>
          </FadeIn>
        </div>

        <div className="px-7 sm:px-8 md:px-12 lg:pl-8 lg:pr-20 xl:pl-16 xl:pr-28 mt-10 lg:mt-0">
          <div className="max-w-[30rem]">
            <FadeIn direction="up">
              <p
                className={`text-(--white) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
              >
                {description}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <div className={GAP_CTA}>
                <ButtonBlock cta={cta} />
              </div>
            </FadeIn>
            {note && (
              <FadeIn direction="up" delay={0.2}>
                <p
                  className={`mt-4 sm:mt-6 text-(--white) font-normal tracking-[-0.03em] leading-[1.3] ${TEXT_SMALL}`}
                >
                  {note}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

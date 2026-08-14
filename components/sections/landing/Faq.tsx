import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { SECTION_Y, TEXT_BODY } from "./styles";
import type { FaqItemData } from "@/types/sanity";

interface FaqProps {
  title?: string;
  items?: FaqItemData[];
}

export default function Faq({ title, items }: FaqProps) {
  const total = items?.length ?? 0;

  return (
    <section id="preguntas" className="bg-(--purple)">
      <div className={`mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-2 ${SECTION_Y}`}>
        <div className="px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[36rem]">{title}</SectionTitle>
          </FadeIn>
        </div>

        <div className="px-7 sm:px-8 md:px-12 lg:pl-8 lg:pr-20 xl:pl-16 xl:pr-28 mt-10 lg:mt-0">
          <StaggerContainer className="flex flex-col max-w-[30rem]">
            {items?.map((item, i) => (
              <StaggerItem key={i}>
                <div
                  className={
                    i < total - 1
                      ? "pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-(--white)/60"
                      : ""
                  }
                >
                  <p className={`tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}>
                    <span className="font-bold text-(--red)">{item.question}</span>
                    <br />
                    <span className="font-light text-(--white)">{item.answer}</span>
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

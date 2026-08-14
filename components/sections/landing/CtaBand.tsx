import ButtonBlock from "@/components/ui/ButtonBlock";
import { FadeIn } from "@/components/animations";
import { CONTAINER, TEXT_LEAD, GAP_CTA } from "./styles";
import type { CtaButtonData } from "@/types/sanity";

interface CtaBandProps {
  text?: string;
  cta?: CtaButtonData;
}

export default function CtaBand({ text, cta }: CtaBandProps) {
  return (
    <section className="bg-(--green-light) py-12 sm:py-16 md:py-20">
      <div className={CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <FadeIn direction="up">
            <p
              className={`max-w-[62rem] whitespace-pre-line text-(--purple) font-normal tracking-[-0.05em] leading-[1.1] ${TEXT_LEAD}`}
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
      </div>
    </section>
  );
}

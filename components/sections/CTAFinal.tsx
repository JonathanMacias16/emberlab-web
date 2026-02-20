import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { CtaButtonData } from "@/types/sanity";
import { highlightText } from "@/lib/highlightText";

interface CTAFinalProps {
  title?: string;
  description?: string;
  cta?: CtaButtonData;
}

export default function CTAFinal({ title, description, cta }: CTAFinalProps) {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-350 mx-auto">
      <h2 className="text-(--purple) text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85] whitespace-pre-line">
        {highlightText(title)}
      </h2>
      <p className="text-(--purple-soft) text-[1.62rem] sm:text-[2.025rem] md:text-[2.43rem] lg:text-[3.24rem] xl:text-[4.05rem] font-light tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6 md:mt-8">
        {description?.split("\n").map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </p>
      {cta && (
        <div className="mt-6 sm:mt-8 md:mt-10 flex justify-end">
          <ButtonPrimary variant={cta.variant} href={cta.href}>
            {cta.text}
          </ButtonPrimary>
        </div>
      )}
    </section>
  );
}

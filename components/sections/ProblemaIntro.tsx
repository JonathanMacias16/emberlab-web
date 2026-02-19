import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { CtaButtonData } from "@/types/sanity";

interface ProblemaIntroProps {
  title?: string;
  cta?: CtaButtonData;
}

export default function ProblemaIntro({ title, cta }: ProblemaIntroProps) {
  return (
    <section
      id="problema"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[-0.05em] leading-[0.85] max-w-[800px] whitespace-pre-line">
          {title}
        </h2>
        {cta && (
          <div className="mt-6 sm:mt-8 md:mt-10">
            <ButtonPrimary variant={cta.variant} href={cta.href}>
              {cta.text}
            </ButtonPrimary>
          </div>
        )}
      </div>
    </section>
  );
}

import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { ListItemData, CtaButtonData } from "@/types/sanity";
import { highlightText } from "@/lib/highlightText";

interface ParaTiProps {
  paraTiTitle?: string;
  paraTiItems?: ListItemData[];
  noParaTiTitle?: string;
  noParaTiItems?: ListItemData[];
  cta?: CtaButtonData;
}

export default function ParaTi({ paraTiTitle, paraTiItems, noParaTiTitle, noParaTiItems, cta }: ParaTiProps) {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Para ti */}
        <div className="flex flex-col">
          <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[-0.05em] leading-[0.85] whitespace-pre-line">
            {highlightText(paraTiTitle)}
          </h2>
          <div className="mt-4 sm:mt-6 md:mt-8 rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--green-light)]/50 px-5 py-[4.55rem] sm:px-6 sm:py-[5.2rem] md:px-8 md:py-[7.15rem] lg:px-10 lg:py-[8.45rem] flex flex-col justify-center flex-1">
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-[-0.03em] leading-[1.1] max-w-[50%] mx-auto text-left">
              {paraTiItems?.map((item, i) => (
                <li key={i} className="flex gap-2 sm:gap-3">
                  <span className="shrink-0">{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* No para ti */}
        <div className="flex flex-col">
          <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[-0.05em] leading-[0.85] whitespace-pre-line">
            {highlightText(noParaTiTitle)}
          </h2>
          <div className="mt-4 sm:mt-6 md:mt-8 rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--red-light)]/50 px-5 py-[4.55rem] sm:px-6 sm:py-[5.2rem] md:px-8 md:py-[7.15rem] lg:px-10 lg:py-[8.45rem] flex flex-col justify-center flex-1">
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-[-0.03em] leading-[1.1] max-w-[50%] mx-auto text-left">
              {noParaTiItems?.map((item, i) => (
                <li key={i} className="flex gap-2 sm:gap-3">
                  <span className="shrink-0">{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {cta && (
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <ButtonPrimary variant={cta.variant} href={cta.href}>
            {cta.text}
          </ButtonPrimary>
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import type { CtaButtonData, ProblemCardData } from "@/types/sanity";
import { urlFor } from "@/sanity/lib/image";

interface ProblemaDarkProps {
  title?: string;
  subtitle2?: string;
  subtitle?: string;
  cta?: CtaButtonData;
  cards?: ProblemCardData[];
}

const fallbackImages = ["/sitios 1.png", "/sitios 2.png", "/sitios 3.png"];
const defaultBgColors = ["var(--green-light)", "var(--purple-soft)", "var(--purple-light)"];

export default function ProblemaDark({ title, subtitle2, subtitle, cta, cards }: ProblemaDarkProps) {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 bg-[var(--purple)] py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-[1728px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="lg:w-[40%]">
            <h2 className="text-[var(--white)] text-[1.7rem] sm:text-[2.15rem] md:text-[2.9rem] lg:text-[3.6rem] font-normal tracking-[-0.05em] leading-[0.85]">
              {title}
            </h2>
            {subtitle2 && (
              <p className="text-[var(--red-light)] text-[1.7rem] sm:text-[2.15rem] md:text-[2.9rem] lg:text-[3.6rem] font-normal tracking-[-0.05em] leading-[0.85] mt-1">
                {subtitle2}
              </p>
            )}
            <p className="text-[var(--green-light)] text-[0.84rem] sm:text-[1.2rem] md:text-[1.35rem] lg:text-[1.5rem] font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
              {subtitle}
            </p>
            {cta && (
              <div className="mt-6 sm:mt-8 md:mt-10 w-[75%]">
                <ButtonPrimary variant={cta.variant} href={cta.href} className="w-full">
                  {cta.text}
                </ButtonPrimary>
              </div>
            )}
          </div>
          <div className="lg:w-[60%] flex items-center justify-center">
            <div className="bg-[var(--white)] rounded-2xl md:rounded-3xl lg:rounded-[46px] w-full aspect-[856/760] flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
              <div className="relative w-full max-w-[480px]">
                <Image src="/logo.svg" alt="" width={118} height={118} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-[118px] xl:h-[118px]" aria-hidden />
                <Image src="/Group-2.svg" alt="" width={590} height={92} className="w-full mt-2 sm:mt-3 md:mt-4" aria-hidden />
                <Image src="/Group.svg" alt="" width={477} height={78} className="w-[80%] ml-auto mt-1 sm:mt-2" aria-hidden />
                <Image src="/Group-3.svg" alt="" width={590} height={92} className="w-full mt-1 sm:mt-2" aria-hidden />
                <Image src="/Group-1.svg" alt="" width={390} height={78} className="w-[66%] ml-auto mt-1 sm:mt-2" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-10 sm:mt-14 md:mt-16 lg:mt-20">
          {cards?.map((card, i) => {
            const bg = card.bgColor || defaultBgColors[i] || defaultBgColors[0];
            const textClass = card.textColorVariant === "white" ? "text-[var(--white)]" : "text-[var(--purple)]";
            const imgSrc = card.image ? urlFor(card.image).width(487).height(389).url() : fallbackImages[i] || fallbackImages[0];
            const isLast = cards.length > 2 && i === cards.length - 1;

            return (
              <div
                key={i}
                className={`rounded-2xl md:rounded-3xl lg:rounded-[46px] p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col${isLast ? " sm:col-span-2 md:col-span-1" : ""}`}
                style={{ backgroundColor: bg }}
              >
                <p className={`${textClass} text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15]`}>
                  {card.text}
                </p>
                <div className="mt-4 sm:mt-6 w-full aspect-[487/389] relative rounded-xl md:rounded-2xl overflow-hidden">
                  <Image src={imgSrc} alt={card.imageAlt || ""} fill className="object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ProblemaCarousel from "@/components/ui/ProblemaCarousel";
import type { CtaButtonData, ProblemCardData } from "@/types/sanity";
import { urlFor } from "@/sanity/lib/image";
import {
  SlideIn,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import AnimatedLogoPhrase from "@/components/animations/AnimatedLogoPhrase";

interface ProblemaDarkProps {
  title?: string;
  subtitle2?: string;
  subtitle?: string;
  cta?: CtaButtonData;
  cards?: ProblemCardData[];
}

const fallbackImages = ["/sitios 1.png", "/sitios 2.png", "/sitios 3.png"];
const defaultBgColors = [
  "var(--green-light)",
  "var(--purple-soft)",
  "var(--purple-light)",
];

export default function ProblemaDark({
  title,
  subtitle2,
  subtitle,
  cta,
  cards,
}: ProblemaDarkProps) {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 bg-(--purple) py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-432 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className={"lg:w-[40%]"}>
            <SlideIn from="left" rotate={-2} className="lg:w-w-full">
              <h2 className="text-[var(--white)] text-[1.7rem] sm:text-[2.15rem] md:text-[2.9rem] lg:text-[3.6rem] font-normal tracking-[-0.05em] leading-[0.85]">
                {title}
              </h2>
              {subtitle2 && (
                <p className="text-[var(--red-light)] text-[1.7rem] sm:text-[2.15rem] md:text-[2.9rem] lg:text-[3.6rem] font-normal tracking-[-0.05em] leading-[0.85] mt-1">
                  {subtitle2}
                </p>
              )}
              <FadeIn direction="up" blur>
                <p className="text-[var(--green-light)] text-[0.84rem] sm:text-[1.2rem] md:text-[1.35rem] lg:text-[1.5rem] font-light tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
                  {subtitle}
                </p>
              </FadeIn>
              {cta && (
                <FadeIn direction="up">
                  <div className="mt-6 sm:mt-8 md:mt-10 w-[75%]">
                    <ButtonPrimary
                      variant={cta.variant}
                      href={cta.href}
                      target={cta.target}
                      className="w-full"
                    >
                      {cta.text}
                    </ButtonPrimary>
                  </div>
                </FadeIn>
              )}
            </SlideIn>
          </div>
          <div className={"lg:w-[60%]"}>
            <FadeIn
              direction="right"
              className="lg:w-full flex items-center justify-center "
            >
              <AnimatedLogoPhrase />
            </FadeIn>
          </div>
        </div>

        {/* Carrusel en móvil */}
        {cards && cards.length > 0 && (
          <div className="md:hidden">
            <ProblemaCarousel
              cards={cards.map((card, i) => ({
                text: card.text,
                imageAlt: card.imageAlt || "",
                bgColor:
                  card.bgColor || defaultBgColors[i] || defaultBgColors[0],
                textClass:
                  card.textColorVariant === "white"
                    ? "text-[var(--white)]"
                    : "text-[var(--purple)]",
                imgSrc: card.image
                  ? urlFor(card.image).width(487).height(389).url()
                  : fallbackImages[i] || fallbackImages[0],
              }))}
            />
          </div>
        )}

        {/* Grid en desktop */}
        <StaggerContainer
          staggerDelay={0.2}
          className="hidden md:grid md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 md:gap-8 mt-10 sm:mt-14 md:mt-16 lg:mt-20"
        >
          {cards?.map((card, i) => {
            const bg = card.bgColor || defaultBgColors[i] || defaultBgColors[0];
            const textClass =
              card.textColorVariant === "white"
                ? "text-[var(--white)]"
                : "text-[var(--purple)]";
            const imgSrc = card.image
              ? urlFor(card.image).width(487).height(389).url()
              : fallbackImages[i] || fallbackImages[0];
            const isLast = cards.length > 2 && i === cards.length - 1;

            return (
              <StaggerItem
                key={i}
                scale
                className={isLast ? "sm:col-span-2 md:col-span-1" : undefined}
              >
                <div
                  className="rounded-t-4xl flex flex-col overflow-hidden h-full w-full"
                  style={{ backgroundColor: bg }}
                >
                  <div className="2xl:h-60 h-40 flex items-center">
                    <p
                      className={`${textClass} text-[1.10rem] lg:text-[1.26rem] md:text-[1.20rem] xl:text-[1.575rem] font-medium tracking-[-0.04em] leading-[1.15] p-[1.68rem] sm:p-[3.23rem] md:p-[3.30rem] lg:p-[2.37rem] 2xl:p-[5.37rem]`}
                    >
                      {card.text}
                    </p>
                  </div>
                  <div className="mt-auto w-full aspect-487/389 relative overflow-hidden rounded-t-4xl group">
                    <Image
                      src={imgSrc}
                      alt={card.imageAlt || ""}
                      fill
                      className="transition-transform duration-300 ease-out scale-101 group-hover:scale-110"
                    />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

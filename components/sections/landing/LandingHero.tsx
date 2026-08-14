import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import SectionTitle from "@/components/ui/SectionTitle";
import ButtonBlock from "@/components/ui/ButtonBlock";
import { SlideIn, FadeIn } from "@/components/animations";
import { TEXT_BODY, GAP_CTA } from "./styles";
import type { CtaButtonData } from "@/types/sanity";

interface LandingHeroProps {
  title?: string;
  subtitle?: string;
  cta?: CtaButtonData;
  note?: string;
  image?: SanityImageSource;
  imageAlt?: string;
}

export default function LandingHero({
  title,
  subtitle,
  cta,
  note,
  image,
  imageAlt,
}: LandingHeroProps) {
  const imageSrc = image
    ? urlFor(image).width(1724).height(1718).url()
    : "/landing/hero-banner.jpg";

  return (
    <section id="nosotros" className="bg-(--purple)">
      <div className="mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center order-2 lg:order-1 px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <SlideIn from="left">
            <SectionTitle as="h1" className="text-(--white)">
              {title}
            </SectionTitle>
          </SlideIn>

          <FadeIn direction="up">
            <p
              className={`mt-4 sm:mt-6 md:mt-8 text-(--green-light) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              {subtitle}
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
                className={`mt-4 sm:mt-6 text-(--green-light) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
              >
                {note}
              </p>
            </FadeIn>
          )}
        </div>

        {/* La caja es cuadrada como en Figma (862×859), así que la imagen entra
            completa sin que `object-cover` la recorte. Si la columna de texto
            llegara a ser más alta, la rejilla estira esta y recorta lo mínimo. */}
        <div className="order-1 lg:order-2 relative aspect-square">
          <Image
            src={imageSrc}
            alt={imageAlt || "EmberLab"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

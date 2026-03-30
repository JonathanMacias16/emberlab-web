import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { highlightText } from "@/lib/highlightText";
import {
  SlideIn,
  FadeIn,
  ScaleIn,
  FloatingElement,
} from "@/components/animations";

interface HeroProps {
  headline1?: string;
  headline2?: string;
  subtitle?: string;
  image?: SanityImageSource;
  imageAlt?: string;
}

export default function Hero({
  headline1,
  headline2,
  subtitle,
  image,
  imageAlt,
}: HeroProps) {
  const imageSrc = image
    ? urlFor(image).width(700).height(933).url()
    : "/Rectangle.png";
  const alt = imageAlt || "EmberLab - Diseño web estratégico";

  return (
    <section
      id="bienvenido"
      className="mt-14 px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-432 mx-auto"
    >
      <div className="flex flex-col items-center">
        <SlideIn from="left" rotate={-3} initialDelay={1}>
          <h1 className="text-(--purple) text-center text-5xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85]">
            {highlightText(headline1)}
          </h1>
        </SlideIn>
        <SlideIn from="right" rotate={3} initialDelay={1.15}>
          <h1 className="text-(--purple) text-center text-5xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[1.15] mt-1 sm:mt-2">
            {highlightText(headline2)}
          </h1>
        </SlideIn>
        <FadeIn direction="up" blur initialDelay={1.3}>
          <p className="text-(--purple-soft) text-center font-light tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6 md:mt-8 max-w-[640px] lg:max-w-[800px]">
            {highlightText(subtitle)}
          </p>
        </FadeIn>
        <ScaleIn
          initialScale={0.6}
          rotate={-2}
          initialDelay={1.4}
          className="mt-6 sm:mt-8 md:mt-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
        >
          <FloatingElement amplitude={8}>
            <div className="w-full aspect-3/4 relative overflow-hidden rounded-2xl md:rounded-3xl">
              <Image
                src={imageSrc}
                alt={alt}
                fill
                className="object-cover"
                priority
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 72%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 72%, transparent 100%)",
                }}
              />
            </div>
          </FloatingElement>
        </ScaleIn>
      </div>
    </section>
  );
}

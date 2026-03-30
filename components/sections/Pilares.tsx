import PilaresCarousel from "@/components/ui/PilaresCarousel";
import PilarsFan from "@/components/ui/PilarsFan";
import type { PilarCardData } from "@/types/sanity";
import { highlightText } from "@/lib/highlightText";
import { FadeIn } from "@/components/animations";

interface PilaresProps {
  subtitle?: string;
  title?: string;
  pilares?: PilarCardData[];
}

export default function Pilares({ subtitle, title, pilares }: PilaresProps) {
  return (
    <section
      id="pilares"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-432 mx-auto"
    >
      <FadeIn direction="up" blur>
        <h2 className="text-(--purple) text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85]">
          {highlightText(title)}
        </h2>
      </FadeIn>
      <FadeIn direction="up">
        <p className="text-(--red) text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light tracking-[-0.05em] leading-[0.85] mt-2 sm:mt-3 md:mt-4">
          {subtitle}
        </p>
      </FadeIn>

      {/* Carrusel en móvil */}
      {pilares && pilares.length > 0 && (
        <FadeIn direction="up" className="md:hidden">
          <PilaresCarousel pilares={pilares} />
        </FadeIn>
      )}

      {/* Collage en desktop */}
      {pilares && pilares.length > 0 && <PilarsFan pilares={pilares} />}
    </section>
  );
}

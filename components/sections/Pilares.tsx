import PilarCard from "@/components/ui/PilarCard";
import PilaresCarousel from "@/components/ui/PilaresCarousel";
import type { PilarCardData } from "@/types/sanity";
import { highlightText } from "@/lib/highlightText";

interface PilaresProps {
  subtitle?: string;
  title?: string;
  pilares?: PilarCardData[];
}

export default function Pilares({ subtitle, title, pilares }: PilaresProps) {
  return (
    <section
      id="pilares"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto"
    >
      <h2 className="text-[var(--purple)] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85]">
        {highlightText(title)}
      </h2>
      <p className="text-[var(--red)] text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extralight tracking-[-0.05em] leading-[0.85] mt-2 sm:mt-3 md:mt-4">
        {subtitle}
      </p>

      {/* Carrusel en móvil */}
      {pilares && pilares.length > 0 && (
        <div className="md:hidden">
          <PilaresCarousel pilares={pilares} />
        </div>
      )}

      {/* Collage en desktop */}
      <div className="hidden md:block relative w-full mt-10 lg:mt-0 pb-[71.2%]">
        {pilares?.map((pilar) => (
          <PilarCard
            key={pilar.title}
            title={pilar.title}
            description={pilar.description}
            bg={pilar.bgColor || "bg-[var(--purple)]"}
            textColor={pilar.textColor || "text-[var(--white)]"}
            position={pilar.position || "left-0 top-0"}
            className={pilar.rotation || ""}
          />
        ))}
      </div>
    </section>
  );
}

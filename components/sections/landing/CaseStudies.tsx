import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { CONTAINER, SECTION_Y, TEXT_BODY, TEXT_SMALL, GAP_TITLE } from "./styles";
import type { CaseStudyData } from "@/types/sanity";

/** Imágenes por defecto, en el mismo orden que `defaultLandingWebData.cases`. */
const FALLBACK_IMAGES = [
  "/landing/caso-carolina.jpg",
  "/landing/caso-estate-taurus.jpg",
  "/landing/caso-grizzly.jpg",
  "/landing/caso-pixeron.jpg",
];

/** Píldora "Ver sitio", anclada abajo a la derecha de cada imagen. */
const PILL_CLASSES = `absolute bottom-[5%] right-[8%] inline-flex items-center justify-center border border-(--white) rounded-full px-4 h-8 md:h-9 text-(--white) font-light tracking-[-0.01em] ${TEXT_SMALL}`;

interface CaseStudiesProps {
  title?: string;
  cases?: CaseStudyData[];
}

function resolveSrc(image: SanityImageSource | undefined, index: number) {
  if (image) return urlFor(image).width(1224).height(1224).url();
  return FALLBACK_IMAGES[index] ?? FALLBACK_IMAGES[0];
}

export default function CaseStudies({ title, cases }: CaseStudiesProps) {
  return (
    <section id="resultados" className={`bg-(--white) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <FadeIn direction="up">
          <SectionTitle className="text-(--purple) max-w-[30rem]">{title}</SectionTitle>
        </FadeIn>

        {/* En Figma la rejilla de casos es más angosta que el resto de la página. */}
        <StaggerContainer
          className={`${GAP_TITLE} mx-auto max-w-[68rem] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12`}
        >
          {cases?.map((item, i) => (
            <StaggerItem key={i}>
              <article>
                <div className="relative aspect-square w-full">
                  <Image
                    src={resolveSrc(item.image, i)}
                    alt={item.imageAlt || item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33rem"
                    className="object-cover"
                  />
                  {/* La píldora existe en todas las tarjetas del diseño; sin
                      enlace cargado se muestra igual, pero sin ser clicable. */}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${PILL_CLASSES} hover:bg-(--white)/15 transition-colors`}
                    >
                      {item.linkLabel || "Ver sitio"}
                    </a>
                  ) : (
                    <span className={PILL_CLASSES}>{item.linkLabel || "Ver sitio"}</span>
                  )}
                </div>

                <h3
                  className={`mt-4 sm:mt-6 text-(--purple) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-(--purple) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

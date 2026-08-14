import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import ButtonBlock from "@/components/ui/ButtonBlock";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { CONTAINER, SECTION_Y, TEXT_BODY, GAP_TITLE, GAP_CTA } from "./styles";
import type { CtaButtonData, ProjectTypeCardData, ProjectTypeIcon } from "@/types/sanity";

/**
 * Íconos de línea exportados de Figma. Los SVG traen `preserveAspectRatio="none"`,
 * así que hay que fijar ancho *y* alto explícitamente: con `w-auto` el navegador
 * los estira al ancho de la columna. Cada par respeta la proporción original.
 */
const ICONS: Record<
  ProjectTypeIcon,
  { src: string; width: number; height: number; className: string }
> = {
  landing: {
    src: "/landing/icon-landing.svg",
    width: 95.78,
    height: 141.01,
    className: "h-[3.75rem] w-[2.546rem] md:h-[5rem] md:w-[3.394rem] lg:h-[6.5rem] lg:w-[4.414rem]",
  },
  esencial: {
    src: "/landing/icon-esencial.svg",
    width: 119.06,
    height: 140.28,
    className: "h-[3.75rem] w-[3.183rem] md:h-[5rem] md:w-[4.244rem] lg:h-[6.5rem] lg:w-[5.517rem]",
  },
  corporativo: {
    src: "/landing/icon-corporativo.svg",
    width: 95.78,
    height: 139.4,
    className: "h-[3.75rem] w-[2.577rem] md:h-[5rem] md:w-[3.436rem] lg:h-[6.5rem] lg:w-[4.465rem]",
  },
  rediseno: {
    src: "/landing/icon-rediseno.svg",
    width: 95.78,
    height: 139.4,
    className: "h-[3.75rem] w-[2.577rem] md:h-[5rem] md:w-[3.436rem] lg:h-[6.5rem] lg:w-[4.465rem]",
  },
};

interface ProjectTypesProps {
  title?: string;
  types?: ProjectTypeCardData[];
  note?: string;
  cta?: CtaButtonData;
}

export default function ProjectTypes({ title, types, note, cta }: ProjectTypesProps) {
  return (
    <section id="servicios" className={`bg-(--purple) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <FadeIn direction="up">
          <SectionTitle className="text-(--white) max-w-[36rem]">{title}</SectionTitle>
        </FadeIn>

        <StaggerContainer
          className={`${GAP_TITLE} grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-12`}
        >
          {types?.map((type, i) => {
            const icon = ICONS[type.icon ?? "landing"];
            return (
              <StaggerItem key={i}>
                <div className="flex flex-col max-w-[22.3rem]">
                  <Image
                    src={icon.src}
                    alt=""
                    aria-hidden
                    width={icon.width}
                    height={icon.height}
                    className={icon.className}
                  />
                  <h3
                    className={`mt-6 sm:mt-8 text-(--red) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                  >
                    {type.title}
                  </h3>
                  <p
                    className={`mt-3 sm:mt-4 text-(--white) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                  >
                    {type.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="mt-12 sm:mt-14 md:mt-16 flex flex-col items-center text-center">
          {note && (
            <FadeIn direction="up">
              <p
                className={`whitespace-pre-line text-(--green-light) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
              >
                {note}
              </p>
            </FadeIn>
          )}
          <FadeIn direction="up" delay={0.1}>
            <div className={GAP_CTA}>
              <ButtonBlock cta={cta} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

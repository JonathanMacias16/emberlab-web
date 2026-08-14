import type { ReactNode } from "react";

/**
 * Titular de sección de la landing web. Usa la misma escala que los titulares de
 * `/web` (`components/sections/Resultados.tsx`), con el tracking -0.05em y el
 * leading 0.85 del diseño de Figma.
 */
export const TITLE_SIZE =
  "text-[2.05rem] sm:text-[2.75rem] md:text-[3.3rem] lg:text-[4.4rem] xl:text-[4.95rem]";

export default function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={`font-normal tracking-[-0.05em] leading-[0.85] ${TITLE_SIZE} ${className}`}
    >
      {children}
    </Tag>
  );
}

import type { CtaButtonData } from "@/types/sanity";

/**
 * Botón rectangular (sin radio) de la landing web (`/landing`). El tamaño de texto
 * y el padding son los de `ButtonPrimary` (usado en `/web`); lo que cambia es la
 * esquina recta, que sí viene del diseño de Figma. La variante "purple" usa
 * --purple-soft.
 */
export default function ButtonBlock({
  cta,
  className = "",
}: {
  cta?: CtaButtonData;
  className?: string;
}) {
  if (!cta?.text) return null;

  const bg =
    cta.variant === "red"
      ? "bg-(--red) hover:brightness-110"
      : "bg-(--purple-soft) hover:bg-(--purple)";

  const classes = `${bg} text-(--white) inline-block whitespace-nowrap text-center px-[1.96rem] py-[1.4rem] text-[1.15rem] md:text-[1.36rem] font-medium tracking-[-0.05em] transition-all cursor-pointer ${className}`;

  return (
    <a
      href={cta.href || "#"}
      target={cta.target}
      rel={cta.target === "_blank" ? "noopener noreferrer" : undefined}
      className={classes}
    >
      {cta.text}
    </a>
  );
}

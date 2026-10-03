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

  // El hover es siempre brillo, nunca cambio de color: así las dos variantes se
  // comportan igual y el botón conserva su color de marca al pasar el mouse.
  const bg = cta.variant === "red" ? "bg-(--red)" : "bg-(--purple-soft)";

  // En celular un texto largo ("Agenda una llamada de diagnóstico →") se parte
  // en dos líneas en vez de desbordar el margen; desde `sm` va en una sola.
  const classes = `${bg} text-(--white) inline-block max-w-full text-balance sm:whitespace-nowrap text-center px-[1.96rem] py-[1.4rem] text-[1.15rem] md:text-[1.36rem] font-medium tracking-[-0.05em] transition-all duration-200 hover:brightness-125 cursor-pointer ${className}`;

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

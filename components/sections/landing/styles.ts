/**
 * Escala compartida de la landing web (`/landing`).
 *
 * Los valores replican los de la landing `/web` (ver `components/sections/Resultados.tsx`,
 * `CTAFinal.tsx`, `Footer.tsx` y `Nav.tsx`) para que ambas páginas se sientan del mismo
 * tamaño. Las proporciones del diseño de Figma se conservan; lo que cambia es la escala.
 */

/** Ancho máximo + márgenes laterales, iguales a los de `/web`. */
export const CONTAINER = "mx-auto max-w-[1728px] px-7 sm:px-8 md:px-12 lg:px-20 xl:px-28";

/** Ritmo vertical estándar de sección. */
export const SECTION_Y = "py-16 sm:py-20 md:py-24 lg:py-32";

/** Cuerpo de texto: misma escala que la regla global de `p` en `globals.css`. */
export const TEXT_BODY = "text-[1.4rem] sm:text-[1.2rem] md:text-[1.35rem] lg:text-[1.5rem]";

/** Párrafo destacado y centrado (intro y banda verde). */
export const TEXT_LEAD =
  "text-[1.4rem] sm:text-[1.5rem] md:text-[1.65rem] lg:text-[1.85rem] xl:text-[1.98rem]";

/** Texto auxiliar: notas al pie y etiquetas. */
export const TEXT_SMALL = "text-xs sm:text-sm md:text-base";

/** Separación entre el titular de sección y su contenido. */
export const GAP_TITLE = "mt-8 sm:mt-10 md:mt-12";

/** Separación antes de un botón. */
export const GAP_CTA = "mt-6 sm:mt-8 md:mt-10";

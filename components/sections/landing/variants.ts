import { stegaClean } from "next-sanity";
import type { CtaButtonData, LandingWebData, NavLinkData, SimpleStepData } from "@/types/sanity";

/**
 * Las landings de tuweb.emberlab.mx comparten el mismo cuerpo (el de `/landing`)
 * y se distinguen por el banner, que define la acción principal:
 *
 * - `boton`: botón al brief (`/landing`, la raíz del subdominio).
 * - `agenda`: calendario en el banner (`/mejorar-mi-sitio`).
 * - `formulario`: formulario corto en el banner (`/hablemos`).
 *
 * El contenido sale de Sanity igual que en `/landing`; cada variante solo
 * sobrescribe los llamados a la acción, unos textos que hablaban del brief y
 * qué secciones del final se muestran.
 */
export type LandingVariant = "boton" | "agenda" | "formulario";

/** Ancla de la acción del banner de cada variante: ahí apuntan sus CTAs. */
export const HERO_ANCHOR = {
  agenda: "agendar",
  formulario: "formulario",
} as const;

interface VariantConfig {
  /** Texto de los CTAs del cuerpo; todos suben a la acción del banner. */
  ctaText: string;
  anchor: string;
  projectTypesNote?: string;
  steps: SimpleStepData[];
  ctaBandText: string;
}

const VARIANTS: Record<Exclude<LandingVariant, "boton">, VariantConfig> = {
  agenda: {
    ctaText: "Agenda una reunión →",
    anchor: HERO_ANCHOR.agenda,
    projectTypesNote: "¿No sabes cuál te conviene? Para eso es la llamada.",
    steps: [
      { number: "01", title: "Agenda tu llamada", description: "elige el día y la hora que te queden." },
      { number: "02", title: "Revisamos tu sitio contigo", description: "20 minutos por videollamada, con tu sitio en pantalla." },
      { number: "03", title: "Te llevas las 3 mejoras", description: "las que más impacto tendrían, las hagas con nosotros o no." },
    ],
    ctaBandText: "¿Listo para saber qué necesita tu sitio?",
  },
  formulario: {
    ctaText: "Completa el formulario →",
    anchor: HERO_ANCHOR.formulario,
    steps: [
      { number: "01", title: "Completa el formulario", description: "déjanos 5 datos sobre ti y tu proyecto." },
      { number: "02", title: "Identificamos qué necesitas", description: "sitio nuevo, rediseño, optimización o algo distinto." },
      { number: "03", title: "Te escribimos por WhatsApp", description: "ahí hablamos de alcance, tiempos e inversión." },
    ],
    ctaBandText: "¿Listo para saber qué necesita tu sitio?",
  },
};

function retarget(cta: CtaButtonData | undefined, text: string, anchor: string): CtaButtonData {
  // Se conserva el color que venga de Sanity; solo cambian texto y destino.
  return { variant: cta?.variant ?? "purple", text, href: `#${anchor}` };
}

/** Datos de la página ya ajustados a la variante. `boton` los deja intactos. */
export function applyVariant(page: LandingWebData, variant: LandingVariant): LandingWebData {
  if (variant === "boton") return page;
  const v = VARIANTS[variant];

  // "Nosotros" lleva al banner y "Contacto" a su acción: la sección de
  // contacto (#contacto) no existe en estas variantes.
  const navLinks: NavLinkData[] | undefined = page.navLinks?.map((link) =>
    stegaClean(link.href) === "#contacto" ? { ...link, href: `#${v.anchor}` } : link,
  );

  return {
    ...page,
    navLinks,
    introCta: undefined,
    projectTypesNote: v.projectTypesNote ?? page.projectTypesNote,
    projectTypesCta: retarget(page.projectTypesCta, v.ctaText, v.anchor),
    steps: v.steps,
    stepsCta: retarget(page.stepsCta, v.ctaText, v.anchor),
    ctaBandText: v.ctaBandText,
    ctaBandButton: retarget(page.ctaBandButton, v.ctaText, v.anchor),
  };
}

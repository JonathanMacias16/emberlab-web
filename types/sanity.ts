import type { SanityImageSource } from "@sanity/image-url";

export interface NavLinkData {
  label: string;
  href: string;
}

export interface SocialLinkData {
  platform: "fb" | "ig" | "in";
  url: string;
}

export interface CtaButtonData {
  text: string;
  variant?: "purple" | "red";
  href?: string;
  target?: string;
}

export interface ProblemCardData {
  text: string;
  image?: SanityImageSource;
  imageAlt?: string;
  bgColor?: string;
  textColorVariant?: "purple" | "white";
}

export interface PilarCardData {
  title: string;
  description: string;
  bgColor?: string;
  textColor?: string;
  position?: string;
  rotation?: string;
}

export interface ListItemData {
  emoji: string;
  text: string;
}

export interface ProcessStepData {
  text: string;
}

export interface PortfolioProjectData {
  title: string;
  image?: SanityImageSource;
  link?: string;
}

export type ProjectTypeIcon = "landing" | "esencial" | "corporativo" | "rediseno";

export interface ProjectTypeCardData {
  title: string;
  description?: string;
  icon?: ProjectTypeIcon;
}

export interface ReasonItemData {
  title: string;
  description?: string;
}

export interface FaqItemData {
  question: string;
  answer?: string;
}

export interface SimpleStepData {
  number: string;
  title: string;
  description?: string;
}

export interface CaseStudyData {
  title: string;
  description?: string;
  image?: SanityImageSource;
  imageAlt?: string;
  link?: string;
  linkLabel?: string;
}

/** Documento de la landing web (`/landing`). Independiente de `landingPage` (`/web`). */
export interface LandingWebData {
  // Nav
  navLinks?: NavLinkData[];
  navSocialLinks?: SocialLinkData[];

  // Hero
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: CtaButtonData;
  heroNote?: string;
  heroImage?: SanityImageSource;
  heroImageAlt?: string;

  // Intro
  introText?: string;
  introCta?: CtaButtonData;

  // Tipos de proyecto
  projectTypesTitle?: string;
  projectTypes?: ProjectTypeCardData[];
  projectTypesNote?: string;
  projectTypesCta?: CtaButtonData;

  // Por qué
  whyTitle?: string;
  whyReasons?: ReasonItemData[];

  // Así de simple
  stepsTitle?: string;
  steps?: SimpleStepData[];
  stepsCta?: CtaButtonData;

  // FAQ
  faqTitle?: string;
  faqItems?: FaqItemData[];

  // Qué incluye
  includesTitle?: string;
  includesItems?: string[];

  // Casos
  casesTitle?: string;
  cases?: CaseStudyData[];

  // Banda verde
  ctaBandText?: string;
  ctaBandButton?: CtaButtonData;

  // Analizador
  analyzerTitle?: string;
  analyzerDescription?: string;
  analyzerCta?: CtaButtonData;
  analyzerNote?: string;

  // Hablar directo
  contactTitle?: string;
  contactDescription?: string;
  contactCta?: CtaButtonData;

  // Footer
  footerTagline?: string;
  footerBrandLine1?: string;
  footerBrandLine2?: string;
  footerCopyright?: string;
}

export interface LandingPageData {
  // Nav
  navLinks?: NavLinkData[];
  navSocialLinks?: SocialLinkData[];
  navCta?: CtaButtonData;

  // Hero
  heroHeadline1?: string;
  heroHeadline2?: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  heroImageAlt?: string;

  // Problema Intro
  problemaIntroTitle?: string;
  problemaIntroCta?: CtaButtonData;

  // Problema Dark
  problemaDarkTitle?: string;
  problemaDarkSubtitle2?: string;
  problemaDarkSubtitle?: string;
  problemaDarkCta?: CtaButtonData;
  problemCards?: ProblemCardData[];

  // Pilares
  pilaresSubtitle?: string;
  pilaresTitle?: string;
  pilares?: PilarCardData[];

  // Para Ti
  paraTiTitle?: string;
  paraTiItems?: ListItemData[];
  noParaTiTitle?: string;
  noParaTiItems?: ListItemData[];
  paraTiCta?: CtaButtonData;

  // Proceso
  procesoTitle?: string;
  procesoSubtitle?: string;
  procesoSteps?: ProcessStepData[];

  // Resultados
  resultadosTitle?: string;
  resultadosSubtitle?: string;

  // Portfolio
  portfolioProjects?: PortfolioProjectData[];

  // CTA Final
  ctaFinalTitle?: string;
  ctaFinalDescription?: string;
  ctaFinalButton?: CtaButtonData;

  // Footer
  footerTagline?: string;
  footerBrandLine1?: string;
  footerBrandLine2?: string;
  footerCopyright?: string;
}

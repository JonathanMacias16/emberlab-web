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

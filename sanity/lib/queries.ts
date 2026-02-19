import { defineQuery } from "next-sanity";

export const LANDING_PAGE_QUERY = defineQuery(`
  *[_type == "landingPage" && _id == "landingPage"][0]{
    // Nav
    navLinks,
    navSocialLinks,
    navCta,

    // Hero
    heroHeadline1,
    heroHeadline2,
    heroSubtitle,
    heroImage{ asset->{ _id, url, metadata } },
    heroImageAlt,

    // Problema Intro
    problemaIntroTitle,
    problemaIntroCta,

    // Problema Dark
    problemaDarkTitle,
    problemaDarkSubtitle,
    problemaDarkCta,
    problemCards[]{ text, image{ asset->{ _id, url, metadata } }, imageAlt, bgColor, textColorVariant },

    // Pilares
    pilaresSubtitle,
    pilaresTitle,
    pilares,

    // Para Ti
    paraTiTitle,
    paraTiItems,
    noParaTiTitle,
    noParaTiItems,
    paraTiCta,

    // Proceso
    procesoTitle,
    procesoSubtitle,
    procesoSteps,

    // Resultados
    resultadosTitle,
    resultadosSubtitle,

    // Portfolio
    portfolioProjects[]{ title, image{ asset->{ _id, url, metadata } }, link },

    // CTA Final
    ctaFinalTitle,
    ctaFinalDescription,
    ctaFinalButton,

    // Footer
    footerTagline,
    footerBrandLine1,
    footerBrandLine2,
    footerCopyright
  }
`);

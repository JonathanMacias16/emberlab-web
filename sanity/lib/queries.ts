import { defineQuery } from "next-sanity";

export const LANDING_WEB_QUERY = defineQuery(`
  *[_type == "landingWeb" && _id == "landingWeb"][0]{
    // Nav
    navLinks,
    navSocialLinks,

    // Hero
    heroTitle,
    heroSubtitle,
    heroCta,
    heroNote,
    heroImage{ asset->{ _id, url, metadata } },
    heroImageAlt,

    // Intro
    introText,
    introCta,

    // Tipos de proyecto
    projectTypesTitle,
    projectTypes[]{ title, description, icon },
    projectTypesNote,
    projectTypesCta,

    // Por qué
    whyTitle,
    whyReasons[]{ title, description },

    // Así de simple
    stepsTitle,
    steps[]{ number, title, description },
    stepsCta,

    // Preguntas
    faqTitle,
    faqItems[]{ question, answer },

    // Qué incluye
    includesTitle,
    includesItems,

    // Casos
    casesTitle,
    cases[]{ title, description, image{ asset->{ _id, url, metadata } }, imageAlt, link, linkLabel },

    // Banda verde
    ctaBandText,
    ctaBandButton,

    // Analizador
    analyzerTitle,
    analyzerDescription,
    analyzerCta,
    analyzerNote,

    // Hablar directo
    contactTitle,
    contactDescription,
    contactCta,

    // Footer
    footerTagline,
    footerBrandLine1,
    footerBrandLine2,
    footerCopyright
  }
`);

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
    problemaDarkSubtitle2,
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

import { defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fieldsets: [
    { name: "nav", title: "Navigation", options: { collapsible: true, collapsed: true } },
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: true } },
    { name: "problemaIntro", title: "Problema Intro", options: { collapsible: true, collapsed: true } },
    { name: "problemaDark", title: "Problema Dark", options: { collapsible: true, collapsed: true } },
    { name: "pilares", title: "Pilares", options: { collapsible: true, collapsed: true } },
    { name: "paraTi", title: "Para Ti", options: { collapsible: true, collapsed: true } },
    { name: "proceso", title: "Proceso", options: { collapsible: true, collapsed: true } },
    { name: "resultados", title: "Resultados", options: { collapsible: true, collapsed: true } },
    { name: "portfolio", title: "Portfolio", options: { collapsible: true, collapsed: true } },
    { name: "ctaFinal", title: "CTA Final", options: { collapsible: true, collapsed: true } },
    { name: "footer", title: "Footer", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // --- Nav ---
    { name: "navLinks", title: "Nav Links", type: "array", of: [{ type: "navLink" }], fieldset: "nav" },
    { name: "navSocialLinks", title: "Social Links", type: "array", of: [{ type: "socialLink" }], fieldset: "nav" },
    { name: "navCta", title: "Nav CTA", type: "ctaButton", fieldset: "nav" },

    // --- Hero ---
    { name: "heroHeadline1", title: "Headline Line 1", type: "string", fieldset: "hero" },
    { name: "heroHeadline2", title: "Headline Line 2", type: "string", fieldset: "hero" },
    { name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "hero" },
    { name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, fieldset: "hero" },
    { name: "heroImageAlt", title: "Hero Image Alt", type: "string", fieldset: "hero" },

    // --- Problema Intro ---
    { name: "problemaIntroTitle", title: "Title (HTML allowed)", type: "text", rows: 3, fieldset: "problemaIntro" },
    { name: "problemaIntroCta", title: "CTA Button", type: "ctaButton", fieldset: "problemaIntro" },

    // --- Problema Dark ---
    { name: "problemaDarkTitle", title: "Title", type: "text", rows: 3, fieldset: "problemaDark" },
    { name: "problemaDarkSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "problemaDark" },
    { name: "problemaDarkCta", title: "CTA Button", type: "ctaButton", fieldset: "problemaDark" },
    { name: "problemCards", title: "Problem Cards", type: "array", of: [{ type: "problemCard" }], fieldset: "problemaDark" },

    // --- Pilares ---
    { name: "pilaresSubtitle", title: "Subtitle (red text)", type: "string", fieldset: "pilares" },
    { name: "pilaresTitle", title: "Title", type: "string", fieldset: "pilares" },
    { name: "pilares", title: "Pilares", type: "array", of: [{ type: "pilarCard" }], fieldset: "pilares" },

    // --- Para Ti ---
    { name: "paraTiTitle", title: "Para Ti Title", type: "text", rows: 2, fieldset: "paraTi" },
    { name: "paraTiItems", title: "Para Ti Items", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi" },
    { name: "noParaTiTitle", title: "No Para Ti Title", type: "text", rows: 2, fieldset: "paraTi" },
    { name: "noParaTiItems", title: "No Para Ti Items", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi" },
    { name: "paraTiCta", title: "CTA Button", type: "ctaButton", fieldset: "paraTi" },

    // --- Proceso ---
    { name: "procesoTitle", title: "Title", type: "text", rows: 2, fieldset: "proceso" },
    { name: "procesoSubtitle", title: "Subtitle", type: "string", fieldset: "proceso" },
    { name: "procesoSteps", title: "Steps", type: "array", of: [{ type: "processStep" }], fieldset: "proceso" },

    // --- Resultados ---
    { name: "resultadosTitle", title: "Title", type: "string", fieldset: "resultados" },
    { name: "resultadosSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "resultados" },

    // --- Portfolio ---
    { name: "portfolioProjects", title: "Projects", type: "array", of: [{ type: "portfolioProject" }], fieldset: "portfolio" },

    // --- CTA Final ---
    { name: "ctaFinalTitle", title: "Title", type: "text", rows: 2, fieldset: "ctaFinal" },
    { name: "ctaFinalDescription", title: "Description", type: "text", rows: 3, fieldset: "ctaFinal" },
    { name: "ctaFinalButton", title: "CTA Button", type: "ctaButton", fieldset: "ctaFinal" },

    // --- Footer ---
    { name: "footerTagline", title: "Tagline", type: "text", rows: 2, fieldset: "footer" },
    { name: "footerBrandLine1", title: "Brand Line 1", type: "string", fieldset: "footer" },
    { name: "footerBrandLine2", title: "Brand Line 2", type: "string", fieldset: "footer" },
    { name: "footerCopyright", title: "Copyright", type: "string", fieldset: "footer" },
  ],
});

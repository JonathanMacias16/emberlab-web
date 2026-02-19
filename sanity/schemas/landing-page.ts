import { defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  groups: [
    { name: "nav", title: "Navegación" },
    { name: "hero", title: "Hero" },
    { name: "problema", title: "Problema" },
    { name: "pilares", title: "4 Pilares" },
    { name: "paraTi", title: "Para Ti" },
    { name: "proceso", title: "Proceso" },
    { name: "resultados", title: "Resultados" },
    { name: "portfolio", title: "Portfolio" },
    { name: "footer", title: "Footer" },
  ],
  fieldsets: [
    { name: "nav", title: "Navigation", options: { collapsible: true, collapsed: false, columns: 2 } },
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "problemaIntro", title: "Problema Intro", options: { collapsible: true, collapsed: false, columns: 2 } },
    { name: "problemaDark", title: "Problema Dark", options: { collapsible: true, collapsed: false } },
    { name: "pilares", title: "Pilares", options: { collapsible: true, collapsed: false } },
    { name: "paraTi", title: "Para Ti", options: { collapsible: true, collapsed: false } },
    { name: "proceso", title: "Proceso", options: { collapsible: true, collapsed: false } },
    { name: "resultados", title: "Resultados", options: { collapsible: true, collapsed: false } },
    { name: "portfolio", title: "Portfolio", options: { collapsible: true, collapsed: false } },
    { name: "ctaFinal", title: "CTA Final", options: { collapsible: true, collapsed: false } },
    { name: "footer", title: "Footer", options: { collapsible: true, collapsed: false, columns: 2 } },
  ],
  fields: [
    // --- Nav ---
    { name: "navLinks", title: "Nav Links", type: "array", of: [{ type: "navLink" }], fieldset: "nav", group: "nav" },
    { name: "navSocialLinks", title: "Social Links", type: "array", of: [{ type: "socialLink" }], fieldset: "nav", group: "nav" },
    { name: "navCta", title: "Nav CTA", type: "ctaButton", fieldset: "nav", group: "nav" },

    // --- Hero ---
    { name: "heroHeadline1", title: "Headline Line 1", type: "string", fieldset: "hero", group: "hero" },
    { name: "heroHeadline2", title: "Headline Line 2", type: "string", fieldset: "hero", group: "hero" },
    { name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "hero", group: "hero" },
    { name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, fieldset: "hero", group: "hero" },
    { name: "heroImageAlt", title: "Hero Image Alt", type: "string", fieldset: "hero", group: "hero" },

    // --- Problema Intro ---
    { name: "problemaIntroTitle", title: "Title (HTML allowed)", type: "text", rows: 3, fieldset: "problemaIntro", group: "problema" },
    { name: "problemaIntroCta", title: "CTA Button", type: "ctaButton", fieldset: "problemaIntro", group: "problema" },

    // --- Problema Dark ---
    { name: "problemaDarkTitle", title: "Title", type: "text", rows: 3, fieldset: "problemaDark", group: "problema" },
    { name: "problemaDarkSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "problemaDark", group: "problema" },
    { name: "problemaDarkCta", title: "CTA Button", type: "ctaButton", fieldset: "problemaDark", group: "problema" },
    { name: "problemCards", title: "Problem Cards", type: "array", of: [{ type: "problemCard" }], fieldset: "problemaDark", group: "problema" },

    // --- Pilares ---
    { name: "pilaresSubtitle", title: "Subtitle (red text)", type: "string", fieldset: "pilares", group: "pilares" },
    { name: "pilaresTitle", title: "Title", type: "string", fieldset: "pilares", group: "pilares" },
    { name: "pilares", title: "Pilares", type: "array", of: [{ type: "pilarCard" }], fieldset: "pilares", group: "pilares" },

    // --- Para Ti ---
    { name: "paraTiTitle", title: "Para Ti Title", type: "text", rows: 2, fieldset: "paraTi", group: "paraTi" },
    { name: "paraTiItems", title: "Para Ti Items", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi", group: "paraTi" },
    { name: "noParaTiTitle", title: "No Para Ti Title", type: "text", rows: 2, fieldset: "paraTi", group: "paraTi" },
    { name: "noParaTiItems", title: "No Para Ti Items", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi", group: "paraTi" },
    { name: "paraTiCta", title: "CTA Button", type: "ctaButton", fieldset: "paraTi", group: "paraTi" },

    // --- Proceso ---
    { name: "procesoTitle", title: "Title", type: "text", rows: 2, fieldset: "proceso", group: "proceso" },
    { name: "procesoSubtitle", title: "Subtitle", type: "string", fieldset: "proceso", group: "proceso" },
    { name: "procesoSteps", title: "Steps", type: "array", of: [{ type: "processStep" }], fieldset: "proceso", group: "proceso" },

    // --- Resultados ---
    { name: "resultadosTitle", title: "Title", type: "string", fieldset: "resultados", group: "resultados" },
    { name: "resultadosSubtitle", title: "Subtitle", type: "text", rows: 3, fieldset: "resultados", group: "resultados" },

    // --- Portfolio ---
    { name: "portfolioProjects", title: "Projects", type: "array", of: [{ type: "portfolioProject" }], fieldset: "portfolio", group: "portfolio" },

    // --- CTA Final ---
    { name: "ctaFinalTitle", title: "Title", type: "text", rows: 2, fieldset: "ctaFinal", group: "footer" },
    { name: "ctaFinalDescription", title: "Description", type: "text", rows: 3, fieldset: "ctaFinal", group: "footer" },
    { name: "ctaFinalButton", title: "CTA Button", type: "ctaButton", fieldset: "ctaFinal", group: "footer" },

    // --- Footer ---
    { name: "footerTagline", title: "Tagline", type: "text", rows: 2, fieldset: "footer", group: "footer" },
    { name: "footerBrandLine1", title: "Brand Line 1", type: "string", fieldset: "footer", group: "footer" },
    { name: "footerBrandLine2", title: "Brand Line 2", type: "string", fieldset: "footer", group: "footer" },
    { name: "footerCopyright", title: "Copyright", type: "string", fieldset: "footer", group: "footer" },
  ],
});

import { defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  icon: HomeIcon,
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
    { name: "nav", title: "Navegación", options: { collapsible: true, collapsed: false, columns: 2 } },
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "problemaIntro", title: "Introducción Problema", options: { collapsible: true, collapsed: false, columns: 2 } },
    { name: "problemaDark", title: "Problema (Sección Oscura)", options: { collapsible: true, collapsed: false } },
    { name: "pilares", title: "Pilares", options: { collapsible: true, collapsed: false } },
    { name: "paraTi", title: "Para Ti / No Para Ti", options: { collapsible: true, collapsed: false } },
    { name: "proceso", title: "Proceso", options: { collapsible: true, collapsed: false } },
    { name: "resultados", title: "Resultados", options: { collapsible: true, collapsed: false } },
    { name: "portfolio", title: "Portfolio", options: { collapsible: true, collapsed: false } },
    { name: "ctaFinal", title: "CTA Final", options: { collapsible: true, collapsed: false } },
    { name: "footer", title: "Pie de Página", options: { collapsible: true, collapsed: false, columns: 2 } },
  ],
  fields: [
    // --- Nav ---
    { name: "navLinks", title: "Enlaces de Navegación", type: "array", of: [{ type: "navLink" }], fieldset: "nav", group: "nav" },
    { name: "navSocialLinks", title: "Redes Sociales", type: "array", of: [{ type: "socialLink" }], fieldset: "nav", group: "nav" },
    { name: "navCta", title: "Botón de Acción (CTA) Nav", type: "ctaButton", fieldset: "nav", group: "nav" },

    // --- Hero ---
    { name: "heroHeadline1", title: "Titular Línea 1", type: "string", fieldset: "hero", group: "hero" },
    { name: "heroHeadline2", title: "Titular Línea 2", type: "string", fieldset: "hero", group: "hero" },
    { name: "heroSubtitle", title: "Subtítulo", type: "text", rows: 3, fieldset: "hero", group: "hero" },
    { name: "heroImage", title: "Imagen Hero", type: "image", options: { hotspot: true }, fieldset: "hero", group: "hero" },
    { name: "heroImageAlt", title: "Texto Alt Imagen Hero", type: "string", fieldset: "hero", group: "hero" },

    // --- Problema Intro ---
    { name: "problemaIntroTitle", title: "Título (permite HTML)", type: "text", rows: 3, fieldset: "problemaIntro", group: "problema" },
    { name: "problemaIntroCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "problemaIntro", group: "problema" },

    // --- Problema Dark ---
    { name: "problemaDarkTitle", title: "Título Principal", type: "text", rows: 3, fieldset: "problemaDark", group: "problema" },
    { name: "problemaDarkSubtitle", title: "Subtítulo", type: "text", rows: 3, fieldset: "problemaDark", group: "problema" },
    { name: "problemaDarkCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "problemaDark", group: "problema" },
    { name: "problemCards", title: "Tarjetas de Problemas", type: "array", of: [{ type: "problemCard" }], fieldset: "problemaDark", group: "problema" },

    // --- Pilares ---
    { name: "pilaresSubtitle", title: "Subtítulo (texto rojo)", type: "string", fieldset: "pilares", group: "pilares" },
    { name: "pilaresTitle", title: "Título", type: "string", fieldset: "pilares", group: "pilares" },
    { name: "pilares", title: "Tarjetas de Pilares", type: "array", of: [{ type: "pilarCard" }], fieldset: "pilares", group: "pilares" },

    // --- Para Ti ---
    { name: "paraTiTitle", title: "Título Sección Para Ti", type: "text", rows: 2, fieldset: "paraTi", group: "paraTi" },
    { name: "paraTiItems", title: "Elementos Para Ti", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi", group: "paraTi" },
    { name: "noParaTiTitle", title: "Título Sección No Para Ti", type: "text", rows: 2, fieldset: "paraTi", group: "paraTi" },
    { name: "noParaTiItems", title: "Elementos No Para Ti", type: "array", of: [{ type: "listItem" }], fieldset: "paraTi", group: "paraTi" },
    { name: "paraTiCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "paraTi", group: "paraTi" },

    // --- Proceso ---
    { name: "procesoTitle", title: "Título", type: "text", rows: 2, fieldset: "proceso", group: "proceso" },
    { name: "procesoSubtitle", title: "Subtítulo", type: "string", fieldset: "proceso", group: "proceso" },
    { name: "procesoSteps", title: "Pasos del Proceso", type: "array", of: [{ type: "processStep" }], fieldset: "proceso", group: "proceso" },

    // --- Resultados ---
    { name: "resultadosTitle", title: "Título", type: "string", fieldset: "resultados", group: "resultados" },
    { name: "resultadosSubtitle", title: "Subtítulo", type: "text", rows: 3, fieldset: "resultados", group: "resultados" },

    // --- Portfolio ---
    { name: "portfolioProjects", title: "Proyectos", type: "array", of: [{ type: "portfolioProject" }], fieldset: "portfolio", group: "portfolio" },

    // --- CTA Final ---
    { name: "ctaFinalTitle", title: "Título", type: "text", rows: 2, fieldset: "ctaFinal", group: "footer" },
    { name: "ctaFinalDescription", title: "Descripción", type: "text", rows: 3, fieldset: "ctaFinal", group: "footer" },
    { name: "ctaFinalButton", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "ctaFinal", group: "footer" },

    // --- Footer ---
    { name: "footerTagline", title: "Slogan / Frase", type: "text", rows: 2, fieldset: "footer", group: "footer" },
    { name: "footerBrandLine1", title: "Línea de Marca 1", type: "string", fieldset: "footer", group: "footer" },
    { name: "footerBrandLine2", title: "Línea de Marca 2", type: "string", fieldset: "footer", group: "footer" },
    { name: "footerCopyright", title: "Copyright / Derechos Reservados", type: "string", fieldset: "footer", group: "footer" },
  ],
});

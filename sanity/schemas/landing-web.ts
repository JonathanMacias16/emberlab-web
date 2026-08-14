import { defineType } from "sanity";
import { DesktopIcon } from "@sanity/icons";

export const landingWeb = defineType({
  name: "landingWeb",
  title: "Landing Web",
  type: "document",
  icon: DesktopIcon,
  groups: [
    { name: "nav", title: "Navegación" },
    { name: "hero", title: "Hero" },
    { name: "intro", title: "Intro" },
    { name: "proyectos", title: "Tipos de Proyecto" },
    { name: "porque", title: "Por Qué Nosotros" },
    { name: "proceso", title: "Así de Simple" },
    { name: "faq", title: "Preguntas" },
    { name: "servicio", title: "Qué Incluye" },
    { name: "casos", title: "Resultados" },
    { name: "cierre", title: "Cierre y Footer" },
  ],
  fieldsets: [
    { name: "nav", title: "Navegación", options: { collapsible: true, collapsed: false, columns: 2 } },
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "intro", title: "Intro + Wordmark", options: { collapsible: true, collapsed: false } },
    { name: "proyectos", title: "Encuentra tu Proyecto", options: { collapsible: true, collapsed: false } },
    { name: "porque", title: "Por Qué Trabajar con Nosotros", options: { collapsible: true, collapsed: false } },
    { name: "proceso", title: "Así de Simple", options: { collapsible: true, collapsed: false } },
    { name: "faq", title: "Antes de Empezar", options: { collapsible: true, collapsed: false } },
    { name: "servicio", title: "Qué Incluye el Servicio", options: { collapsible: true, collapsed: false } },
    { name: "casos", title: "Resultados, No Promesas", options: { collapsible: true, collapsed: false } },
    { name: "ctaBanda", title: "Banda Verde (CTA)", options: { collapsible: true, collapsed: false } },
    { name: "analizador", title: "Analizador de Sitio", options: { collapsible: true, collapsed: false } },
    { name: "contacto", title: "Hablar Directo", options: { collapsible: true, collapsed: false } },
    { name: "footer", title: "Pie de Página", options: { collapsible: true, collapsed: false, columns: 2 } },
  ],
  fields: [
    // --- Nav ---
    { name: "navLinks", title: "Enlaces de Navegación", type: "array", of: [{ type: "navLink" }], fieldset: "nav", group: "nav" },
    { name: "navSocialLinks", title: "Redes Sociales", type: "array", of: [{ type: "socialLink" }], fieldset: "nav", group: "nav" },

    // --- Hero ---
    { name: "heroTitle", title: "Titular", type: "text", rows: 3, fieldset: "hero", group: "hero" },
    { name: "heroSubtitle", title: "Subtítulo (verde)", type: "text", rows: 3, fieldset: "hero", group: "hero" },
    { name: "heroCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "hero", group: "hero" },
    { name: "heroNote", title: "Nota bajo el botón", type: "string", fieldset: "hero", group: "hero" },
    { name: "heroImage", title: "Imagen Hero", type: "image", options: { hotspot: true }, fieldset: "hero", group: "hero" },
    { name: "heroImageAlt", title: "Texto Alt Imagen Hero", type: "string", fieldset: "hero", group: "hero" },

    // --- Intro ---
    { name: "introText", title: "Párrafo de Introducción", type: "text", rows: 4, fieldset: "intro", group: "intro" },
    { name: "introCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "intro", group: "intro" },

    // --- Tipos de proyecto ---
    { name: "projectTypesTitle", title: "Título", type: "text", rows: 2, fieldset: "proyectos", group: "proyectos" },
    { name: "projectTypes", title: "Tipos de Proyecto", type: "array", of: [{ type: "projectTypeCard" }], fieldset: "proyectos", group: "proyectos" },
    { name: "projectTypesNote", title: "Nota (verde, sobre el botón)", type: "text", rows: 2, fieldset: "proyectos", group: "proyectos" },
    { name: "projectTypesCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "proyectos", group: "proyectos" },

    // --- Por qué ---
    { name: "whyTitle", title: "Título", type: "text", rows: 3, fieldset: "porque", group: "porque" },
    { name: "whyReasons", title: "Razones", type: "array", of: [{ type: "reasonItem" }], fieldset: "porque", group: "porque" },

    // --- Así de simple ---
    { name: "stepsTitle", title: "Título", type: "string", fieldset: "proceso", group: "proceso" },
    { name: "steps", title: "Pasos", type: "array", of: [{ type: "simpleStep" }], validation: (R) => R.max(3), fieldset: "proceso", group: "proceso" },
    { name: "stepsCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "proceso", group: "proceso" },

    // --- FAQ ---
    { name: "faqTitle", title: "Título", type: "text", rows: 3, fieldset: "faq", group: "faq" },
    { name: "faqItems", title: "Preguntas", type: "array", of: [{ type: "faqItem" }], fieldset: "faq", group: "faq" },

    // --- Qué incluye ---
    { name: "includesTitle", title: "Título", type: "text", rows: 3, fieldset: "servicio", group: "servicio" },
    { name: "includesItems", title: "Lista de Entregables", type: "array", of: [{ type: "string" }], fieldset: "servicio", group: "servicio" },

    // --- Casos ---
    { name: "casesTitle", title: "Título", type: "text", rows: 2, fieldset: "casos", group: "casos" },
    { name: "cases", title: "Casos de Éxito", type: "array", of: [{ type: "caseStudy" }], fieldset: "casos", group: "casos" },

    // --- Banda verde ---
    { name: "ctaBandText", title: "Texto", type: "text", rows: 2, fieldset: "ctaBanda", group: "cierre" },
    { name: "ctaBandButton", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "ctaBanda", group: "cierre" },

    // --- Analizador ---
    { name: "analyzerTitle", title: "Título", type: "text", rows: 3, fieldset: "analizador", group: "cierre" },
    { name: "analyzerDescription", title: "Descripción", type: "text", rows: 4, fieldset: "analizador", group: "cierre" },
    { name: "analyzerCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "analizador", group: "cierre" },
    { name: "analyzerNote", title: "Nota al pie", type: "text", rows: 3, fieldset: "analizador", group: "cierre" },

    // --- Hablar directo ---
    { name: "contactTitle", title: "Título", type: "text", rows: 2, fieldset: "contacto", group: "cierre" },
    { name: "contactDescription", title: "Descripción", type: "text", rows: 3, fieldset: "contacto", group: "cierre" },
    { name: "contactCta", title: "Botón de Acción (CTA)", type: "ctaButton", fieldset: "contacto", group: "cierre" },

    // --- Footer ---
    { name: "footerTagline", title: "Slogan / Frase", type: "text", rows: 2, fieldset: "footer", group: "cierre" },
    { name: "footerBrandLine1", title: "Línea de Marca 1", type: "string", fieldset: "footer", group: "cierre" },
    { name: "footerBrandLine2", title: "Línea de Marca 2", type: "string", fieldset: "footer", group: "cierre" },
    { name: "footerCopyright", title: "Copyright / Derechos Reservados", type: "string", fieldset: "footer", group: "cierre" },
  ],
  preview: {
    prepare() {
      return {
        title: "Landing Web",
        subtitle: "Editor de Contenidos — /landing",
      };
    },
  },
});

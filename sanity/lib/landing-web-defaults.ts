import type { LandingWebData } from "@/types/sanity";

/**
 * Contenido por defecto de `/landing`, calcado del diseño de Figma
 * (archivo EmberLab, nodo 456:234). Se usa como fallback cuando el
 * documento `landingWeb` todavía no existe en Sanity.
 */
export const defaultLandingWebData: LandingWebData = {
  // --- Nav ---
  navLinks: [
    { label: "Nosotros", href: "#nosotros" },
    { label: "Servicios", href: "#servicios" },
    { label: "Proceso", href: "#proceso" },
    { label: "Preguntas", href: "#preguntas" },
    { label: "Contacto", href: "#contacto" },
  ],
  navSocialLinks: [
    { platform: "fb", url: "https://www.facebook.com/emberlabmx" },
    { platform: "ig", url: "https://www.instagram.com/emberlab.mx/" },
    { platform: "in", url: "https://www.linkedin.com/company/emberlabmx/" },
  ],

  // --- Hero ---
  heroTitle: "Cuéntanos qué necesita tu sitio web.",
  heroSubtitle:
    "Responde unas preguntas y te ayudamos a identificar exactamente qué tipo de proyecto te conviene — sin compromiso.",
  heroCta: { text: "Completa el formulario →", variant: "purple", href: "/brief-web" },
  heroNote: "Toma 2 minutos.",
  heroImageAlt: "Persona sosteniendo una laptop con la leyenda Creative people",

  // --- Intro ---
  introText:
    "En Ember Lab trabajamos la presencia digital completa de tu empresa: contenido estratégico, desarrollo web y branding.\nPor eso tu sitio no se construye aislado — se construye con la misma visión de negocio con la que trabajamos todo lo demás.",
  introCta: { text: "Completa el formulario →", variant: "red", href: "/brief-web" },

  // --- Tipos de proyecto ---
  projectTypesTitle: "Encuentra el proyecto que se parece al tuyo",
  projectTypes: [
    {
      icon: "landing",
      title: "Landing Estratégica",
      description:
        "Para campañas, lanzamientos o servicios específicos que necesitan captar leads rápido.",
    },
    {
      icon: "esencial",
      title: "Sitio Esencial",
      description:
        "Para negocios que están construyendo su presencia digital desde cero: home, servicios, nosotros y contacto.",
    },
    {
      icon: "corporativo",
      title: "Sitio Corporativo",
      description:
        "Para empresas con varias líneas de servicio y mayor estructura comercial.",
    },
    {
      icon: "rediseno",
      title: "Rediseño Web",
      description: "Para marcas que ya tienen sitio, pero necesitan actualizarlo.",
    },
  ],
  projectTypesNote: "¿No sabes cuál te conviene?  Para eso es el formulario.",
  projectTypesCta: { text: "Completa el formulario →", variant: "purple", href: "/brief-web" },

  // --- Por qué ---
  whyTitle: "Por qué trabajar con nosotros",
  whyReasons: [
    {
      title: "Estrategia primero:",
      description:
        "entendemos tu negocio antes de diseñar — no empezamos por la estética.",
    },
    {
      title: "Proceso claro:",
      description:
        "trabajamos con un proceso definido, no con plantillas genéricas ni promesas al aire.",
    },
    {
      title: "Dirección real:",
      description:
        "cualquier herramienta puede generarte un sitio rápido. Nosotros te ayudamos a construir uno con dirección, personalidad y sentido de negocio.",
    },
    {
      title: "Clientes reales:",
      description:
        "empresas como Pixeron, Mita Residential y Carolina Performance Fabrics ya confían en nosotros para su presencia digital.",
    },
  ],

  // --- Así de simple ---
  stepsTitle: "Así de simple",
  steps: [
    {
      number: "01",
      title: "Completa el formulario",
      description: "cuéntanos sobre tu negocio y tu proyecto.",
    },
    {
      number: "02",
      title: "Identificamos qué necesitas",
      description: "sitio nuevo, rediseño, optimización o algo distinto.",
    },
    {
      number: "03",
      title: "Agenda tu llamada de diagnóstico",
      description: "ahí hablamos de alcance, tiempos e inversión.",
    },
  ],
  stepsCta: { text: "Completa el formulario →", variant: "purple", href: "/brief-web" },

  // --- Preguntas ---
  faqTitle: "Esto es lo que debes saber antes de empezar",
  faqItems: [
    {
      question: "¿Es muy caro?",
      answer:
        "No cobramos por cobrar. Cotizamos según lo que tu proyecto realmente necesita, no con paquetes forzados.",
    },
    {
      question: "¿Cuánto tiempo toma?",
      answer:
        "Varía según el proyecto, pero sabrás los tiempos exactos antes de arrancar — sin sorpresas.",
    },
    {
      question: "¿Trabajan con empresas como la mía?",
      answer:
        "Trabajamos con empresas B2B, de ciclos de venta largos y productos técnicos. No partimos de cero cada vez.",
    },
    {
      question: "¿Qué pasa si no tengo todo listo (marca, contenido, fotos)?",
      answer:
        "No es un obstáculo. Para eso empezamos con un diagnóstico — te ayudamos a definir lo que falta.",
    },
  ],

  // --- Qué incluye ---
  includesTitle: "¿Qué incluye nuestro servicio web?",
  includesItems: [
    "Arquitectura y estructura del sitio",
    "Diseño UX/UI personalizado, no plantillas genéricas",
    "Desarrollo web responsivo",
    "Optimización para móvil",
    "Formularios e integraciones (WhatsApp, CRM y más)",
    "SEO básico",
    "IA aplicada, cuando el proyecto lo necesita",
    "Publicación y entrega de accesos",
  ],

  // --- Casos ---
  casesTitle: "Resultados, no promesas",
  cases: [
    {
      title: "Carolina Performance Fabrics",
      description:
        "Más de cuatro años acompañando su evolución digital con estrategia, contenido y desarrollo continuo.",
      imageAlt: "Sitio de Carolina Performance Fabrics en una laptop",
      linkLabel: "Ver sitio",
    },
    {
      title: "Estate Taurus",
      description:
        "Más de cuatro años acompañando su evolución digital con estrategia, contenido y desarrollo continuo.",
      imageAlt: "Sitio de Estate Taurus",
      linkLabel: "Ver sitio",
    },
    {
      title: "Grizzly Adventure Outdoor",
      description:
        "Más de cuatro años acompañando su evolución digital con estrategia, contenido y desarrollo continuo.",
      imageAlt: "Sitio de Grizzly Adventure Outdoor",
      linkLabel: "Ver sitio",
    },
    {
      title: "Pixeron",
      description:
        "Su sitio comunicaba una versión antigua del negocio. Rediseñamos, reestructuramos el contenido e integramos IA para captar leads automáticamente.",
      imageAlt: "Sitio de Pixeron en un teléfono",
      linkLabel: "Ver sitio",
    },
  ],

  // --- Banda verde ---
  ctaBandText: "¿Listo para saber qué necesita tu sitio?\nToma 2 minutos.",
  ctaBandButton: { text: "Completa el formulario →", variant: "purple", href: "/brief-web" },

  // --- Analizador ---
  analyzerTitle: "¿Ya tienes sitio web y solo quieres saber en qué puede mejorar?",
  analyzerDescription:
    "Prueba nuestro analizador automático. Revisa tu sitio y te da mejoras concretas — sin costos, sin compromiso, sin necesidad de agendar nada.",
  analyzerCta: { text: "Analizar mi sitio →", variant: "red", href: "/brief-web" },
  analyzerNote:
    "Nota: no reemplaza el formulario ni la llamada de diagnóstico. Es solo un primer vistazo automático a lo que ya tienes.",

  // --- Hablar directo ---
  contactTitle: "¿Prefieres hablar directo con alguien?",
  contactDescription:
    "Si prefieres saltarte el formulario y hablar directo con nuestro equipo, también podemos hacerlo.",
  contactCta: {
    text: "Agenda una llamada de diagnóstico →",
    variant: "red",
    href: "https://wa.me/525554964439",
    target: "_blank",
  },

  // --- Footer ---
  footerTagline: "Nos apasiona la tecnología\ny el desarrollo de marcas con sentido.",
  footerBrandLine1: "CREATIVE",
  footerBrandLine2: "WORKS",
  footerCopyright: "Copyright © 2026 EmberLab",
};

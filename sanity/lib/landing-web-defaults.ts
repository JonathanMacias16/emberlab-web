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
        "Desarrollamos un sitio bilingüe para organizar una arquitectura amplia de unidades de negocio, productos y soluciones técnicas. Integramos fichas técnicas actualizadas, disponibilidad de productos, certificaciones y formularios conectados directamente con su CRM. Más que un sitio web, construimos una plataforma que forma parte de la operación comercial de la empresa.",
      imageAlt: "Sitio de Carolina Performance Fabrics",
      linkLabel: "Ver sitio",
    },
    {
      title: "Estate Tauros",
      description:
        "Estate Tauros llegó a nosotros sin identidad gráfica ni presencia digital. Creamos una identidad visual y un sitio web capaces de transmitir la majestuosidad y exclusividad de la propiedad. El resultado: logotipo, tipografías y experiencia web trabajando en conjunto para construir una marca sólida, elegante y coherente.",
      imageAlt: "Sitio de Estate Tauros",
      linkLabel: "Ver sitio",
    },
    {
      title: "Grizzly Adventure",
      description:
        "Desarrollamos un sitio para organizar y presentar de forma clara su catálogo de experiencias outdoor, con galerías, información clave e indicaciones para cada actividad. Además, construimos una presencia digital sólida que respalda su oferta comercial y facilita la colaboración con clientes corporativos.",
      imageAlt: "Sitio de Grizzly Adventure",
      linkLabel: "Ver sitio",
    },
    {
      title: "Pixeron",
      description:
        "El sitio de Pixeron ya no reflejaba la evolución de sus servicios ni comunicaba con claridad su propuesta de valor. Reorganizamos su oferta y desarrollamos una experiencia minimalista, 100% tipográfica, donde la estructura y la jerarquía visual hacen el trabajo. El resultado: un sitio breve, claro y fácil de entender.",
      imageAlt: "Sitio de Pixeron",
      linkLabel: "Ver sitio",
    },
    {
      title: "Batwitz",
      description:
        "Creamos una experiencia digital para dar vida al universo de Batwitz: un sitio colorido, dinámico y lleno de personajes, con animaciones y materiales descargables. Además, desarrollamos un panel interno para facilitar la carga y actualización de nuevos contenidos.",
      imageAlt: "Sitio de Batwitz",
      linkLabel: "Ver sitio",
    },
    {
      title: "Casa Morgandez",
      description:
        "Desarrollamos un sitio que pone al centro la experiencia de Casa Morgandez: su arquitectura, diseño y los paisajes de Punta Mita. Creamos una galería visual amplia y optimizada para una carga rápida, con una navegación minimalista que facilita conocer cada espacio y realizar una reservación directamente desde el sitio.",
      imageAlt: "Sitio de Casa Morgandez",
      linkLabel: "Ver sitio",
    },
    {
      title: "JCMR | Finanzas Saludables",
      description:
        "Acompañamos a JCMR desde el día cero, construyendo su estrategia, identidad y presencia digital. El sitio web integra su oferta comercial, alianzas y propuesta de valor dentro de una experiencia clara y profesional. Más que diseñar una página, creamos el ecosistema digital que necesitaban para comenzar a posicionar su marca.",
      imageAlt: "Sitio de JCMR Finanzas Saludables",
      linkLabel: "Ver sitio",
    },
    {
      title: "Lilian Cazares",
      description:
        "Creamos un sitio pensado para evolucionar junto con una emprendedora en constante crecimiento. Lo que comenzó como una landing de servicios hoy es una plataforma robusta con contenido, recursos descargables, blog y una academia por suscripción. Un ecosistema digital flexible que crece al ritmo de su marca y de nuevas oportunidades de negocio.",
      imageAlt: "Sitio de Lilian Cazares",
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

import type { LandingPageData } from "@/types/sanity";

export const defaultLandingPageData: LandingPageData = {
  // Nav
  navLinks: [
    { label: "Bienvenido", href: "#bienvenido" },
    { label: "\u00bfQu\u00e9 resolvemos?", href: "#problema" },
    { label: "4 pilares", href: "#pilares" },
    { label: "Resultados", href: "#resultados" },
  ],
  navSocialLinks: [
    { platform: "fb", url: "https://facebook.com" },
    { platform: "ig", url: "https://instagram.com" },
    { platform: "in", url: "https://linkedin.com" },
  ],
  navCta: { text: "Evaluar mi sitio web", variant: "purple" },

  // Hero
  heroHeadline1: "Un sitio web",
  heroHeadline2: "Es una decisi\u00f3n estrat\u00e9gica.",
  heroSubtitle:
    "Dise\u00f1amos y desarrollamos sitios web claros, funcionales y personalizados, alineados a los objetivos reales de tu negocio.",
  heroImageAlt: "EmberLab - Dise\u00f1o web estrat\u00e9gico",

  // Problema Intro
  problemaIntroTitle: "El problema no es tu empresa.\nEs tu sitio web.",
  problemaIntroCta: { text: "Cont\u00e1ctanos", variant: "red" },

  // Problema Dark
  problemaDarkTitle:
    "Muchas empresas crecen, cambian y evolucionan... pero sus sitios web se quedan atr\u00e1s.",
  problemaDarkSubtitle:
    "No comunican lo que son hoy, no ayudan a decidir, y no acompa\u00f1an la transformaci\u00f3n digital que necesitan.",
  problemaDarkCta: { text: "Hablemos de tu web", variant: "red" },
  problemCards: [
    {
      text: "Olvidate de sitios lentos o poco claros, con estructuras confusas.",
      imageAlt: "Sitios lentos",
      bgColor: "var(--green-light)",
      textColorVariant: "purple",
    },
    {
      text: "Dile adios al dise\u00f1o gen\u00e9rico, con poca identidad.",
      imageAlt: "Dise\u00f1o gen\u00e9rico",
      bgColor: "var(--purple-soft)",
      textColorVariant: "white",
    },
    {
      text: "Plataformas escalables, para crecer.",
      imageAlt: "Plataformas escalables",
      bgColor: "var(--purple-light)",
      textColorVariant: "purple",
    },
  ],

  // Pilares
  pilaresSubtitle: "4 pilares claros",
  pilaresTitle: "Qu\u00e9 hacemos diferente.",
  pilares: [
    {
      title: "Plataformas seg\u00fan el objetivo",
      description:
        "No creemos en una sola soluci\u00f3n para todos. Trabajamos con diferentes plataformas seg\u00fan lo que tu negocio necesita hoy y ma\u00f1ana.",
      bgColor: "bg-[#caa4cc]",
      textColor: "text-[var(--purple)]",
      position: "left-[34.8%] top-[12.9%]",
      rotation: "z-40",
    },
    {
      title: "Estructuras Claras",
      description:
        "Organizamos la informaci\u00f3n para que el usuario entienda, conf\u00ede y act\u00fae.",
      bgColor: "bg-[var(--purple)]",
      textColor: "text-[#edeae7]",
      position: "left-[59.8%] top-[20.1%]",
      rotation: "-rotate-[9deg] z-30",
    },
    {
      title: "Dise\u00f1o Personalizado",
      description:
        "Cada sitio se dise\u00f1a desde cero, alineado a tu marca y a tus objetivos, no desde plantillas gen\u00e9ricas.",
      bgColor: "bg-[var(--green-light)]",
      textColor: "text-[var(--purple)]",
      position: "left-[7.4%] top-[30%]",
      rotation: "rotate-[9deg] z-20",
    },
    {
      title: "Funcionalidad Real",
      description:
        "Dise\u00f1amos para que tu sitio funcione: r\u00e1pido, claro y medible.",
      bgColor: "bg-[#f3a5a6]",
      textColor: "text-[var(--purple)]",
      position: "left-[36.3%] top-[28.5%]",
      rotation: "z-10",
    },
  ],

  // Para Ti
  paraTiTitle: "Este servicio es\npara ti si\u2026",
  paraTiItems: [
    { emoji: "\ud83d\udd25", text: "Tu empresa ha crecido y tu web ya no la representa" },
    { emoji: "\ud83d\udd25", text: "Necesitas digitalizar procesos o comunicaci\u00f3n" },
    { emoji: "\ud83d\udd25", text: "Tomas decisiones de marketing o negocio" },
    { emoji: "\ud83d\udd25", text: "Buscas claridad antes de ejecutar" },
  ],
  noParaTiTitle: "Y no es para\nti si\u2026",
  noParaTiItems: [
    { emoji: "\u274c", text: "Solo buscas \u201cun redise\u00f1o r\u00e1pido\u201d" },
    { emoji: "\u274c", text: "No tienes objetivos claros" },
    { emoji: "\u274c", text: "Quieres una plantilla sin estrategia" },
  ],
  paraTiCta: { text: "Evaluar mi sitio web", variant: "purple" },

  // Proceso
  procesoTitle: "Nuestro proceso\nes claro.",
  procesoSubtitle: "Sin promesas exageradas. Sin tecno-palabras innecesarias.",
  procesoSteps: [
    { text: "Entendemos tu negocio y objetivos" },
    { text: "Definimos la estructura correcta" },
    { text: "Dise\u00f1amos con criterio" },
    { text: "Desarrollamos sobre la plataforma adecuada" },
    { text: "Entregamos un sitio listo para crecer contigo" },
  ],

  // Resultados
  resultadosTitle: "El resultado no es solo un nuevo sitio.",
  resultadosSubtitle:
    "Es claridad. Es una mejor toma de decisiones. Es una base digital alineada a la transformaci\u00f3n de tu empresa.",

  // Portfolio
  portfolioProjects: [
    { title: "Sitio web industria B2B" },
    { title: "Sitio web Real Estate" },
    { title: "Sitio web Outdoor" },
    { title: "Sitio web Medicina" },
  ],

  // CTA Final
  ctaFinalTitle: "Empecemos\ncon claridad.",
  ctaFinalDescription:
    "Si tu sitio web ya no acompa\u00f1a el momento de tu empresa, es momento de repensarlo.",
  ctaFinalButton: { text: "Evaluar mi sitio actual", variant: "red" },

  // Footer
  footerTagline:
    "Nos apasiona la tecnolog\u00eda\ny el desarrollo de marcas con sentido.",
  footerBrandLine1: "CREATIVE",
  footerBrandLine2: "WORKS",
  footerCopyright: "Copyright \u00a9 2026 EmberLab",
};

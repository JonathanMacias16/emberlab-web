"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoIcon from "@/components/ui/LogoIcon";
import { trackEvent } from "@/lib/analytics";

type Answers = Record<string, string | string[] | undefined>;

interface Option {
  label: string;
  value: string;
  score?: number;
}

/**
 * A qué eje de calificación del lead aporta esta pregunta:
 * - "quality": qué tan buen lead es (presupuesto, urgencia, autoridad, claridad) — decide si conviene tomarlo.
 * - "readiness": qué tan preparado llega (dominio, marca, contenido) — mide el trabajo de arranque, no la calidad del lead.
 * Sin categoría = no participa en ningún score (datos de contacto, bifurcaciones, etc.).
 */
type ScoreCategory = "quality" | "readiness";

interface Question {
  id: string;
  type: "text" | "single" | "multi";
  title: string;
  subtitle?: string;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  inputType?: "text" | "email" | "tel";
  /** Regla de validación para preguntas de texto; si se omite el campo se salta la validación. */
  validate?: "minLength" | "email" | "tel" | "url";
  showIf?: (answers: Answers) => boolean;
  category?: ScoreCategory;
  /** Puntos si se responde este campo de texto (dejarlo vacío no otorga estos puntos). */
  answeredScore?: number;
  /** Puntos al omitir este campo de texto (por defecto 0 si no se define). */
  skipScore?: number;
  /** Etiqueta del botón de omitir; por defecto "Prefiero no responder". */
  skipLabel?: string;
  /** Máximo de opciones seleccionables en preguntas tipo "multi". */
  maxSelect?: number;
}

const QUESTIONS: Question[] = [
  // Intro
  {
    id: "name",
    type: "text",
    title: "Nombre completo",
    placeholder: "Tu nombre",
    required: true,
    validate: "minLength",
  },
  {
    id: "business",
    type: "text",
    title: "Nombre de tu empresa o marca",
    placeholder: "Nombre de tu empresa o marca",
    required: true,
    validate: "minLength",
  },
  {
    id: "description",
    type: "text",
    title: "¿A qué se dedica tu empresa o proyecto?",
    subtitle: "Aquí puedes contarnos brevemente qué vendes, qué ofreces o qué problema resuelves.",
    placeholder: "Cuéntanos brevemente...",
    validate: "minLength",
  },
  {
    id: "hasSocial",
    type: "single",
    title: "¿Tienes redes sociales activas?",
    category: "readiness",
    options: [
      { label: "Sí", value: "si", score: 1 },
      { label: "No", value: "no", score: -1 },
      { label: "Estamos por abrirlas", value: "pronto", score: -1 },
    ],
  },
  {
    id: "socialLinks",
    type: "text",
    title: "Comparte tus links de Instagram, Facebook, LinkedIn, TikTok u otras redes",
    placeholder: "https://instagram.com/tunegocio",
    showIf: (a) => a.hasSocial === "si",
    category: "readiness",
    validate: "url",
    answeredScore: 1,
    skipScore: 0,
    skipLabel: "Prefiero no decirlo",
  },
  {
    id: "hasWebsite",
    type: "single",
    title: "¿Actualmente tienes sitio web?",
    options: [
      { label: "Sí, ya tengo sitio web", value: "si", score: 0 },
      { label: "No, todavía no tengo sitio web", value: "no", score: 0 },
    ],
  },
  // Rama: ya tiene sitio
  {
    id: "currentLink",
    type: "text",
    title: "Comparte el link de tu sitio actual",
    placeholder: "www.tumarca.com",
    showIf: (a) => a.hasWebsite === "si",
    category: "readiness",
    validate: "url",
    answeredScore: 1,
  },
  {
    id: "platform",
    type: "single",
    title: "¿Sabes en qué plataforma está desarrollado tu sitio?",
    category: "readiness",
    options: [
      { label: "WordPress", value: "wordpress", score: 0 },
      { label: "Wix", value: "wix", score: 0 },
      { label: "Shopify", value: "shopify", score: 0 },
      { label: "Webflow", value: "webflow", score: 0 },
      { label: "Código personalizado", value: "codigo", score: -1 },
      { label: "No estoy seguro/a", value: "noseguro", score: -1 },
      { label: "Otro", value: "otro", score: -1 },
    ],
    showIf: (a) => a.hasWebsite === "si",
  },
  {
    id: "improveAreas",
    type: "multi",
    title: "¿Qué quieres mejorar de tu sitio actual?",
    subtitle: "Puedes seleccionar más de una opción.",
    category: "readiness",
    options: [
      { label: "Diseño visual", value: "diseno", score: 1 },
      { label: "Estructura del sitio", value: "estructura", score: -1 },
      { label: "Textos", value: "textos", score: 1 },
      { label: "Velocidad", value: "velocidad", score: 1 },
      { label: "Experiencia en celular", value: "movil", score: 1 },
      { label: "Posicionamiento en Google", value: "seo", score: -1 },
      { label: "Formularios o botones de contacto", value: "contacto", score: -1 },
      { label: "Integración con WhatsApp", value: "whatsapp", score: 1 },
      { label: "Tienda en línea", value: "tienda", score: -1 },
      { label: "Blog o sección de contenidos", value: "blog", score: 1 },
      { label: "No sé exactamente, pero siento que necesita mejorar", value: "noseguro", score: -2 },
    ],
    showIf: (a) => a.hasWebsite === "si",
  },
  {
    id: "contentStatus",
    type: "single",
    title: "¿La información actual de tu sitio sigue siendo correcta?",
    category: "readiness",
    options: [
      { label: "Sí, la información sigue vigente", value: "vigente", score: 2 },
      { label: "Algunas cosas sí, pero necesita actualización", value: "parcial", score: 1 },
      { label: "No, hay que replantear gran parte del contenido", value: "replantear", score: 0 },
      { label: "No estoy seguro/a", value: "noseguro", score: -2 },
    ],
    showIf: (a) => a.hasWebsite === "si",
  },
  {
    id: "graphicResources",
    type: "single",
    title: "¿Tus recursos gráficos están actualizados?",
    subtitle: "Por ejemplo: logotipo, colores, tipografías, fotografías, íconos o manual de marca.",
    category: "readiness",
    options: [
      { label: "Sí, tenemos todo actualizado", value: "listo", score: 2 },
      { label: "Tenemos algunos recursos, pero habría que revisarlos", value: "parcial", score: 1 },
      { label: "No, necesitamos actualizar la parte visual", value: "no", score: -1 },
      { label: "No estoy seguro/a", value: "noseguro", score: -2 },
    ],
    showIf: (a) => a.hasWebsite === "si",
  },
  {
    id: "structureDecision",
    type: "single",
    title: "¿Te gustaría conservar la estructura actual del sitio o replantearla?",
    category: "readiness",
    options: [
      { label: "Me gustaría conservarla y solo mejorarla", value: "conservar", score: 1 },
      { label: "Me gustaría cambiar algunas secciones", value: "algunas", score: 1 },
      { label: "Quiero replantear todo el sitio", value: "todo", score: -1 },
      { label: "Necesito recomendación de Ember Lab", value: "recomendacion", score: -1 },
    ],
    showIf: (a) => a.hasWebsite === "si",
  },
  // Rama: no tiene sitio
  {
    id: "hasDomain",
    type: "single",
    title: "¿Ya cuentas con dominio?",
    subtitle: "Por ejemplo: www.tumarca.com",
    category: "readiness",
    options: [
      { label: "Sí", value: "si", score: 1 },
      { label: "No", value: "no", score: 0 },
      { label: "No estoy seguro/a", value: "noseguro", score: -1 },
    ],
    showIf: (a) => a.hasWebsite === "no",
  },
  {
    id: "hasHosting",
    type: "single",
    title: "¿Ya cuentas con hosting o servidor?",
    category: "readiness",
    options: [
      { label: "Sí", value: "si", score: 1 },
      { label: "No", value: "no", score: 0 },
      { label: "No estoy seguro/a", value: "noseguro", score: -1 },
    ],
    showIf: (a) => a.hasWebsite === "no",
  },
  {
    id: "materialsReady",
    type: "multi",
    title: "¿Qué materiales tienes listos para comenzar?",
    subtitle: "Selecciona todos los que apliquen.",
    category: "readiness",
    options: [
      { label: "Logotipo editable", value: "logo", score: 1 },
      { label: "Manual de marca", value: "manual", score: 2 },
      { label: "Paleta de color", value: "colores", score: 1 },
      { label: "Tipografías", value: "tipografias", score: 1 },
      { label: "Fotografías profesionales", value: "fotos", score: 1 },
      { label: "Textos sobre la empresa", value: "textos-empresa", score: 1 },
      { label: "Textos de servicios o productos", value: "textos-servicios", score: 1 },
      { label: "Testimonios", value: "testimonios", score: 1 },
      { label: "Casos de éxito", value: "casos", score: 1 },
      { label: "Catálogo de productos", value: "catalogo", score: 1 },
      { label: "Información de contacto", value: "contacto", score: 1 },
      { label: "No tengo materiales listos todavía", value: "nada", score: -2 },
    ],
    showIf: (a) => a.hasWebsite === "no",
  },
  {
    id: "siteNeeds",
    type: "multi",
    title: "¿Qué necesitas comunicar en tu sitio?",
    subtitle: "Puedes seleccionar más de una opción.",
    category: "readiness",
    options: [
      { label: "Quiénes somos", value: "quienes-somos", score: 1 },
      { label: "Servicios", value: "servicios", score: 1 },
      { label: "Información Productos", value: "productos", score: 1 },
      { label: "Portafolio o casos de éxito", value: "portafolio", score: 1 },
      { label: "Testimonios", value: "testimonios", score: 1 },
      { label: "Ubicación", value: "ubicacion", score: 1 },
      { label: "Menú en línea", value: "menu", score: 1 },
      { label: "Contacto", value: "contacto", score: 1 },
      { label: "Blog o artículos", value: "blog", score: 1 },
      { label: "Agenda de citas", value: "agenda", score: -1 },
      { label: "Tienda en línea", value: "tienda", score: -1 },
      { label: "Descarga de catálogo", value: "catalogo", score: 0 },
      { label: "No estoy seguro/a, necesito orientación", value: "noseguro", score: -2 },
    ],
    showIf: (a) => a.hasWebsite === "no",
  },
  // Comunes (después de la rama)
  {
    id: "referenceLink",
    type: "text",
    title: "¿Tienes algún sitio web de referencia?",
    subtitle: "Puede ser de tu industria o simplemente un sitio cuyo estilo, estructura o experiencia te guste.",
    placeholder: "www.ejemplo.com",
    category: "readiness",
    validate: "url",
    answeredScore: 1,
    skipScore: -1,
    skipLabel: "Prefiero no decirlo, no tengo",
  },
  {
    id: "mainGoal",
    type: "multi",
    title: "¿Cuál es el objetivo principal de tu sitio web?",
    subtitle: "Selecciona las opciones más importantes, puedes seleccionar hasta 3.",
    maxSelect: 3,
    category: "quality",
    options: [
      { label: "Tener presencia digital profesional", value: "presencia", score: 1 },
      { label: "Explicar mis servicios", value: "explicar-servicios", score: 1 },
      { label: "Vender productos", value: "vender-productos", score: 1 },
      { label: "Vender servicios", value: "vender-servicios", score: 1 },
      { label: "Captar prospectos", value: "prospectos", score: 1 },
      { label: "Agendar asesorías o citas", value: "citas", score: 1 },
      { label: "Lanzar una campaña de anuncios", value: "campana", score: 1 },
      { label: "Llevar tráfico a mi negocio físico", value: "trafico", score: 1 },
      { label: "Crear comunidad", value: "comunidad", score: 1 },
      { label: "Mejorar la imagen actual de mi marca", value: "imagen", score: 1 },
      { label: "No estoy seguro/a, necesito recomendación", value: "noseguro", score: -2 },
    ],
  },
  {
    id: "desiredAction",
    type: "single",
    title: "¿Qué acción te gustaría que hicieran las personas al entrar a tu sitio?",
    category: "quality",
    options: [
      { label: "Enviar mensaje por WhatsApp", value: "whatsapp", score: 1 },
      { label: "Llenar un formulario", value: "formulario", score: 1 },
      { label: "Comprar en línea", value: "comprar", score: 2 },
      { label: "Agendar una cita", value: "cita", score: 1 },
      { label: "Descargar información", value: "descargar", score: 1 },
      { label: "Visitar mi negocio", value: "visitar", score: 1 },
      { label: "Conocer mis servicios", value: "servicios", score: 1 },
      { label: "Solicitar una cotización", value: "cotizacion", score: 1 },
      { label: "Conocer menú", value: "menu", score: 1 },
      { label: "Otra", value: "otra", score: -1 },
    ],
  },
  {
    id: "currentStage",
    type: "single",
    title: "¿En qué etapa estás actualmente?",
    category: "quality",
    options: [
      { label: "Solo estoy explorando opciones", value: "explorando", score: -2 },
      { label: "Ya sé que necesito un sitio web, pero quiero orientación", value: "orientacion", score: 0 },
      { label: "Ya tengo claro lo que necesito", value: "claro", score: 2 },
      { label: "Quiero iniciar lo antes posible", value: "iniciar", score: 2 },
      { label: "Necesito cotización para presentar internamente", value: "cotizacion", score: 1 },
      { label: "Estoy comparando proveedores", value: "comparando", score: 0 },
    ],
  },
  {
    id: "launchTiming",
    type: "single",
    title: "¿Cuándo te gustaría lanzar tu sitio?",
    category: "quality",
    options: [
      { label: "Lo antes posible", value: "asap", score: 2 },
      { label: "En 2 a 4 semanas", value: "2-4-semanas", score: 2 },
      { label: "En 1 a 2 meses", value: "1-2-meses", score: 1 },
      { label: "En más de 2 meses", value: "mas-2-meses", score: 0 },
      { label: "No tengo fecha definida", value: "sin-fecha", score: -2 },
    ],
  },
  {
    id: "budget",
    type: "single",
    title: "¿Tienes un presupuesto estimado para este proyecto?",
    category: "quality",
    options: [
      { label: "Menos de $8,000", value: "menos-8", score: 0 },
      { label: "Menos de $18,000 MXN", value: "menos-18", score: 1 },
      { label: "Menos de $25,000", value: "menos-25", score: 1 },
      { label: "Aún no tengo presupuesto definido", value: "sin-definir", score: -1 },
      { label: "Necesito una recomendación según el alcance", value: "recomendacion", score: 0 },
    ],
  },
  {
    id: "email",
    type: "text",
    title: "Correo electrónico",
    placeholder: "tu@correo.com",
    required: true,
    inputType: "email",
    validate: "email",
  },
  {
    id: "whatsapp",
    type: "text",
    title: "WhatsApp",
    placeholder: "10 dígitos",
    inputType: "tel",
    validate: "tel",
  },
  {
    id: "contactTime",
    type: "single",
    title: "¿Cuál es el mejor horario para contactarte?",
    options: [
      { label: "Por la mañana (9:00 a.m. – 12:00 p.m.)", value: "manana", score: 0 },
      { label: "Al medio día (12:00 p.m. – 2:00 p.m.)", value: "mediodia", score: 0 },
      { label: "Por la tarde (2:00 p.m. – 6:00 p.m.)", value: "tarde", score: 0 },
      { label: "Cualquier horario", value: "cualquiera", score: 0 },
    ],
  },
];

function isVisible(q: Question, answers: Answers) {
  return !q.showIf || q.showIf(answers);
}

function findNextIndex(fromIndex: number, answers: Answers) {
  for (let i = fromIndex + 1; i < QUESTIONS.length; i++) {
    if (isVisible(QUESTIONS[i], answers)) return i;
  }
  return -1;
}

function optionLabel(question: Question, value: string) {
  return question.options?.find((o) => o.value === value)?.label ?? value;
}

function optionScore(question: Question, value: string) {
  return question.options?.find((o) => o.value === value)?.score ?? 0;
}

/** Puntaje máximo que puede aportar una pregunta de opción múltiple, sin importar cuántas opciones tenga. */
/**
 * Puntos obtenidos por la respuesta actual a una pregunta (0 si no aplica a su tipo).
 * En preguntas de opción múltiple se usa el PROMEDIO de las opciones elegidas, no la suma:
 * así el puntaje refleja qué tan buenas son las elecciones y no simplemente cuántas se marcaron
 * (marcar más casillas ya no infla el resultado por sí solo).
 */
function answerScore(question: Question, value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    if (value.length === 0) return 0;
    const sum = value.reduce((total, v) => total + optionScore(question, v), 0);
    return Math.round(sum / value.length);
  }
  if (question.type === "single") {
    return value ? optionScore(question, value) : 0;
  }
  if (question.type === "text") {
    if (value) return question.answeredScore ?? 0;
    return question.skipScore ?? 0;
  }
  return 0;
}

/** Mejor puntaje posible para una pregunta, usado como referencia del máximo alcanzable. */
function maxQuestionScore(question: Question) {
  if (question.type === "single" || question.type === "multi") {
    // El promedio nunca puede superar la mejor opción individual disponible.
    return Math.max(0, ...(question.options?.map((o) => o.score ?? 0) ?? [0]));
  }
  if (question.type === "text") {
    return Math.max(question.answeredScore ?? 0, question.skipScore ?? 0, 0);
  }
  return 0;
}

type SummaryEntry = { q: Question; value: string | string[] | undefined; score: number };

interface AxisScore {
  percent: number;
  max: number;
  positive: number;
  negative: number;
}

/**
 * Calcula el score de un eje (calidad o preparación) usando solo las preguntas
 * de esa categoría que el cliente realmente respondió.
 */
function computeAxisScore(entries: SummaryEntry[], category: ScoreCategory): AxisScore {
  const axisEntries = entries.filter(({ q }) => q.category === category);
  const max = axisEntries.reduce((sum, { q }) => sum + maxQuestionScore(q), 0);
  const positive = axisEntries.reduce((sum, { score }) => (score > 0 ? sum + score : sum), 0);
  const negative = axisEntries.reduce((sum, { score }) => (score < 0 ? sum + score : sum), 0);
  const percent = max > 0 ? Math.round(((positive + negative) / max) * 100) : 0;
  return { percent, max, positive, negative };
}

const COUNTRY_CODES = [
  { code: "+52", label: "México" },
  { code: "+1", label: "Estados Unidos" },
  { code: "+57", label: "Colombia" },
  { code: "+34", label: "España" },
  { code: "+54", label: "Argentina" },
  { code: "+51", label: "Perú" },
  { code: "+56", label: "Chile" },
  { code: "+502", label: "Guatemala" },
];

function parsePhone(value: string) {
  const match = value.match(/^(\+\d{1,4})\s(.*)$/);
  if (match) return { code: match[1], number: match[2] };
  return { code: COUNTRY_CODES[0].code, number: value };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([/?#].*)?$/i;

/** Valida el texto de un campo (sin contar el código de país en los de teléfono) y devuelve un mensaje de error o null si es válido. */
function validateText(rule: Question["validate"], rawValue: string): string | null {
  const value = rawValue.trim();
  if (!value) return null;
  switch (rule) {
    case "minLength":
      return value.length >= 3 ? null : "Escribe al menos 3 caracteres.";
    case "email":
      return EMAIL_PATTERN.test(value) ? null : "Escribe un correo válido, ej. tu@correo.com";
    case "tel": {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15 ? null : "Escribe un número de teléfono válido.";
    }
    case "url":
      return URL_PATTERN.test(value) ? null : "Escribe un sitio web válido, ej. www.tumarca.com";
    default:
      return null;
  }
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: 1 | -1) => ({ opacity: 0, x: direction * -32 }),
};

export default function BriefForm() {
  const [answers, setAnswers] = useState<Answers>({});
  const [history, setHistory] = useState<number[]>([0]);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentIndex = history[history.length - 1];
  const currentQuestion = QUESTIONS[currentIndex];

  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((q) => isVisible(q, answers)),
    [answers]
  );
  const totalSteps = Math.max(visibleQuestions.length, history.length);
  const stepNumber = Math.min(history.length, totalSteps);
  const progress = done ? 100 : Math.round((stepNumber / totalSteps) * 100);

  function commit(value: string | string[]) {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    const next = findNextIndex(currentIndex, newAnswers);
    setDirection(1);
    if (next === -1) {
      setDone(true);
    } else {
      setHistory((h) => [...h, next]);
    }
  }

  function handleBack() {
    if (history.length <= 1) return;
    setDirection(-1);
    setDone(false);
    setHistory((h) => h.slice(0, -1));
  }

  // Solo se consideran las preguntas que el cliente realmente respondió
  // (las de tipo "single"/"multi" siempre se responden; las de texto se
  // excluyen si se omitieron), para que el máximo posible no se infle con
  // preguntas que no aplicaron.
  const summaryEntries = visibleQuestions
    .map((q) => ({ q, value: answers[q.id], score: answerScore(q, answers[q.id]) }))
    .filter(({ value }) => value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0));

  const qualityScore = computeAxisScore(summaryEntries, "quality");
  const readinessScore = computeAxisScore(summaryEntries, "readiness");

  function axisSummaryLines(label: string, axis: AxisScore) {
    return [
      `${label}: ${axis.percent}%`,
      `  Máximo posible: ${axis.max} puntos · Suma: +${axis.positive} · Resta: ${axis.negative}`,
    ].join("\n");
  }

  function summaryText() {
    const lines = summaryEntries.map(({ q, value, score }) => {
      const display = Array.isArray(value)
        ? value.map((v) => optionLabel(q, v)).join(", ")
        : q.type === "single"
          ? optionLabel(q, value as string)
          : (value as string);
      const sign = score > 0 ? "+" : "";
      return `${q.title}\n${display} (${sign}${score})`;
    });
    return [
      axisSummaryLines("Calidad de lead", qualityScore),
      axisSummaryLines("Preparación", readinessScore),
      ...lines,
    ].join("\n\n");
  }

  const emailSentRef = useRef(false);

  useEffect(() => {
    if (!done || emailSentRef.current) return;
    emailSentRef.current = true;
    fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: answers.name ?? "",
        business: answers.business ?? "",
        email: answers.email ?? "",
        whatsapp: answers.whatsapp ?? "",
        qualityScore,
        readinessScore,
        summaryText: summaryText(),
      }),
    }).catch(() => {});

    // La conversión que optimizan los anuncios: brief completado.
    trackEvent("Lead", {
      content_name: "Brief web completado",
      value: qualityScore.percent,
    });
    // Solo debe dispararse una vez, al completar el formulario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <main className="min-h-screen w-full bg-(--purple) flex flex-col">
      {/* Header */}
      <div className="flex items-center px-5 sm:px-8 md:px-12 py-5 sm:py-6 flex-shrink-0">
        <Link href="/landing" aria-label="Volver a EmberLab" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 px-5 sm:px-8 md:px-12 flex-shrink-0">
        <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full rounded-full transition-[width] duration-400 ease-out"
            style={{
              backgroundColor: done ? "var(--green-light)" : "var(--red)",
              width: `${progress}%`,
            }}
          />
        </div>
        <span
          className={`text-sm font-semibold tabular-nums w-11 text-right flex-shrink-0 transition-colors ${
            done ? "text-(--green-light)" : "text-(--purple-light)"
          }`}
        >
          {progress}%
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 md:px-12 py-10 sm:py-14">
        <div className={`w-full ${(currentQuestion.options?.length ?? 0) > 6 && !done ? "max-w-3xl" : "max-w-2xl"}`}>
          {!done && history.length > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 mb-5 px-4 py-2 rounded-full text-sm font-semibold text-(--white) transition-colors cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Atrás
            </button>
          )}
          {!done ? (
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuestionScreen question={currentQuestion} value={answers[currentQuestion.id]} onAnswer={commit} />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <SummaryScreen />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

function QuestionScreen({
  question,
  value,
  onAnswer,
}: {
  question: Question;
  value: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
}) {
  const isPhone = question.inputType === "tel";
  const initialPhone = isPhone && typeof value === "string" ? parsePhone(value) : null;
  const [text, setText] = useState(typeof value === "string" ? (initialPhone ? initialPhone.number : value) : "");
  const [countryCode, setCountryCode] = useState(initialPhone?.code ?? COUNTRY_CODES[0].code);
  const [selected, setSelected] = useState<string[]>(Array.isArray(value) ? value : []);
  const [singleValue, setSingleValue] = useState(typeof value === "string" ? value : "");
  const [error, setError] = useState<string | null>(null);

  function submitText(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (question.required && !trimmed) {
      setError("Este campo es obligatorio.");
      return;
    }
    const validationError = validateText(question.validate, trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAnswer(isPhone && trimmed ? `${countryCode} ${trimmed}` : trimmed);
  }

  function handleTextChange(v: string) {
    setText(v);
    if (error) setError(null);
  }

  function toggleMulti(v: string) {
    setSelected((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (question.maxSelect && prev.length >= question.maxSelect) return prev;
      return [...prev, v];
    });
  }

  return (
    <div>
      <h1 className="text-(--white) text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.04em] leading-[1.05]">
        {question.title}
      </h1>
      {question.subtitle && (
        <p className="text-(--purple-light) text-base sm:text-lg mt-3 font-light">{question.subtitle}</p>
      )}

      <div className="mt-8 sm:mt-10">
        {question.type === "text" && (
          <form onSubmit={submitText} noValidate className="flex flex-col gap-4">
            {isPhone ? (
              <div className="flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent border-b-2 pb-3 text-xl sm:text-2xl text-(--white) outline-none transition-colors focus:border-(--red) cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} style={{ color: "#000" }}>
                      {c.code} {c.label}
                    </option>
                  ))}
                </select>
                <input
                  autoFocus
                  type="tel"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={question.placeholder}
                  className="flex-1 bg-transparent border-b-2 pb-3 text-xl sm:text-2xl text-(--white) placeholder:text-(--purple-soft) outline-none transition-colors focus:border-(--red)"
                  style={{ borderColor: error ? "var(--red-light)" : "rgba(255,255,255,0.2)" }}
                />
              </div>
            ) : (
              <input
                autoFocus
                type={question.inputType ?? "text"}
                required={question.required}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={question.placeholder}
                className="w-full bg-transparent border-b-2 pb-3 text-xl sm:text-2xl text-(--white) placeholder:text-(--purple-soft) outline-none transition-colors focus:border-(--red)"
                style={{ borderColor: error ? "var(--red-light)" : "rgba(255,255,255,0.2)" }}
              />
            )}
            {error && (
              <p className="text-sm -mt-2" style={{ color: "var(--red-light)" }}>
                {error}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="submit"
                className="bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-7 py-3.5 text-base font-bold tracking-[-0.03em] transition-all cursor-pointer"
              >
                Continuar
              </button>
              {!question.required && (
                <button
                  type="button"
                  onClick={() => onAnswer("")}
                  className="text-sm text-(--purple-light) hover:text-(--white) transition-colors cursor-pointer"
                >
                  {question.skipLabel ?? "Prefiero no responder"}
                </button>
              )}
            </div>
          </form>
        )}

        {question.type === "single" && (
          <div className="flex flex-col gap-4">
            <div className={`grid gap-3 ${(question.options?.length ?? 0) > 6 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {question.options?.map((opt) => {
                const isSelected = singleValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSingleValue(opt.value)}
                    className="flex items-center gap-3 text-left rounded-2xl px-5 py-4 text-lg sm:text-xl text-(--white) transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? "var(--red)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isSelected ? "var(--red)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        border: `2px solid ${isSelected ? "var(--white)" : "rgba(255,255,255,0.35)"}`,
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--white)" }}
                        />
                      )}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onAnswer(singleValue)}
              disabled={!singleValue}
              className="self-start bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-7 py-3.5 text-base font-bold tracking-[-0.03em] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed mt-2"
            >
              Continuar
            </button>
          </div>
        )}

        {question.type === "multi" && (
          <div className="flex flex-col gap-4">
            <div className={`grid gap-3 ${(question.options?.length ?? 0) > 6 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {question.options?.map((opt) => {
                const isSelected = selected.includes(opt.value);
                const isMaxed = !isSelected && !!question.maxSelect && selected.length >= question.maxSelect;
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleMulti(opt.value)}
                    disabled={isMaxed}
                    className="flex items-center gap-3 text-left rounded-2xl px-5 py-4 text-lg sm:text-xl text-(--white) transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isSelected ? "var(--red)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${isSelected ? "var(--red)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-md"
                      style={{
                        width: 20,
                        height: 20,
                        border: `2px solid ${isSelected ? "var(--white)" : "rgba(255,255,255,0.35)"}`,
                        backgroundColor: isSelected ? "var(--white)" : "transparent",
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onAnswer(selected)}
              disabled={selected.length === 0}
              className="self-start bg-(--red) hover:brightness-110 text-(--white) rounded-2xl px-7 py-3.5 text-base font-bold tracking-[-0.03em] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed mt-2"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryScreen() {
  return (
    <div>
      {/* Palomita en verde: el mismo acento afirmativo que usa la marca, para que
          se lea de inmediato que el formulario ya terminó. */}
      <div
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-6"
        style={{ backgroundColor: "rgba(199,221,163,0.15)", border: "1px solid var(--green-light)" }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--green-light)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-(--green-light) text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.04em] leading-[1.05]">
        Gracias por compartirnos esta información.
      </h1>
      <p className="text-(--white) text-base sm:text-lg mt-3 font-light">
        Con tus respuestas revisaremos en qué etapa se encuentra tu proyecto y te contactaremos para recomendarte el mejor camino para tu sitio web.
      </p>
    </div>
  );
}

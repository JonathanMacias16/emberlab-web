import type { Message } from "./types";

/**
 * Conversación de prueba para no teclear las ocho respuestas cada vez que se
 * revisa el reporte. Solo se usa en desarrollo (ver el botón en `ChatBubble`).
 *
 * Los mensajes del asistente están tal como quedan en pantalla: sin los
 * marcadores [OPCIONES:...] ni [DIAGNOSTICO_COMPLETO], que el chat quita antes
 * de mostrarlos. Así el historial es idéntico al de una charla real y
 * `/api/chat/report` recibe exactamente lo que recibiría en producción.
 */

/** El sitio contra el que se prueba el análisis real. */
export const DEMO_URL = "https://www.soyrocioguerrero.com/";

export const DEMO_TRANSCRIPT: Message[] = [
  {
    role: "assistant",
    content:
      "¡Hola! 👋\nSoy Ember, asistente de Ember Lab.\nEn menos de 3 minutos te ayudaré a identificar oportunidades para mejorar tu sitio web y generar un diagnóstico inicial con recomendaciones prácticas.\nAl final podrás recibir el reporte completo directamente en tu correo.\n¿Comenzamos?",
  },
  { role: "user", content: "Sí, empecemos" },
  { role: "assistant", content: "Antes que nada... ¿Cómo te llamas?" },
  { role: "user", content: "Rocío Guerrero" },
  {
    role: "assistant",
    content: "Mucho gusto, Rocío. ¿Cuál es la dirección de tu sitio web?\nEjemplo: www.tusitio.com",
  },
  { role: "user", content: DEMO_URL },
  {
    role: "assistant",
    content: "¿A qué se dedica tu empresa? Cuéntame brevemente qué productos o servicios ofrecen.",
  },
  {
    role: "user",
    content:
      "Consultoría de brand marketing. Ayudo a marcas que ya tienen tracción a darle dirección a su estrategia: posicionamiento, narrativa y plan de contenidos.",
  },
  {
    role: "assistant",
    content: "¿Cuál es el objetivo principal de tu sitio web hoy?",
  },
  { role: "user", content: "Generar prospectos" },
  {
    role: "assistant",
    content: "¿Quién es tu cliente ideal? Describe el tipo de persona o empresa que buscas atraer.",
  },
  {
    role: "user",
    content:
      "Fundadoras y dueños de negocios de 5 a 50 personas que ya facturan pero sienten que su marca no comunica lo que valen.",
  },
  {
    role: "assistant",
    content: "¿Qué acciones de marketing estás haciendo actualmente?",
  },
  { role: "user", content: "Redes sociales" },
  {
    role: "assistant",
    content: "¿Cuál es tu principal reto con el sitio web?",
  },
  { role: "user", content: "No genera contactos" },
  {
    role: "assistant",
    content: "Si pudieras mejorar una sola cosa de tu sitio este mes, ¿qué sería?",
  },
  {
    role: "user",
    content: "Que quien entra entienda rápido qué hago y me escriba, en vez de solo leer y salirse.",
  },
  {
    role: "assistant",
    content:
      "¡Listo, Rocío! 🎉 Tu diagnóstico inicial está preparado.\n¿A qué correo te gustaría que te enviemos el reporte completo junto con algunas recomendaciones adicionales de nuestro equipo?\nPor favor escribe tu mejor correo electrónico.",
  },
  { role: "user", content: "hola@soyrocioguerrero.com" },
  {
    role: "assistant",
    content:
      "Gracias por confiar en Ember Lab.\nRevisaremos tu información y te enviaremos tu reporte con observaciones, oportunidades y próximos pasos para ayudarte a aprovechar mejor tu presencia digital.\nNos vemos pronto 🚀",
  },
];

import { defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Pregunta Frecuente",
  type: "object",
  fields: [
    { name: "question", title: "Pregunta", type: "string", validation: (R) => R.required() },
    { name: "answer", title: "Respuesta", type: "text", rows: 4 },
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});

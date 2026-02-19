import { defineType } from "sanity";

export const pilarCard = defineType({
  name: "pilarCard",
  title: "Tarjeta de Pilar",
  type: "object",
  fields: [
    { name: "title", title: "Título", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Descripción", type: "string", validation: (R) => R.required() },
    { name: "bgColor", title: "Color de Fondo", type: "string", description: "Clase de Tailwind, ej: bg-[#caa4cc]", readOnly: true },
    { name: "textColor", title: "Color de Texto", type: "string", description: "Clase de Tailwind, ej: text-[var(--purple)]", readOnly: true },
    { name: "position", title: "Posición", type: "string", description: "Clases de Tailwind para posición, ej: left-[34.8%] top-[12.9%]", readOnly: true },
    { name: "rotation", title: "Rotación / Clases Extra", type: "string", description: "Clases de Tailwind para rotación y z-index, ej: -rotate-[9deg] z-30", readOnly: true },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

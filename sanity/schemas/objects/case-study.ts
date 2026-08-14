import { defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Caso de Éxito",
  type: "object",
  fields: [
    { name: "title", title: "Nombre del Cliente", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Descripción", type: "text", rows: 3 },
    { name: "image", title: "Imagen (cuadrada)", type: "image", options: { hotspot: true } },
    { name: "imageAlt", title: "Texto Alt de la Imagen", type: "string" },
    { name: "link", title: "Enlace al Sitio", type: "url" },
    { name: "linkLabel", title: "Texto del Enlace", type: "string", initialValue: "Ver sitio" },
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
});

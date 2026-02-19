import { defineType } from "sanity";

export const problemCard = defineType({
  name: "problemCard",
  title: "Tarjeta de Problema",
  type: "object",
  fields: [
    { name: "text", title: "Texto", type: "string", validation: (R) => R.required() },
    { name: "image", title: "Imagen", type: "image", options: { hotspot: true } },
    { name: "imageAlt", title: "Texto Alternativo (Alt)", type: "string" },
    {
      name: "bgColor",
      title: "Color de Fondo",
      type: "string",
      description: "Nombre de variable CSS, ej: var(--green-light)",
      readOnly: true,
    },
    {
      name: "textColorVariant",
      title: "Variante de Color de Texto",
      type: "string",
      options: { 
        list: [
          { title: "Morado", value: "purple" },
          { title: "Blanco", value: "white" }
        ] 
      },
      initialValue: "purple",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: "text",
      media: "image",
    },
  },
});

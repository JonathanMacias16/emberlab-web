import { defineType } from "sanity";

export const ctaButton = defineType({
  name: "ctaButton",
  title: "Botón de Acción (CTA)",
  type: "object",
  fields: [
    { name: "text", title: "Texto del Botón", type: "string", validation: (R) => R.required() },
    {
      name: "variant",
      title: "Variante / Color",
      type: "string",
      options: { 
        list: [
          { title: "Morado", value: "purple" },
          { title: "Rojo", value: "red" }
        ] 
      },
      initialValue: "purple",
    },
    { name: "href", title: "Enlace (URL o #ID)", type: "string" },
  ],
  preview: {
    select: {
      title: "text",
      subtitle: "variant",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Sin texto",
        subtitle: `Botón: ${subtitle || "estándar"}`,
      };
    },
  },
});

import { defineType } from "sanity";

export const navLink = defineType({
  name: "navLink",
  title: "Enlace de Navegación",
  type: "object",
  fields: [
    { name: "label", title: "Etiqueta", type: "string", validation: (R) => R.required() },
    { name: "href", title: "Enlace (URL o #ID)", type: "string", validation: (R) => R.required() },
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Sin etiqueta",
        subtitle: subtitle || "Sin enlace",
      };
    },
  },
});

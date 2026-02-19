import { defineType } from "sanity";

export const navLink = defineType({
  name: "navLink",
  title: "Nav Link",
  type: "object",
  fields: [
    { name: "label", title: "Label", type: "string", validation: (R) => R.required() },
    { name: "href", title: "Href", type: "string", validation: (R) => R.required() },
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

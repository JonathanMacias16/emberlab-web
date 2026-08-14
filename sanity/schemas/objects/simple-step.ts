import { defineType } from "sanity";

export const simpleStep = defineType({
  name: "simpleStep",
  title: "Paso",
  type: "object",
  fields: [
    { name: "number", title: "Número (ej. 01)", type: "string", validation: (R) => R.required() },
    { name: "title", title: "Título", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Descripción", type: "text", rows: 3 },
  ],
  preview: {
    select: { number: "number", title: "title", subtitle: "description" },
    prepare({ number, title, subtitle }) {
      return { title: `${number ?? ""} ${title ?? ""}`.trim(), subtitle };
    },
  },
});

import { defineType } from "sanity";

export const reasonItem = defineType({
  name: "reasonItem",
  title: "Razón",
  type: "object",
  fields: [
    { name: "title", title: "Título (color destacado)", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Descripción", type: "text", rows: 4 },
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

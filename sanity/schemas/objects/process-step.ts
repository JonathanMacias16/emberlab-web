import { defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Paso del Proceso",
  type: "object",
  fields: [
    { name: "text", title: "Texto del Paso", type: "string", validation: (R) => R.required() },
  ],
  preview: {
    select: {
      title: "text",
    },
  },
});

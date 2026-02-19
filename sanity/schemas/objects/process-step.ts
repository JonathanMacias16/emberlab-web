import { defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  fields: [
    { name: "text", title: "Text", type: "string", validation: (R) => R.required() },
  ],
  preview: {
    select: {
      title: "text",
    },
  },
});

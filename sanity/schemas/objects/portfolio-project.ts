import { defineType } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Proyecto de Portfolio",
  type: "object",
  fields: [
    { name: "title", title: "Título del Proyecto", type: "string", validation: (R) => R.required() },
    { name: "image", title: "Imagen", type: "image", options: { hotspot: true } },
    { name: "link", title: "Enlace (URL)", type: "url" },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});

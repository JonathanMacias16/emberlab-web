import { defineType } from "sanity";

export const pilarCard = defineType({
  name: "pilarCard",
  title: "Pilar Card",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Description", type: "string", validation: (R) => R.required() },
    { name: "bgColor", title: "Background Color", type: "string", description: "Tailwind bg class, e.g. bg-[#caa4cc]" },
    { name: "textColor", title: "Text Color", type: "string", description: "Tailwind text class, e.g. text-[var(--purple)]" },
    { name: "position", title: "Position", type: "string", description: "Tailwind position classes, e.g. left-[34.8%] top-[12.9%]" },
    { name: "rotation", title: "Rotation/Extra Classes", type: "string", description: "Tailwind rotate and z-index classes, e.g. -rotate-[9deg] z-30" },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

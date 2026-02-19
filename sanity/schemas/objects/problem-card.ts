import { defineType } from "sanity";

export const problemCard = defineType({
  name: "problemCard",
  title: "Problem Card",
  type: "object",
  fields: [
    { name: "text", title: "Text", type: "string", validation: (R) => R.required() },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    { name: "imageAlt", title: "Image Alt", type: "string" },
    {
      name: "bgColor",
      title: "Background Color",
      type: "string",
      description: "CSS variable name, e.g. var(--green-light)",
    },
    {
      name: "textColorVariant",
      title: "Text Color Variant",
      type: "string",
      options: { list: ["purple", "white"] },
      initialValue: "purple",
    },
  ],
});

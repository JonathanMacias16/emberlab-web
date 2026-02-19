import { defineType } from "sanity";

export const listItem = defineType({
  name: "listItem",
  title: "Elemento de Lista",
  type: "object",
  fields: [
    { name: "emoji", title: "Emoji", type: "string", validation: (R) => R.required() },
    { name: "text", title: "Texto", type: "string", validation: (R) => R.required() },
  ],
  preview: {
    select: {
      title: "text",
      subtitle: "emoji",
    },
    prepare({ title, subtitle }) {
      return {
        title: title,
        media: subtitle ? () => subtitle : null,
      };
    },
  },
});

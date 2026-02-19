import { defineType } from "sanity";

export const listItem = defineType({
  name: "listItem",
  title: "List Item",
  type: "object",
  fields: [
    { name: "emoji", title: "Emoji", type: "string", validation: (R) => R.required() },
    { name: "text", title: "Text", type: "string", validation: (R) => R.required() },
  ],
});

import { defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: ["fb", "ig", "in"] },
      validation: (R) => R.required(),
    },
    { name: "url", title: "URL", type: "url", validation: (R) => R.required() },
  ],
});

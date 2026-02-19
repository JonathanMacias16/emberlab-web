import { defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Red Social",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Plataforma",
      type: "string",
      options: { 
        list: [
          { title: "Facebook", value: "fb" },
          { title: "Instagram", value: "ig" },
          { title: "LinkedIn", value: "in" }
        ] 
      },
      validation: (R) => R.required(),
    },
    { name: "url", title: "URL / Enlace", type: "url", validation: (R) => R.required() },
  ],
});

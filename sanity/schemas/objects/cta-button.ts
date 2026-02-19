import { defineType } from "sanity";

export const ctaButton = defineType({
  name: "ctaButton",
  title: "CTA Button",
  type: "object",
  fields: [
    { name: "text", title: "Text", type: "string", validation: (R) => R.required() },
    {
      name: "variant",
      title: "Variant",
      type: "string",
      options: { list: ["purple", "red"] },
      initialValue: "purple",
    },
    { name: "href", title: "Link URL", type: "string" },
  ],
  preview: {
    select: {
      title: "text",
      subtitle: "variant",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Sin texto",
        subtitle: `Botón: ${subtitle || "estándar"}`,
      };
    },
  },
});

import { defineType } from "sanity";

export const projectTypeCard = defineType({
  name: "projectTypeCard",
  title: "Tipo de Proyecto",
  type: "object",
  fields: [
    { name: "title", title: "Título", type: "string", validation: (R) => R.required() },
    { name: "description", title: "Descripción", type: "text", rows: 4 },
    {
      name: "icon",
      title: "Ícono",
      type: "string",
      options: {
        list: [
          { title: "Landing (una sección)", value: "landing" },
          { title: "Sitio esencial (dos ventanas)", value: "esencial" },
          { title: "Sitio corporativo (documento)", value: "corporativo" },
          { title: "Rediseño (bloques)", value: "rediseno" },
        ],
      },
      initialValue: "landing",
    },
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

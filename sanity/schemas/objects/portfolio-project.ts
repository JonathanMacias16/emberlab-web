import { defineType } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Portfolio Project",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (R) => R.required() },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    { name: "link", title: "Link", type: "url" },
  ],
});

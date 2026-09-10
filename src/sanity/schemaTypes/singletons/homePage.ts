import { defineField, defineType } from "sanity";

// A singleton: exactly one document per language (`home-pl`, `home-en`),
// created and edited through the custom Studio structure (src/sanity/structure.ts),
// never listed or duplicated. No `slug` — the home route is fixed at `/`.
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: [
        { type: "contactSection" },
        { type: "heroSection" },
        { type: "newsSection" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});

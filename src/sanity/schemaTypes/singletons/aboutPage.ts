import { defineField, defineType } from "sanity";

// Singleton: one document per language (`about-pl`, `about-en`), edited through
// the custom Studio structure. Fixed URL `/about`, so no slug. Its `sections`
// menu is independent of other pages' — add About-only sections to `of`.
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: [
        { type: "contactSection" },
        { type: "heroSection" },
        { type: "newsSection" },
        { type: "sponsorsSection" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About" };
    },
  },
});

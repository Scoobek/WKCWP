import { defineField, defineType } from "sanity";

// Singleton: one shared document for the whole site (not translated). Edited
// through the custom Studio structure under a fixed id, `siteSettings`.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Company logo",
      description:
        "Shown in the header instead of the text brand. PNG, JPG, WebP or SVG.",
      type: "image",
      options: {
        accept: "image/png,image/jpeg,image/webp,image/svg+xml",
      },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});

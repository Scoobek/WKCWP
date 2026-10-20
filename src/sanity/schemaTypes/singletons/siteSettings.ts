import { defineField, defineType } from "sanity";

import { supportedLanguages } from "@/sanity/i18n";

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
    defineField({
      name: "navButton",
      title: "Navigation button",
      description:
        "Primary button in the header. Shown only when both a label and a link are set.",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "object",
          fields: supportedLanguages.map((lang) =>
            defineField({ name: lang.id, title: lang.title, type: "string" })
          ),
        }),
        defineField({ name: "link", title: "Link", type: "link" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});

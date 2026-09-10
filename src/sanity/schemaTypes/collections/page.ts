import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    // The page builder: an array whose `of` list is the menu of sections an
    // editor can add. New section types get appended here.
    defineField({
      name: "sections",
      type: "array",
      of: [
        { type: "contactSection" },
        { type: "heroSection" },
        { type: "newsSection" },
      ],
    }),
    // Managed by @sanity/document-internationalization — one document per
    // language, linked via a translation-metadata document.
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
});

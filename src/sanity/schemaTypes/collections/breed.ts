import { defineField, defineType } from "sanity";

export const breed = defineType({
  name: "breed",
  title: "Breed",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Breed Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle (displayed on tile)",
      description: "Short description e.g. origin, size class, purpose",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image (tile photo)",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      type: "array",
      title: "Breed Details",
      description:
        "Page builder for breed detail page: reorder, add/remove sections",
      of: [{ type: "breedProfileSection" }, { type: "articleSection" }],
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
  preview: {
    select: { name: "name", language: "language", media: "coverImage" },
    prepare({ name, language, media }) {
      return {
        title: name,
        subtitle: typeof language === "string" ? language.toUpperCase() : "",
        media,
      };
    },
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Gallery",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "Optional caption above the gallery",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { heading: "heading", imageCount: "images.length" },
    prepare({ heading, imageCount }) {
      return {
        title: heading || "Gallery",
        subtitle: `Gallery block${imageCount ? ` (${imageCount} image${imageCount !== 1 ? "s" : ""})` : ""}`,
      };
    },
  },
});

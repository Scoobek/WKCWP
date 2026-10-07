import { defineArrayMember, defineField, defineType } from "sanity";

export const breedProfileSection = defineType({
  name: "breedProfileSection",
  title: "Breed Profile (Gallery & Facts)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      type: "text",
      rows: 3,
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
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .max(5)
          .error("Please add 1–5 images (first becomes the hero image)"),
    }),
    defineField({
      name: "facts",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Fact label (e.g. Height, Weight)",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              title: "Fact value (e.g. 20–25 cm, 25–30 kg)",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (rule) =>
        rule.max(4).error("Maximum 4 facts (tiles) allowed"),
    }),
  ],
  preview: {
    select: { heading: "heading", imageCount: "images.length" },
    prepare({ heading, imageCount }) {
      return {
        title: heading || "Breed Profile",
        subtitle: `Gallery & Facts${imageCount ? ` (${imageCount} image${imageCount !== 1 ? "s" : ""})` : ""}`,
      };
    },
  },
});

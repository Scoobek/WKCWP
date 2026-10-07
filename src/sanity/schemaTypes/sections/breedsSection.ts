import { defineField, defineType } from "sanity";

export const breedsSection = defineType({
  name: "breedsSection",
  title: "Breeds Section",
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
      description: "Optional subtitle or description for the breeds grid",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare({ heading }) {
      return {
        title: heading || "Breeds",
        subtitle: "Breeds Section",
      };
    },
  },
});

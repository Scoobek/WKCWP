import { defineField, defineType } from "sanity";

export const newsSection = defineType({
  name: "newsSection",
  title: "News Section",
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
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title, subtitle: "News Grid" };
    },
  },
});

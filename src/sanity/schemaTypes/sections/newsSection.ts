import {
  navigationFields,
  navigationFieldsets,
} from "../objects/navigationFields";
import { defineField, defineType } from "sanity";

export const newsSection = defineType({
  name: "newsSection",
  title: "News Section",
  type: "object",
  fieldsets: navigationFieldsets,
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
    ...navigationFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title, subtitle: "News Grid" };
    },
  },
});

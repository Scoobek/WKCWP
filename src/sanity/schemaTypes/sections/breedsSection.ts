import {
  navigationFields,
  navigationFieldsets,
} from "../objects/navigationFields";
import { defineField, defineType } from "sanity";

export const breedsSection = defineType({
  name: "breedsSection",
  title: "Breeds Section",
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
      description: "Optional subtitle or description for the breeds grid",
    }),
    ...navigationFields,
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

import {
  navigationFields,
  navigationFieldsets,
} from "../objects/navigationFields";
import { defineArrayMember, defineField, defineType } from "sanity";

export const sponsorsSection = defineType({
  name: "sponsorsSection",
  title: "Sponsors Section",
  type: "object",
  fieldsets: navigationFieldsets,
  fields: [
    defineField({
      name: "heading",
      type: "string",
    }),
    defineField({
      name: "sponsors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "logo",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"], allowRelative: false }),
            }),
          ],
          preview: {
            select: { title: "name", media: "logo" },
          },
        }),
      ],
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      type: "link",
    }),
    ...navigationFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Sponsors", subtitle: "Sponsors Section" };
    },
  },
});

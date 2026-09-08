import { defineField, defineType } from "sanity";

export const localisationBlock = defineType({
  name: "localisationBlock",
  title: "Localisation",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title (optional)",
    }),
    defineField({
      name: "street",
      type: "string",
      title: "Street",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buildingNumber",
      type: "string",
      title: "Building number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postalCode",
      type: "string",
      title: "Postal code",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "object",
      title: "Location (coordinates)",
      fields: [
        defineField({
          name: "lat",
          type: "number",
          title: "Latitude",
          validation: (rule) => rule.required().min(-90).max(90),
        }),
        defineField({
          name: "lng",
          type: "number",
          title: "Longitude",
          validation: (rule) => rule.required().min(-180).max(180),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Localisation",
        subtitle: "Localisation block",
      };
    },
  },
});

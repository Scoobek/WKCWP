import { defineArrayMember, defineField, defineType } from "sanity";

export const imageLinksSection = defineType({
  name: "imageLinksSection",
  title: "Image Links",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
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
              name: "url",
              title: "Link",
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"], allowRelative: false }),
            }),
          ],
          preview: {
            select: { title: "url", media: "image" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: "Image Links",
        subtitle: `${count} image${count === 1 ? "" : "s"}`,
      };
    },
  },
});

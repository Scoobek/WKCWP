import { defineArrayMember, defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [defineArrayMember({ type: "link" })],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Image",
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
    }),
  ],
  preview: {
    prepare() {
      return { title: "Text block", subtitle: "Rich text" };
    },
  },
});

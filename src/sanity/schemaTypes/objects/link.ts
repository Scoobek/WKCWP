import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "linkType",
      type: "string",
      options: {
        list: [
          { title: "Internal page", value: "internal" },
          { title: "External URL", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internal",
      type: "reference",
      to: [{ type: "page" }],
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "external",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
  ],
});

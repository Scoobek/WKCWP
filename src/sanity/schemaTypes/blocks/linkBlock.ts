import { defineArrayMember, defineField, defineType } from "sanity";

import { linkButtonFields } from "../objects/linkButtonFields";

// Fields from when a block held one button. Hidden so Studio doesn't flag them,
// and read only as a fallback for posts written before the `links` list existed.
const legacyFields = linkButtonFields.map((field) => ({
  ...field,
  hidden: true,
  validation: undefined,
}));

export const linkBlock = defineType({
  name: "linkBlock",
  title: "Link / Download",
  type: "object",
  fields: [
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: linkButtonFields,
          preview: {
            select: { title: "label" },
            prepare({ title }) {
              return { title: title || "Link" };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "inline",
      options: {
        list: [
          { title: "Horizontal", value: "inline" },
          { title: "Vertical", value: "stacked" },
        ],
        layout: "radio",
      },
    }),
    ...legacyFields,
  ],
  preview: {
    prepare() {
      return { title: "Link / Download", subtitle: "Link / Download" };
    },
  },
});

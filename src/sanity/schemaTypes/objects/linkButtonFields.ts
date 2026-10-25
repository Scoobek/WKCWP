import { defineField } from "sanity";

/** Fields of a standalone link button, shared by the link section and the link block. */
export const linkButtonFields = [
  defineField({
    name: "label",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "variant",
    title: "Style",
    type: "string",
    initialValue: "primary",
    options: {
      list: [
        { title: "Filled", value: "primary" },
        { title: "Outline", value: "outline" },
      ],
      layout: "radio",
    },
  }),
  defineField({
    name: "link",
    type: "link",
    validation: (rule) => rule.required(),
  }),
];

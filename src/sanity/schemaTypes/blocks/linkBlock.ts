import { defineType } from "sanity";

import { linkButtonFields } from "../objects/linkButtonFields";

export const linkBlock = defineType({
  name: "linkBlock",
  title: "Link / Download",
  type: "object",
  fields: linkButtonFields,
  preview: {
    select: { title: "label" },
    prepare({ title }) {
      return {
        title: title || "Link",
        subtitle: "Link / Download",
      };
    },
  },
});

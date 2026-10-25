import { defineField, defineType } from "sanity";

/**
 * A link an editor picks the type of: an internal page, an external URL, or an
 * uploaded file to download. Used for CTA fields and, as an annotation, for
 * links inside rich text.
 */
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
          { title: "File download", value: "file" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internal",
      type: "reference",
      to: [{ type: "page" }],
      options: { filter: "defined(language)" },
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "external",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
    defineField({
      name: "file",
      type: "file",
      hidden: ({ parent }) => parent?.linkType !== "file",
    }),
    defineField({
      name: "blank",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType === "file",
    }),
  ],
});

import { defineField, defineType } from "sanity";

// An "object" type: it has no independent existence in the CMS — it only lives
// inside a document's array (here, page.sections). Editors add it via the
// array's "Add item" menu, never from the Studio sidebar.
export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text", rows: 2 }),
    defineField({ name: "ctaLabel", type: "string", title: "Button label" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Hero", subtitle: "Hero section" };
    },
  },
});

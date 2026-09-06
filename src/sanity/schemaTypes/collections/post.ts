import { defineArrayMember, defineField, defineType } from "sanity";

import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          // Text with a link annotation editors apply to a selection. `blank`
          // drives target="_blank" on the front-end (see RichText serializers).
          marks: {
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                  defineField({
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  }),
                ],
              }),
            ],
          },
        }),
        // A block-level image editors can insert between paragraphs.
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
    // Managed by @sanity/document-internationalization — one document per
    // language, linked via a translation-metadata document.
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: NEWS_CATEGORIES.map((cat) => ({
          title: cat.title,
          value: cat.id,
        })),
      },
      description: "Event category for filtering on the homepage",
    }),
    defineField({
      name: "eventDate",
      type: "date",
      description: "Date of the event (used for sorting in the news grid)",
      hidden: ({ parent }: { parent?: { category?: string } }) =>
        parent?.category === "announcement",
    }),
    defineField({
      name: "location",
      type: "string",
      description: "Town/city name where the event takes place",
      hidden: ({ parent }: { parent?: { category?: string } }) =>
        parent?.category === "announcement",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
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
    select: { title: "title", language: "language", media: "coverImage" },
    prepare({ title, language, media }) {
      return {
        title,
        subtitle: typeof language === "string" ? language.toUpperCase() : "",
        media,
      };
    },
  },
});

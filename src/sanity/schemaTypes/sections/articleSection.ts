import { defineArrayMember, defineField, defineType } from "sanity";

export const articleSection = defineType({
  name: "articleSection",
  title: "Article",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Optional article title (displayed above the content)",
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
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
    defineField({
      name: "author",
      type: "object",
      title: "Author",
      description:
        "Optional author information displayed at the end of the article",
      fields: [
        defineField({
          name: "firstName",
          type: "string",
          title: "First name",
        }),
        defineField({
          name: "lastName",
          type: "string",
          title: "Last name",
        }),
        defineField({
          name: "bio",
          type: "text",
          title: "Bio",
          rows: 3,
          validation: (rule) => rule.max(300),
        }),
        defineField({
          name: "photo",
          type: "image",
          title: "Photo",
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
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Article",
        subtitle: "Article Section",
      };
    },
  },
});

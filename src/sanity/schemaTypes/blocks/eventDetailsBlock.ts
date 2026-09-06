import { defineArrayMember, defineField, defineType } from "sanity";

export const eventDetailsBlock = defineType({
  name: "eventDetailsBlock",
  title: "Event Details",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
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
      name: "scheduleTitle",
      title: "Schedule title",
      type: "string",
      description: "e.g., Agenda, Event Timeline, Program",
    }),
    defineField({
      name: "scheduleRows",
      title: "Schedule",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "scheduleRow",
          fields: [
            defineField({
              name: "time",
              title: "Hour",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { time: "time", description: "description" },
            prepare({ time, description }) {
              return { title: time, subtitle: description };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "string",
      description: 'e.g. "8:00–16:00"',
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label (optional)",
      type: "string",
    }),
    defineField({
      name: "buttonUrl",
      title: "Button link (optional)",
      type: "url",
    }),
    defineField({
      name: "buttonBlank",
      title: "Open in new window",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "organizer",
      title: "Organizing breed club (optional)",
      type: "string",
    }),
    defineField({
      name: "organizerUrl",
      title: "Organizer link (optional)",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Event Details",
        subtitle: "Event Details block",
      };
    },
  },
});

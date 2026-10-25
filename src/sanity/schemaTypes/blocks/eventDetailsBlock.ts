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
      name: "dateMode",
      title: "Event length",
      type: "string",
      initialValue: "single",
      options: {
        list: [
          { title: "One day", value: "single" },
          { title: "More than one day", value: "range" },
        ],
        layout: "radio",
      },
    }),
    // `date` is the one-day date. Kept under its original name so posts saved
    // before the date range option still show their date.
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      hidden: ({ parent }) => parent?.dateMode === "range",
    }),
    defineField({
      name: "startDate",
      title: "First day",
      type: "date",
      hidden: ({ parent }) => parent?.dateMode !== "range",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { dateMode } = (context.parent ?? {}) as { dateMode?: string };
          if (dateMode === "range" && !value) return "Enter the first day";
          return true;
        }),
    }),
    defineField({
      name: "endDate",
      title: "Last day",
      type: "date",
      hidden: ({ parent }) => parent?.dateMode !== "range",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { dateMode, startDate } = (context.parent ?? {}) as {
            dateMode?: string;
            startDate?: string;
          };
          if (dateMode !== "range") return true;
          if (!value) return "Enter the last day";
          if (startDate && value < startDate) {
            return "The last day can't be before the first day";
          }
          return true;
        }),
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
      name: "buttonLink",
      title: "Button link (optional)",
      type: "link",
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
      name: "organizerLink",
      title: "Organizer link (optional)",
      type: "link",
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

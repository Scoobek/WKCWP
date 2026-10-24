import {
  navigationFields,
  navigationFieldsets,
} from "../objects/navigationFields";
import { defineArrayMember, defineField, defineType } from "sanity";

export const profilesSection = defineType({
  name: "profilesSection",
  title: "Profiles Section",
  type: "object",
  fieldsets: navigationFieldsets,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "columns",
      title: "People per row",
      type: "number",
      initialValue: 2,
      options: {
        list: [
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "people",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name and surname",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photo",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photoShape",
              title: "Photo shape",
              type: "string",
              initialValue: "circle",
              options: {
                list: [
                  { title: "Circle", value: "circle" },
                  { title: "Square", value: "square" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "bio",
              title: "Description",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "email",
              type: "string",
              validation: (rule) =>
                rule.custom((value) => {
                  if (!value) return true;
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? true
                    : "Must be a valid email";
                }),
            }),
            defineField({
              name: "phone",
              type: "string",
            }),
            defineField({
              name: "socials",
              title: "Social links",
              type: "array",
              validation: (rule) =>
                rule.custom((links: unknown) => {
                  if (!Array.isArray(links) || links.length === 0) return true;
                  const platforms = links.map(
                    (link) => (link as { platform?: string }).platform
                  );
                  if (platforms.length !== new Set(platforms).size) {
                    return "Each social platform can only appear once";
                  }
                  return true;
                }),
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "platform",
                      type: "string",
                      options: {
                        list: [
                          { title: "Facebook", value: "facebook" },
                          { title: "Instagram", value: "instagram" },
                          { title: "YouTube", value: "youtube" },
                          { title: "TikTok", value: "tiktok" },
                          { title: "X", value: "x" },
                          { title: "LinkedIn", value: "linkedin" },
                        ],
                      },
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "url",
                      type: "url",
                      validation: (rule) =>
                        rule.required().uri({
                          scheme: ["http", "https"],
                          allowRelative: false,
                        }),
                    }),
                  ],
                  preview: { select: { title: "platform", subtitle: "url" } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "name", media: "photo" },
          },
        }),
      ],
    }),
    ...navigationFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Profiles", subtitle: "Profiles Section" };
    },
  },
});

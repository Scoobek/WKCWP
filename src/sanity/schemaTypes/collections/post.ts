import { defineField, defineType } from "sanity";

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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "richTextBlock" },
        { type: "galleryBlock" },
        { type: "eventDetailsBlock" },
        { type: "localisationBlock" },
      ],
      validation: (Rule) =>
        Rule.custom((blocks, context) => {
          const category = (
            context.document as { category?: string } | undefined
          )?.category;
          if (category !== "announcement") return true;
          const hasEventDetails = blocks?.some(
            (block) =>
              (block as { _type?: string })._type === "eventDetailsBlock"
          );
          return hasEventDetails
            ? "Event Details blocks are not allowed on announcement posts. Remove it or change the category."
            : true;
        }),
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

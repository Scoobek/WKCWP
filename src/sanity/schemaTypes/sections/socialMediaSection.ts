import { defineArrayMember, defineField, defineType } from "sanity";

export const socialMediaSection = defineType({
  name: "socialMediaSection",
  title: "Social Media Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "links",
      type: "array",
      validation: (rule) =>
        rule.custom((links: unknown) => {
          if (!Array.isArray(links) || links.length === 0) return true;
          const platforms = links.map(
            (link) => (link as { platform?: string }).platform
          );
          const uniquePlatforms = new Set(platforms);
          if (platforms.length !== uniquePlatforms.size) {
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
              name: "profileName",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"], allowRelative: false }),
            }),
            defineField({
              name: "followersLabel",
              type: "string",
              description:
                'e.g. "12.5K followers" — shown unless a live YouTube count is available.',
            }),
            defineField({
              name: "youtubeChannelId",
              type: "string",
              description:
                "Optional. If set, live subscriber count replaces the manual label above.",
              hidden: ({ parent }) => parent?.platform !== "youtube",
            }),
          ],
          preview: { select: { title: "profileName", subtitle: "platform" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return {
        title: title || "Social Media",
        subtitle: "Social Media Section",
      };
    },
  },
});

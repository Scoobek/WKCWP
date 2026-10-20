import { defineField } from "sanity";

import { supportedLanguages } from "@/sanity/i18n";

/**
 * A short text with one input per Sanity content language (`supportedLanguages`).
 * Read it with the locale as the key; fall back to the default language when a
 * translation is empty.
 */
export function localizedLabel(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: supportedLanguages.map((lang) =>
      defineField({ name: lang.id, title: lang.title, type: "string" })
    ),
  });
}

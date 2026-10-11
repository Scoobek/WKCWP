import { Locale } from "@/i18n/locales";

/**
 * Sanity content languages. Mirrors the front-end locales in
 * `src/i18n/locales.ts` — keep the two in sync.
 */
export const supportedLanguages = [
  { id: Locale.PL, title: "Polski" },
  { id: Locale.EN, title: "English" },
];

export const defaultLanguage = Locale.PL;

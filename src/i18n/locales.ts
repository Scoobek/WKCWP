/**
 * Supported front-end locales. Each value is the URL segment (`/pl`, `/en`) and
 * the matching Sanity `language` id, so it is the one place these strings live.
 */
export enum Locale {
  PL = "pl",
  EN = "en",
}

/** BCP 47 tags for the `Intl` and `toLocale*` APIs, keyed by front-end locale. */
export const intlLocales: Record<Locale, string> = {
  [Locale.PL]: "pl-PL",
  [Locale.EN]: "en-US",
};

/** Intl tag for a locale string (e.g. from a URL or prop), defaulting to Polish. */
export function toIntlLocale(locale: string): string {
  return intlLocales[locale as Locale] ?? intlLocales[Locale.PL];
}

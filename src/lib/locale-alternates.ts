import { routing } from "@/i18n/routing";
import type { DocTranslation } from "@/sanity/lib/queries";

/**
 * Builds a complete per-locale path map for the language switcher, from a
 * localized document's translations.
 *
 * Returns a locale-stripped path for *every* locale in `routing.locales`:
 * - the current locale → `path`,
 * - each translation that has a slug → `toPath(slug)`,
 * - any locale without a translation → `path` (attempting to view untranslated
 *   content under another locale will 404).
 *
 * Pure (not a hook) so server pages can call it directly, alongside
 * `<SetLocaleAlternates>`.
 */
export function buildLocaleAlternates({
  locale,
  path,
  translations,
  toPath,
}: {
  /** The current locale. */
  locale: string;
  /** The current locale's locale-stripped path, e.g. `/posts/${slug}`. */
  path: string;
  /** Per-locale translations, e.g. from the `TRANSLATIONS_FRAGMENT` query. */
  translations: DocTranslation[];
  /** Maps a translated slug to its locale-stripped path. */
  toPath: (slug: string) => string;
}): Record<string, string> {
  const alternates: Record<string, string> = { [locale]: path };

  for (const translation of translations) {
    if (translation.slug) {
      alternates[translation.locale] = toPath(translation.slug);
    }
  }

  for (const l of routing.locales) {
    alternates[l] ??= path;
  }

  return alternates;
}

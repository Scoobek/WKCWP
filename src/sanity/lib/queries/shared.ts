import { groq } from "next-sanity";

/** A Sanity image as stored on a document: an asset *reference* (not a URL —
 * turn it into one with an image-URL builder) plus our custom `alt` field. */
export type SanityImage = {
  asset: { _ref: string } | null;
  alt: string | null;
};

/** A document's slug in each language it's translated into (from the plugin's
 * `translation.metadata` doc). Drives the translation-aware language switcher.
 * Generic across doc types — any localized, slug-routed type reuses this. */
export type DocTranslation = {
  locale: string;
  slug: string | null;
};

/**
 * GROQ projection for a document's per-locale translations, read from the
 * `@sanity/document-internationalization` plugin's `translation.metadata` doc
 * that references the current document (`^._id`). Interpolate into any detail
 * query on a localized, slug-routed type; pair with `buildLocaleAlternates`.
 * `coalesce(..., [])` guarantees an array when no metadata exists.
 */
export const TRANSLATIONS_FRAGMENT = groq`"translations": coalesce(*[
  _type == "translation.metadata" && references(^._id)
][0].translations[]{ "locale": value->language, "slug": value->slug.current }, [])`;

/** Resolves a link field (internal doc reference or external URL) and carries
 * the referenced doc's translations so the link can be localized. */
export const LINK_FRAGMENT = groq`{
  linkType,
  external,
  internal->{ "slug": slug.current, "translations": coalesce(*[
    _type == "translation.metadata" && references(^._id)
  ][0].translations[]{ "locale": value->language, "slug": value->slug.current }, []) }
}`;

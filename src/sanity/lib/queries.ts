import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
};

/** A document's slug in each language it's translated into (from the plugin's
 * `translation.metadata` doc). Drives the translation-aware language switcher.
 * Generic across doc types — any localized, slug-routed type reuses this. */
export type DocTranslation = {
  locale: string;
  slug: string | null;
};

/** @deprecated use {@link DocTranslation}. */
export type PostTranslation = DocTranslation;

export type Post = PostListItem & {
  body: PortableTextBlock[] | null;
  translations: DocTranslation[];
};

/**
 * GROQ projection for a document's per-locale translations, read from the
 * `@sanity/document-internationalization` plugin's `translation.metadata` doc
 * that references the current document (`^._id`). Interpolate into any detail
 * query on a localized, slug-routed type; pair with `buildLocaleAlternates`.
 * `coalesce(..., [])` guarantees an array when no metadata exists.
 */
const TRANSLATIONS_FRAGMENT = groq`"translations": coalesce(*[
  _type == "translation.metadata" && references(^._id)
][0].translations[]{ "locale": value->language, "slug": value->slug.current }, [])`;

const POSTS_QUERY = groq`*[_type == "post" && language == $locale && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, publishedAt
}`;

const POST_QUERY = groq`*[_type == "post" && language == $locale && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, publishedAt, body,
  ${TRANSLATIONS_FRAGMENT}
}`;

/** Posts for a locale, newest first. */
export function getPosts(locale: string) {
  return client.fetch<PostListItem[]>(POSTS_QUERY, { locale });
}

/** A single post by slug within a locale, or null. */
export function getPost(locale: string, slug: string) {
  return client.fetch<Post | null>(POST_QUERY, { locale, slug });
}

/** A Sanity image as stored on a document: an asset *reference* (not a URL —
 * turn it into one with an image-URL builder) plus our custom `alt` field. */
export type SanityImage = {
  asset: { _ref: string } | null;
  alt: string | null;
};

/** One section on a page. As new section types are added, widen this union
 * (e.g. `HeroSection | FeatureGridSection`). `_type` is the discriminant the
 * render loop switches on; `_key` is Sanity's per-array-item id. */
export type HeroSection = {
  _type: "heroSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
  ctaLabel: string | null;
  image: SanityImage | null;
};

export type PageSection = HeroSection;

/** Shared projection for a page-builder `sections` array. Reused by any type
 * that has one (pages, the home singleton). Keep in sync with `PageSection`. */
const SECTIONS_FRAGMENT = groq`sections[]{
  _type, _key, heading, subheading, ctaLabel, image{ asset, alt }
}`;

export type PageDocument = {
  _id: string;
  title: string;
  slug: string;
  sections: PageSection[] | null;
  translations: DocTranslation[];
};

const PAGE_QUERY = groq`*[_type == "page" && language == $locale && slug.current == $slug][0]{
  _id, title, "slug": slug.current,
  ${SECTIONS_FRAGMENT},
  ${TRANSLATIONS_FRAGMENT}
}`;

/** A single page by slug within a locale, or null. */
export function getPage(locale: string, slug: string) {
  return client.fetch<PageDocument | null>(PAGE_QUERY, { locale, slug });
}

export type HomePageDocument = {
  sections: PageSection[] | null;
};

// The home singleton is fetched by its deterministic id (`home-<locale>`), so
// no `language`/slug filter is needed — the id encodes the language.
const HOME_QUERY = groq`*[_id == $id][0]{ ${SECTIONS_FRAGMENT} }`;

/** The home page singleton for a locale, or null if not published yet. */
export function getHomePage(locale: string) {
  return client.fetch<HomePageDocument | null>(HOME_QUERY, {
    id: `home-${locale}`,
  });
}

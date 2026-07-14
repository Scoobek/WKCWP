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

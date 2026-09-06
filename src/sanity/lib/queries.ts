import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { type NewsCategory } from "@/sanity/lib/news-categories";

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

export type RichTextBlock = {
  _type: "richTextBlock";
  _key: string;
  text: PortableTextBlock[] | null;
};

export type GalleryBlock = {
  _type: "galleryBlock";
  _key: string;
  heading: string | null;
  images: SanityImage[] | null;
};

export type ScheduleRow = {
  _key: string;
  time: string | null;
  description: string | null;
};

export type EventDetailsBlock = {
  _type: "eventDetailsBlock";
  _key: string;
  title: string | null;
  description: PortableTextBlock[] | null;
  scheduleTitle: string | null;
  scheduleRows: ScheduleRow[] | null;
  date: string | null;
  hours: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  buttonBlank: boolean | null;
  organizer: string | null;
  organizerUrl: string | null;
};

export type PostBlock = RichTextBlock | GalleryBlock | EventDetailsBlock;

export type Post = PostListItem & {
  content: PostBlock[] | null;
  coverImage: SanityImage | null;
  category: NewsCategory | null;
  eventDate: string | null;
  location: string | null;
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

const CONTENT_FRAGMENT = groq`content[]{
  _type, _key,
  _type == "richTextBlock" => { text },
  _type == "galleryBlock" => { heading, images[]{ asset, alt } },
  _type == "eventDetailsBlock" => { title, description, scheduleTitle, scheduleRows[]{ _key, time, description }, date, hours, buttonLabel, buttonUrl, buttonBlank, organizer, organizerUrl }
}`;

const POST_QUERY = groq`*[_type == "post" && language == $locale && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, publishedAt,
  coverImage{ asset, alt }, category, eventDate, location,
  ${CONTENT_FRAGMENT},
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
  ctaUrl: string | null;
  image: SanityImage | null;
};

export type NewsSection = {
  _type: "newsSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
};

export type PageSection = HeroSection | NewsSection;

export type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory | null;
  eventDate: string | null;
  location: string | null;
  coverImage: SanityImage | null;
  publishedAt: string | null;
};

/** Shared projection for a page-builder `sections` array. Reused by any type
 * that has one (pages, the home singleton). Keep in sync with `PageSection`. */
const SECTIONS_FRAGMENT = groq`sections[]{
  _type, _key, heading, subheading, ctaLabel, ctaUrl, image{ asset, alt }
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

/** Any sections-based singleton (home, about, …). */
export type SectionsDocument = {
  sections: PageSection[] | null;
};

// Singletons are fetched by their deterministic id (`<name>-<locale>`), so no
// `language`/slug filter is needed — the id encodes the language.
const SINGLETON_QUERY = groq`*[_id == $id][0]{ ${SECTIONS_FRAGMENT} }`;

function getSingleton(id: string) {
  return client.fetch<SectionsDocument | null>(SINGLETON_QUERY, { id });
}

/** The home page singleton for a locale, or null if not published yet. */
export function getHomePage(locale: string) {
  return getSingleton(`home-${locale}`);
}

/** The about page singleton for a locale, or null if not published yet. */
export function getAboutPage(locale: string) {
  return getSingleton(`about-${locale}`);
}

const NEWS_POSTS_QUERY = groq`*[_type == "post" && language == $locale && defined(category) && ($category == "all" || category == $category)] | order(eventDate desc)[0...$limit]{
  _id, title, "slug": slug.current, category, eventDate, location, publishedAt, coverImage{ asset, alt }
}`;

/** News posts for a given locale and category, newest first by eventDate. */
export function getNewsPosts(
  locale: string,
  category: "all" | NewsCategory,
  limit = 9
) {
  return client.fetch<NewsPost[]>(NEWS_POSTS_QUERY, {
    locale,
    category,
    limit,
  });
}

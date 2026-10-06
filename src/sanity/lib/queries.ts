import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { type NewsCategory } from "@/sanity/lib/news-categories";
import { resolveLink } from "@/lib/resolve-link";

export type { NewsCategory };

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

export type LocalisationBlock = {
  _type: "localisationBlock";
  _key: string;
  title: string | null;
  street: string | null;
  buildingNumber: string | null;
  postalCode: string | null;
  location: { lat: number; lng: number } | null;
};

export type PostBlock =
  RichTextBlock | GalleryBlock | EventDetailsBlock | LocalisationBlock;

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

const LINK_FRAGMENT = groq`{
  linkType,
  external,
  internal->{ "slug": slug.current, "translations": coalesce(*[
    _type == "translation.metadata" && references(^._id)
  ][0].translations[]{ "locale": value->language, "slug": value->slug.current }, []) }
}`;

const POSTS_QUERY = groq`*[_type == "post" && language == $locale && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, publishedAt
}`;

const CONTENT_FRAGMENT = groq`content[]{
  _type, _key,
  _type == "richTextBlock" => { text },
  _type == "galleryBlock" => { heading, images[]{ asset, alt } },
  _type == "eventDetailsBlock" => { title, description, scheduleTitle, scheduleRows[]{ _key, time, description }, date, hours, buttonLabel, buttonLink${LINK_FRAGMENT}, buttonBlank, organizer, organizerLink${LINK_FRAGMENT} },
  _type == "localisationBlock" => { title, street, buildingNumber, postalCode, location }
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
  return client
    .fetch<Post | null>(POST_QUERY, { locale, slug })
    .then((post) => {
      if (!post) return null;
      return { ...post, content: resolveContent(post.content, locale) };
    });
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

export type ContactSection = {
  _type: "contactSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
  street: string | null;
  buildingNumber: string | null;
  postalCode: string | null;
  town: string | null;
  email: string | null;
  phone: string | null;
};

export type SponsorItem = {
  _key: string;
  name: string | null;
  logo: SanityImage | null;
  url: string | null;
};

export type SponsorsSection = {
  _type: "sponsorsSection";
  _key: string;
  heading: string | null;
  sponsors: SponsorItem[] | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export type SocialLinkItem = {
  _key: string;
  platform:
    "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | null;
  profileName: string | null;
  url: string | null;
  followersLabel: string | null;
  youtubeChannelId: string | null;
};

export type SocialMediaSection = {
  _type: "socialMediaSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
  links: SocialLinkItem[] | null;
};

export type ArticleSection = {
  _type: "articleSection";
  _key: string;
  title: string | null;
  body: PortableTextBlock[] | null;
};

export type PageSection =
  | ArticleSection
  | HeroSection
  | NewsSection
  | ContactSection
  | SponsorsSection
  | SocialMediaSection;

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
  _type, _key, title, heading, subheading, body, ctaLabel, ctaLink${LINK_FRAGMENT}, image{ asset, alt }, street, buildingNumber, postalCode, town, email, phone, sponsors[]{ _key, name, logo{ asset }, url }, links[]{ _key, platform, profileName, url, followersLabel, youtubeChannelId }
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

type RawPageSection = Record<string, unknown> & { _type: string; _key: string };
type RawPostBlock = Record<string, unknown> & { _type: string; _key: string };

function resolveSections(
  sections: RawPageSection[] | null,
  locale: string
): PageSection[] | null {
  if (!sections) return null;
  return sections.map((section): PageSection => {
    if (section._type === "heroSection" && section.ctaLink) {
      const resolved = resolveLink(section.ctaLink as unknown, locale);
      return { ...section, ctaUrl: resolved } as PageSection;
    }
    if (section._type === "sponsorsSection" && section.ctaLink) {
      const resolved = resolveLink(section.ctaLink as unknown, locale);
      return { ...section, ctaUrl: resolved } as PageSection;
    }
    return section as PageSection;
  });
}

function resolveContent(
  content: RawPostBlock[] | null,
  locale: string
): PostBlock[] | null {
  if (!content) return null;
  return content.map((block): PostBlock => {
    if (block._type === "eventDetailsBlock") {
      const buttonUrl = resolveLink(block.buttonLink as unknown, locale);
      const organizerUrl = resolveLink(block.organizerLink as unknown, locale);
      return { ...block, buttonUrl, organizerUrl } as EventDetailsBlock;
    }
    return block as PostBlock;
  });
}

/** A single page by slug within a locale, or null. */
export function getPage(locale: string, slug: string) {
  return client
    .fetch<PageDocument | null>(PAGE_QUERY, { locale, slug })
    .then((page) => {
      if (!page) return null;
      return { ...page, sections: resolveSections(page.sections, locale) };
    });
}

/** Any sections-based singleton (home, about, …). */
export type SectionsDocument = {
  sections: PageSection[] | null;
};

// Singletons are fetched by their deterministic id (`<name>-<locale>`), so no
// `language`/slug filter is needed — the id encodes the language.
const SINGLETON_QUERY = groq`*[_id == $id][0]{ ${SECTIONS_FRAGMENT} }`;

function getSingleton(id: string, locale: string) {
  return client
    .fetch<SectionsDocument | null>(SINGLETON_QUERY, { id })
    .then((doc) => {
      if (!doc) return null;
      return { ...doc, sections: resolveSections(doc.sections, locale) };
    });
}

/** The home page singleton for a locale, or null if not published yet. */
export function getHomePage(locale: string) {
  return getSingleton(`home-${locale}`, locale);
}

/** The about page singleton for a locale, or null if not published yet. */
export function getAboutPage(locale: string) {
  return getSingleton(`about-${locale}`, locale);
}

const NEWS_POSTS_FILTER = groq`_type == "post" && language == $locale && defined(category) && ($category == "all" || category == $category)`;

const NEWS_POSTS_PAGE_QUERY = groq`{
  "items": *[${NEWS_POSTS_FILTER}] | order(eventDate desc) [$offset...$offsetEnd]{
    _id, title, "slug": slug.current, category, eventDate, location, publishedAt, coverImage{ asset, alt }
  },
  "total": count(*[${NEWS_POSTS_FILTER}])
}`;

/** One page of news posts for a given locale and category, newest first by
 * eventDate, plus the total matching count (for pagination). */
export function getNewsPostsPage(
  locale: string,
  category: "all" | NewsCategory,
  page: number,
  pageSize: number
) {
  const offset = (page - 1) * pageSize;
  return client.fetch<{ items: NewsPost[]; total: number }>(
    NEWS_POSTS_PAGE_QUERY,
    { locale, category, offset, offsetEnd: offset + pageSize }
  );
}

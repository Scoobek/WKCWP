import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { type NewsCategory } from "@/sanity/lib/news-categories";
import { resolveLink } from "@/lib/resolve-link";
import {
  LINK_FRAGMENT,
  TRANSLATIONS_FRAGMENT,
  type DocTranslation,
  type SanityImage,
} from "./shared";

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
};

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

type RawPostBlock = Record<string, unknown> & { _type: string; _key: string };

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

const NEWS_POSTS_FILTER = groq`_type == "post" && language == $locale && defined(category) && ($category == "all" || category == $category)`;

const NEWS_POSTS_PAGE_QUERY = groq`{
  "items": *[${NEWS_POSTS_FILTER}] | order(eventDate desc) [$offset...$offsetEnd]{
    _id, title, "slug": slug.current, category, eventDate, location, publishedAt, coverImage{ asset, alt }
  },
  "total": count(*[${NEWS_POSTS_FILTER}])
}`;

/** Resolves link fields inside event-details blocks to locale-correct URLs. */
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

import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { type NewsCategory } from "@/sanity/lib/news-categories";
import { defaultLanguage } from "@/sanity/i18n";
import {
  resolveLink,
  resolveLinkTarget,
  type RawLink,
  type ResolvedLink,
} from "@/lib/resolve-link";
import { sectionAnchors } from "@/lib/section-anchor";

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

export type LinkBlock = {
  _type: "linkBlock";
  _key: string;
  label: string | null;
  variant: "primary" | "outline" | null;
  target: ResolvedLink | null;
};

export type PostBlock =
  | RichTextBlock
  | GalleryBlock
  | EventDetailsBlock
  | LocalisationBlock
  | LinkBlock;

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

/** Projection of a `link` object's fields. Inside `LINK_FRAGMENT` for link
 * fields, and per annotation inside `markDefs` for rich-text links. */
const LINK_FIELDS = groq`linkType,
  external,
  blank,
  internal->{ "slug": slug.current, "translations": coalesce(*[
    _type == "translation.metadata" && references(^._id)
  ][0].translations[]{ "locale": value->language, "slug": value->slug.current }, []) },
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename`;

const LINK_FRAGMENT = groq`{ ${LINK_FIELDS} }`;

/** Projects a Portable Text field so each link annotation's target is fetched
 * along with it. Without this, the annotation would only carry a raw href. */
const withLinks = (field: string) =>
  groq`${field}[]{ ..., markDefs[]{ ..., ${LINK_FIELDS} } }`;

const POSTS_QUERY = groq`*[_type == "post" && language == $locale && defined(slug.current)] | order(publishedAt desc){
  _id, title, "slug": slug.current, excerpt, publishedAt
}`;

const CONTENT_FRAGMENT = groq`content[]{
  _type, _key,
  _type == "richTextBlock" => { ${withLinks("text")} },
  _type == "galleryBlock" => { heading, images[]{ asset, alt } },
  _type == "eventDetailsBlock" => { title, ${withLinks("description")}, scheduleTitle, scheduleRows[]{ _key, time, description }, date, hours, buttonLabel, buttonLink${LINK_FRAGMENT}, buttonBlank, organizer, organizerLink${LINK_FRAGMENT} },
  _type == "localisationBlock" => { title, street, buildingNumber, postalCode, location },
  _type == "linkBlock" => { label, variant, link${LINK_FRAGMENT} }
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
  registrationName: string | null;
  nip: string | null;
  regon: string | null;
  krs: string | null;
  oppStatus: string | null;
  bankAccount: string | null;
  bankName: string | null;
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

export type ProfileSocialItem = {
  _key: string;
  platform:
    "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | null;
  url: string | null;
};

export type ProfilePerson = {
  _key: string;
  name: string | null;
  bio: string | null;
  photo: SanityImage | null;
  photoShape: "circle" | "square" | null;
  email: string | null;
  phone: string | null;
  socials: ProfileSocialItem[] | null;
};

export type ProfilesSection = {
  _type: "profilesSection";
  _key: string;
  heading: string | null;
  description: string | null;
  columns: 1 | 2 | 3 | null;
  people: ProfilePerson[] | null;
};

export type SocialMediaSection = {
  _type: "socialMediaSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
  links: SocialLinkItem[] | null;
};

export type ArticleAuthor = {
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  photo: SanityImage | null;
};

export type ArticleSection = {
  _type: "articleSection";
  _key: string;
  title: string | null;
  body: PortableTextBlock[] | null;
  author: ArticleAuthor[] | null;
};

export type BreedFact = {
  _key: string;
  label: string | null;
  value: string | null;
};

export type BreedProfileSection = {
  _type: "breedProfileSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
  images: SanityImage[] | null;
  facts: BreedFact[] | null;
};

export type BreedsSection = {
  _type: "breedsSection";
  _key: string;
  heading: string | null;
  subheading: string | null;
};

export type BreedListItem = {
  _id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  coverImage: SanityImage | null;
};

export type Breed = BreedListItem & {
  sections: PageSection[] | null;
  translations: DocTranslation[];
};

export type PageSection =
  | ArticleSection
  | BreedProfileSection
  | BreedsSection
  | HeroSection
  | NewsSection
  | ContactSection
  | SponsorsSection
  | SocialMediaSection
  | ProfilesSection;

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
  _type, _key, title, heading, subheading, description, ${withLinks("body")}, ctaLabel, ctaLink${LINK_FRAGMENT}, image{ asset, alt }, street, buildingNumber, postalCode, town, email, phone, registrationName, nip, regon, krs, oppStatus, bankAccount, bankName, sponsors[]{ _key, name, logo{ asset }, url }, links[]{ _key, platform, profileName, url, followersLabel, youtubeChannelId }, author[]{ firstName, lastName, bio, photo{ asset, alt } }, images[]{ asset, alt }, facts[]{ _key, label, value }, columns, people[]{ _key, name, bio, photo{ asset, alt }, photoShape, email, phone, socials[]{ _key, platform, url } }
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

type RawMarkDef = Record<string, unknown> & {
  _type: string;
  _key: string;
  href?: string | null;
  blank?: boolean | null;
};
type RawPortableBlock = Record<string, unknown> & {
  markDefs?: RawMarkDef[] | null;
};

/** Pre-link-type annotations stored a raw `href` and no `linkType`. Keep them
 * working as external links. */
function legacyTarget(markDef: RawMarkDef): ResolvedLink | null {
  if (typeof markDef.href !== "string" || !markDef.href) return null;
  return {
    kind: "external",
    href: markDef.href,
    blank: Boolean(markDef.blank),
    fileName: null,
  };
}

/** Resolves the link annotations in a Portable Text field to their targets. */
function resolveBody(
  blocks: RawPortableBlock[] | null,
  locale: string
): PortableTextBlock[] | null {
  if (!blocks) return null;
  return blocks.map((block) => {
    if (!block.markDefs) return block;
    const markDefs = block.markDefs.map((markDef) => {
      if (markDef._type !== "link") return markDef;
      const target =
        resolveLinkTarget(markDef, locale) ?? legacyTarget(markDef);
      return { ...markDef, target };
    });
    return { ...block, markDefs };
  }) as unknown as PortableTextBlock[];
}

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
    if (section._type === "articleSection") {
      const body = resolveBody(
        section.body as RawPortableBlock[] | null,
        locale
      );
      return { ...section, body } as PageSection;
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
    if (block._type === "richTextBlock") {
      const text = resolveBody(block.text as RawPortableBlock[] | null, locale);
      return { ...block, text } as RichTextBlock;
    }
    if (block._type === "eventDetailsBlock") {
      const buttonUrl = resolveLink(block.buttonLink as unknown, locale);
      const organizerUrl = resolveLink(block.organizerLink as unknown, locale);
      const description = resolveBody(
        block.description as RawPortableBlock[] | null,
        locale
      );
      return {
        ...block,
        buttonUrl,
        organizerUrl,
        description,
      } as EventDetailsBlock;
    }
    if (block._type === "linkBlock") {
      const target = resolveLinkTarget(block.link as RawLink, locale);
      return { ...block, target } as LinkBlock;
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

/** A label stored per language. Missing translations fall back to the default. */
type LocalizedLabel = Record<string, string | null> | null;

function pickLabel(label: LocalizedLabel, locale: string): string | null {
  return label?.[locale] || label?.[defaultLanguage] || null;
}

export type SiteSettings = {
  logo: (SanityImage & { width: number | null; height: number | null }) | null;
  /** Header button, with the label and URL already resolved for the locale. */
  navButton: { label: string; url: string } | null;
  /** Extra header links, after the Home sections. Incomplete items are dropped. */
  navLinks: { label: string; url: string }[];
};

type RawSiteSettings = {
  logo: SiteSettings["logo"];
  navButton: { label: LocalizedLabel; link: unknown } | null;
  navLinks: { label: LocalizedLabel; link: unknown }[] | null;
};

const SITE_SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo{
    asset,
    alt,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  navButton{
    label,
    link${LINK_FRAGMENT}
  },
  navLinks[]{
    label,
    link${LINK_FRAGMENT}
  }
}`;

/**
 * Shared site settings (not translated), or null if not created yet. Labels
 * fall back to the default language, and links resolve to the locale's
 * translated slug.
 */
export async function getSiteSettings(
  locale: string
): Promise<SiteSettings | null> {
  const raw = await client.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY);
  if (!raw) return null;

  const buttonLabel = pickLabel(raw.navButton?.label ?? null, locale);
  const buttonUrl = resolveLink(raw.navButton?.link ?? null, locale);

  const navLinks = (raw.navLinks ?? []).flatMap((item) => {
    const label = pickLabel(item.label, locale);
    const url = resolveLink(item.link, locale);
    return label && url ? [{ label, url }] : [];
  });

  return {
    logo: raw.logo ?? null,
    navButton:
      buttonLabel && buttonUrl ? { label: buttonLabel, url: buttonUrl } : null,
    navLinks,
  };
}

export type HomeNavSection = { id: string; label: string };

type RawHomeNavSection = {
  _type: string;
  _key: string;
  showInNav: boolean | null;
  navLabel: string | null;
  heading: string | null;
  title: string | null;
};

const HOME_NAV_QUERY = groq`*[_id == $id][0].sections[]{
  _type, _key, showInNav, navLabel, heading, title
}`;

/**
 * Home sections that are switched on for the header menu, in page order. Ids
 * are computed over every section, not just the listed ones, so each link
 * matches the anchor the page renders.
 */
export async function getHomeNavSections(
  locale: string
): Promise<HomeNavSection[]> {
  const sections = await client.fetch<RawHomeNavSection[] | null>(
    HOME_NAV_QUERY,
    { id: `home-${locale}` }
  );
  const anchors = sectionAnchors(sections);

  return (sections ?? []).flatMap((section) => {
    const label = section.navLabel || section.heading || section.title;
    const id = anchors.get(section._key);
    return section.showInNav && label && id ? [{ id, label }] : [];
  });
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

const BREEDS_QUERY = groq`*[_type == "breed" && language == $locale] | order(name asc){
  _id, name, "slug": slug.current, subtitle, coverImage{ asset, alt }
}`;

/** All breeds for a locale, sorted alphabetically. */
export function getBreeds(locale: string) {
  return client.fetch<BreedListItem[]>(BREEDS_QUERY, { locale });
}

const BREED_QUERY = groq`*[_type == "breed" && language == $locale && slug.current == $slug][0]{
  _id, name, "slug": slug.current, subtitle, coverImage{ asset, alt },
  ${SECTIONS_FRAGMENT},
  ${TRANSLATIONS_FRAGMENT}
}`;

/** A single breed by slug within a locale, or null. */
export function getBreed(locale: string, slug: string) {
  return client
    .fetch<Breed | null>(BREED_QUERY, { locale, slug })
    .then((breed) => {
      if (!breed) return null;
      return { ...breed, sections: resolveSections(breed.sections, locale) };
    });
}

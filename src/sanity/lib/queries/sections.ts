import type { PortableTextBlock } from "@portabletext/react";
import { groq } from "next-sanity";

import { resolveLink } from "@/lib/resolve-link";
import { LINK_FRAGMENT, type SanityImage } from "./shared";

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

export type PageSection =
  | ArticleSection
  | BreedProfileSection
  | BreedsSection
  | HeroSection
  | NewsSection
  | ContactSection
  | SponsorsSection
  | SocialMediaSection;

/** Shared projection for a page-builder `sections` array. Reused by any type
 * that has one (pages, the home singleton, breeds). Keep in sync with `PageSection`. */
export const SECTIONS_FRAGMENT = groq`sections[]{
  _type, _key, title, heading, subheading, body, ctaLabel, ctaLink${LINK_FRAGMENT}, image{ asset, alt }, street, buildingNumber, postalCode, town, email, phone, sponsors[]{ _key, name, logo{ asset }, url }, links[]{ _key, platform, profileName, url, followersLabel, youtubeChannelId }, author[]{ firstName, lastName, bio, photo{ asset, alt } }, images[]{ asset, alt }, facts[]{ _key, label, value }
}`;

type RawPageSection = Record<string, unknown> & { _type: string; _key: string };

/** Turns each section's `ctaLink` reference into a locale-correct `ctaUrl`. */
function resolveSections(
  sections: RawPageSection[] | null,
  locale: string
): PageSection[] | null {
  if (!sections) return null;
  return sections.map((section): PageSection => {
    const hasCtaLink =
      section._type === "heroSection" || section._type === "sponsorsSection";
    if (hasCtaLink && section.ctaLink) {
      const ctaUrl = resolveLink(section.ctaLink as unknown, locale);
      return { ...section, ctaUrl } as PageSection;
    }
    return section as PageSection;
  });
}

/** Resolves `sections` on a fetched document, passing `null` documents through. */
export function withResolvedSections<
  T extends { sections: PageSection[] | null },
>(doc: T | null, locale: string) {
  if (!doc) return null;
  return { ...doc, sections: resolveSections(doc.sections, locale) };
}

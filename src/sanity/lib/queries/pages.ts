import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import { TRANSLATIONS_FRAGMENT, type DocTranslation } from "./shared";
import {
  SECTIONS_FRAGMENT,
  type PageSection,
  withResolvedSections,
} from "./sections";

export type PageDocument = {
  _id: string;
  title: string;
  slug: string;
  sections: PageSection[] | null;
  translations: DocTranslation[];
};

/** Any sections-based singleton (home, about, …). */
export type SectionsDocument = {
  sections: PageSection[] | null;
};

const PAGE_QUERY = groq`*[_type == "page" && language == $locale && slug.current == $slug][0]{
  _id, title, "slug": slug.current,
  ${SECTIONS_FRAGMENT},
  ${TRANSLATIONS_FRAGMENT}
}`;

// Singletons are fetched by their deterministic id (`<name>-<locale>`), so no
// `language`/slug filter is needed — the id encodes the language.
const SINGLETON_QUERY = groq`*[_id == $id][0]{ ${SECTIONS_FRAGMENT} }`;

/** A single page by slug within a locale, or null. */
export function getPage(locale: string, slug: string) {
  return client
    .fetch<PageDocument | null>(PAGE_QUERY, { locale, slug })
    .then((page) => withResolvedSections(page, locale));
}

function getSingleton(id: string, locale: string) {
  return client
    .fetch<SectionsDocument | null>(SINGLETON_QUERY, { id })
    .then((doc) => withResolvedSections(doc, locale));
}

/** The home page singleton for a locale, or null if not published yet. */
export function getHomePage(locale: string) {
  return getSingleton(`home-${locale}`, locale);
}

/** The about page singleton for a locale, or null if not published yet. */
export function getAboutPage(locale: string) {
  return getSingleton(`about-${locale}`, locale);
}

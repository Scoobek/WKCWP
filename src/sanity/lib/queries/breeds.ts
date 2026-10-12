import { groq } from "next-sanity";

import { client } from "@/sanity/lib/client";
import {
  TRANSLATIONS_FRAGMENT,
  type DocTranslation,
  type SanityImage,
} from "./shared";
import {
  SECTIONS_FRAGMENT,
  type PageSection,
  withResolvedSections,
} from "./sections";

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

const BREEDS_QUERY = groq`*[_type == "breed" && language == $locale] | order(name asc){
  _id, name, "slug": slug.current, subtitle, coverImage{ asset, alt }
}`;

const BREED_QUERY = groq`*[_type == "breed" && language == $locale && slug.current == $slug][0]{
  _id, name, "slug": slug.current, subtitle, coverImage{ asset, alt },
  ${SECTIONS_FRAGMENT},
  ${TRANSLATIONS_FRAGMENT}
}`;

/** All breeds for a locale, sorted alphabetically. */
export function getBreeds(locale: string) {
  return client.fetch<BreedListItem[]>(BREEDS_QUERY, { locale });
}

/** A single breed by slug within a locale, or null. */
export function getBreed(locale: string, slug: string) {
  return client
    .fetch<Breed | null>(BREED_QUERY, { locale, slug })
    .then((breed) => withResolvedSections(breed, locale));
}

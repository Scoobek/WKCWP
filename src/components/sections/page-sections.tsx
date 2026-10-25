import { Article } from "@/components/sections/article";
import { BreedProfile, Breeds } from "@/components/sections/breeds";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { ImageLinks } from "@/components/sections/image-links";
import { Profiles } from "@/components/sections/profiles";
import { News } from "@/components/sections/news";
import { SocialMedia } from "@/components/sections/social-media";
import type { PageSection } from "@/sanity/lib/queries";
import { Sponsors } from "@/components/sections/sponsors";
import { sectionAnchors } from "@/lib/section-anchor";

/**
 * The render loop. Maps each section in a page's `sections` array to its
 * component, switching on `_type`. Adding a section type = one more `case`.
 * Element ids come from `sectionAnchors`, which the header menu also uses.
 */
export function PageSections({
  sections,
  locale,
  category = "all",
  page = 1,
}: {
  sections: PageSection[] | null;
  locale?: string;
  category?: string;
  page?: number;
}) {
  const anchors = sectionAnchors(sections);

  // `?? []` guards pages with an empty/missing sections array.
  return (sections ?? []).map((section) => {
    const id = anchors.get(section._key);

    switch (section._type) {
      case "articleSection":
        return <Article key={section._key} {...section} id={id} />;
      case "breedProfileSection":
        return <BreedProfile key={section._key} {...section} id={id} />;
      case "breedsSection":
        return (
          <Breeds
            key={section._key}
            {...section}
            locale={locale || "pl"}
            id={id}
          />
        );
      case "contactSection":
        return <Contact key={section._key} {...section} id={id} />;
      case "heroSection":
        return <Hero key={section._key} {...section} id={id} />;
      case "imageLinksSection":
        return <ImageLinks key={section._key} {...section} id={id} />;
      case "newsSection":
        return (
          <News
            key={section._key}
            {...section}
            locale={locale || "pl"}
            category={category}
            page={page}
            id={id}
          />
        );
      case "socialMediaSection":
        return (
          <SocialMedia
            key={section._key}
            {...section}
            locale={locale || "pl"}
            id={id}
          />
        );
      case "profilesSection":
        return <Profiles key={section._key} {...section} id={id} />;
      case "sponsorsSection":
        return <Sponsors key={section._key} {...section} id={id} />;
      default:
        // A section type exists in the CMS but has no component yet (e.g. a
        // new section added to the schema before its renderer). Skip it, but
        // make the gap visible during development.
        if (process.env.NODE_ENV !== "production") {
          const unknown = section as { _type: string };
          console.warn(`No component for section type "${unknown._type}"`);
        }
        return null;
    }
  });
}

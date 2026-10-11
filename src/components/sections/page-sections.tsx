import { Locale } from "@/i18n/locales";
import { Article } from "@/components/sections/article";
import { BreedProfile, Breeds } from "@/components/sections/breeds";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { News } from "@/components/sections/news";
import { SocialMedia } from "@/components/sections/social-media";
import type { PageSection } from "@/sanity/lib/queries";
import { Sponsors } from "@/components/sections/sponsors";

/**
 * The render loop. Maps each section in a page's `sections` array to its
 * component, switching on `_type`. Adding a section type = one more `case`.
 */
export function PageSections({
  sections,
  locale = Locale.PL,
  category = "all",
  page = 1,
}: {
  sections: PageSection[] | null;
  locale?: string;
  category?: string;
  page?: number;
}) {
  // `?? []` guards pages with an empty/missing sections array.
  return (sections ?? []).map((section) => {
    switch (section._type) {
      case "articleSection":
        return (
          <Article
            key={section._key}
            {...section}
            id={`article-${section._key}`}
          />
        );
      case "breedProfileSection":
        return (
          <BreedProfile
            key={section._key}
            {...section}
            id={`breed-profile-${section._key}`}
          />
        );
      case "breedsSection":
        return (
          <Breeds key={section._key} {...section} locale={locale} id="breeds" />
        );
      case "contactSection":
        return <Contact key={section._key} {...section} id="contact" />;
      case "heroSection":
        return <Hero key={section._key} {...section} id="hero" />;
      case "newsSection":
        return (
          <News
            key={section._key}
            {...section}
            locale={locale}
            category={category}
            page={page}
            id="news"
          />
        );
      case "socialMediaSection":
        return (
          <SocialMedia
            key={section._key}
            {...section}
            locale={locale}
            id="social-media"
          />
        );
      case "sponsorsSection":
        return <Sponsors key={section._key} {...section} id="sponsors" />;
      default: {
        // Compile-time guard: if a PageSection type has no case above, this
        // assignment fails to type-check. At runtime, a CMS section with no
        // renderer (e.g. schema added before its component) is skipped with a
        // dev-only warning.
        const unhandled: never = section;
        if (process.env.NODE_ENV !== "production") {
          const type = (unhandled as { _type: string })._type;
          console.warn(`No component for section type "${type}"`);
        }
        return null;
      }
    }
  });
}

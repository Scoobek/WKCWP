import { Hero } from "@/components/sections/hero";
import type { PageSection } from "@/sanity/lib/queries";

/**
 * The render loop. Maps each section in a page's `sections` array to its
 * component, switching on `_type`. Adding a section type = one more `case`.
 */
export function PageSections({ sections }: { sections: PageSection[] | null }) {
  // `?? []` guards pages with an empty/missing sections array.
  return (sections ?? []).map((section) => {
    switch (section._type) {
      case "heroSection":
        return <Hero key={section._key} {...section} />;
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

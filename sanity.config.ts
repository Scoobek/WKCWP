/**
 * This configuration is used for the Sanity Studio mounted on the `/studio`
 * route in `src/app/studio/[[...tool]]/page.tsx`.
 */
import { documentInternationalization } from "@sanity/document-internationalization";
// import { plPLLocale } from "@sanity/locale-pl-pl";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { supportedLanguages } from "@/sanity/i18n";
import { schema } from "@/sanity/schemaTypes";
import { singletonTypes, structure } from "@/sanity/structure";

const LOCALIZED_TYPES = new Set(["post", "page"]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  // Singletons are created via the custom structure, so keep them out of the
  // global "Create new" menu. Localized types must only be created via the
  // per-language template (e.g. "Polski Page") to ensure `language` is set.
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => {
        // Hide singletons (managed via structure)
        if (singletonTypes.has(item.templateId)) return false;
        // Localized types: only the per-language template may create one.
        // The plain "page"/"post" (no suffix) would create an orphan with
        // no language set, invisible to both the Studio list and frontend queries.
        if (LOCALIZED_TYPES.has(item.templateId)) return false;
        // English is added via the plugin's "Translate" action on the PL doc.
        if (item.templateId.endsWith("-en")) return false;
        return true;
      }),
  },
  // Studio UI language. Sanity defaults to the *last* locale for users without a
  // saved preference, so sorting pl-PL last makes Polish the default while
  // English stays selectable in the user menu.
  i18n: {
    locales: (prev) => {
      const pl = prev.filter((l) => l.id === "pl-PL");
      const others = prev.filter((l) => l.id !== "pl-PL");
      return [...others, ...pl];
    },
  },
  plugins: [
    structureTool({ structure }),
    // Vision lets you query your content with GROQ from inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
    // Document-level translation: one document per language, linked together.
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ["post", "page"],
    }),
    // Polish UI strings for the Studio chrome.
    // plPLLocale(),
  ],
});

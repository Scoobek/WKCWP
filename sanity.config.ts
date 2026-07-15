/**
 * This configuration is used for the Sanity Studio mounted on the `/studio`
 * route in `src/app/studio/[[...tool]]/page.tsx`.
 */
import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { supportedLanguages } from "@/sanity/i18n";
import { schema } from "@/sanity/schemaTypes";
import { singletonTypes, structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  // Singletons are created via the custom structure, so keep them out of the
  // global "Create new" menu.
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !singletonTypes.has(item.templateId)),
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
  ],
});

import type { StructureResolver } from "sanity/structure";

import { supportedLanguages } from "@/sanity/i18n";

/**
 * Singletons: one document per language, addressed by a deterministic id
 * (`<id>-<lang>`, e.g. `home-pl`). Add future singletons (contact, etc.) here.
 */
const SINGLETONS = [
  { id: "home", type: "homePage", title: "Home Page" },
  { id: "about", type: "aboutPage", title: "About" },
];

/** Singleton schema-type names — used to keep them out of the "Create" menu. */
export const singletonTypes = new Set(SINGLETONS.map((s) => s.type));

/**
 * Custom Studio sidebar. Replaces the default flat document list so that:
 * - singletons open one fixed document per language (no create/duplicate), and
 * - the remaining types keep their normal, listable behaviour.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map((singleton) =>
        S.listItem()
          .title(singleton.title)
          .id(singleton.id)
          .child(
            S.list()
              .title(singleton.title)
              .items(
                supportedLanguages.map((lang) =>
                  S.listItem()
                    .title(lang.title)
                    .id(`${singleton.id}-${lang.id}`)
                    .child(
                      S.document()
                        .schemaType(singleton.type)
                        .documentId(`${singleton.id}-${lang.id}`)
                        .title(`${singleton.title} (${lang.title})`)
                    )
                )
              )
          )
      ),
      S.divider(),
      // Only show base language (Polish) documents in the list
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(
          S.documentList()
            .title("Pages")
            .schemaType("page")
            .filter('_type == "page" && language == "pl"')
        ),
      S.listItem()
        .title("Posts")
        .schemaType("post")
        .child(
          S.documentList()
            .title("Posts")
            .schemaType("post")
            .filter('_type == "post" && language == "pl"')
        ),
    ]);

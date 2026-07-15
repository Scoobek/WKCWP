import type { StructureResolver } from "sanity/structure";

import { supportedLanguages } from "@/sanity/i18n";

/**
 * Singletons: one document per language, addressed by a deterministic id
 * (`<id>-<lang>`, e.g. `home-pl`). Add future singletons (about, contact) here.
 */
const SINGLETONS = [{ id: "home", type: "homePage", title: "Home Page" }];

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
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("post").title("Posts"),
    ]);

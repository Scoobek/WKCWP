import type { PortableTextBlock } from "@portabletext/react";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
  key: string;
}

/** Slugify text for use in heading ids */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Extract headings from Portable Text body and generate stable ids.
 * Returns both a list of headings and a key->id map for renderer use. */
export function getHeadings(body: PortableTextBlock[] | null | undefined): {
  headings: Heading[];
  keyToId: Record<string, string>;
} {
  const headings: Heading[] = [];
  const keyToId: Record<string, string> = {};
  const idCounts: Record<string, number> = {};

  if (!body) return { headings, keyToId };

  body.forEach((block) => {
    if (block.style === "h2" || block.style === "h3") {
      const text = block.children
        .map((child) =>
          "text" in child ? (child as Record<string, unknown>).text : ""
        )
        .join("");
      if (!text.trim()) return;

      const baseId = slugify(text);
      const level = (block.style === "h2" ? 2 : 3) as 2 | 3;

      let id = baseId;
      if (idCounts[baseId] !== undefined) {
        idCounts[baseId]++;
        id = `${baseId}-${idCounts[baseId]}`;
      } else {
        idCounts[baseId] = 1;
      }

      const heading: Heading = {
        id,
        text,
        level,
        key: block._key || baseId,
      };

      headings.push(heading);
      keyToId[block._key || baseId] = id;
    }
  });

  return { headings, keyToId };
}

import type { DocTranslation } from "@/sanity/lib/queries";

/** A `link` object as fetched from Sanity, with the file and page targets projected. */
export type RawLink = {
  linkType: "internal" | "external" | "file" | null;
  external: string | null;
  blank?: boolean | null;
  internal: {
    slug: string | null;
    translations: DocTranslation[];
  } | null;
  fileUrl?: string | null;
  fileName?: string | null;
};

/** A link ready to render: `kind` picks the component, `href` is its target. */
export type ResolvedLink = {
  kind: "internal" | "external" | "file";
  href: string;
  blank: boolean;
  fileName: string | null;
};

export function resolveLinkTarget(
  link: RawLink | null | unknown,
  locale: string
): ResolvedLink | null {
  if (!link) return null;

  const typed = link as RawLink;
  const blank = Boolean(typed.blank);

  if (typed.linkType === "external" && typed.external) {
    return { kind: "external", href: typed.external, blank, fileName: null };
  }

  if (typed.linkType === "file" && typed.fileUrl) {
    // `download` is ignored for cross-origin URLs (the Sanity CDN), so ask the
    // CDN to send the file as an attachment under its original name.
    const fileName = typed.fileName ?? null;
    return {
      kind: "file",
      href: `${typed.fileUrl}?dl=${encodeURIComponent(fileName ?? "")}`,
      blank: false,
      fileName,
    };
  }

  if (typed.linkType === "internal" && typed.internal) {
    const match = typed.internal.translations.find((t) => t.locale === locale);
    // Link to the translated slug for the current locale. If there's no
    // translation for this locale, use the page's own slug — it will 404
    // when accessed from the wrong locale.
    const slug = match?.slug ?? typed.internal.slug;
    return slug
      ? { kind: "internal", href: `/${slug}`, blank, fileName: null }
      : null;
  }

  return null;
}

export function resolveLink(
  link: RawLink | null | unknown,
  locale: string
): string | null {
  return resolveLinkTarget(link, locale)?.href ?? null;
}

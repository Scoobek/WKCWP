import type { DocTranslation } from "@/sanity/lib/queries";

export type RawLink = {
  linkType: "internal" | "external" | null;
  external: string | null;
  internal: {
    slug: string | null;
    translations: DocTranslation[];
  } | null;
};

export function resolveLink(
  link: RawLink | null | unknown,
  locale: string
): string | null {
  if (!link) return null;

  const typed = link as RawLink;

  if (typed.linkType === "external") {
    return typed.external ?? null;
  }

  if (typed.linkType === "internal" && typed.internal) {
    const match = typed.internal.translations.find((t) => t.locale === locale);
    const slug = match?.slug ?? typed.internal.slug;
    return slug ? `/${slug}` : null;
  }

  return null;
}

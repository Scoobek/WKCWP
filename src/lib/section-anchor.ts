type AnchorableSection = { _type: string; _key: string };

/**
 * The element id a section is rendered with. Shared by the page renderer and the
 * header menu, so a menu link always lands on the section it names. Ids match
 * the ones the site already uses, so existing `#news` links keep working.
 */
function baseId(section: AnchorableSection): string {
  switch (section._type) {
    case "articleSection":
      return `article-${section._key}`;
    case "breedProfileSection":
      return `breed-profile-${section._key}`;
    case "breedsSection":
      return "breeds";
    case "contactSection":
      return "contact";
    case "heroSection":
      return "hero";
    case "imageLinksSection":
      return "image-links";
    case "newsSection":
      return "news";
    case "socialMediaSection":
      return "social-media";
    case "profilesSection":
      return "profiles";
    case "sponsorsSection":
      return "sponsors";
    default:
      return `section-${section._key}`;
  }
}

/**
 * Element id for every section, keyed by `_key`. A repeated fixed id gets a
 * numeric suffix (`news`, `news-2`, ...) so anchors stay unique on the page.
 */
export function sectionAnchors(
  sections: AnchorableSection[] | null | undefined
): Map<string, string> {
  const anchors = new Map<string, string>();
  const seen = new Map<string, number>();

  for (const section of sections ?? []) {
    const base = baseId(section);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    anchors.set(section._key, count === 1 ? base : `${base}-${count}`);
  }

  return anchors;
}

import { defineRouting } from "next-intl/routing";
import { Locale } from "@/i18n/locales";

/**
 * Locale routing config — the single source of truth for supported locales.
 * Polish is the default; URLs are always prefixed (`/pl`, `/en`).
 */
export const routing = defineRouting({
  locales: Object.values(Locale),
  defaultLocale: Locale.PL,
  localePrefix: "always",
  // Localized URLs for static/singleton routes. The folder stays `/about`
  // internally; next-intl rewrites the public URL per locale. Collection routes
  // (posts, [slug]) localize via their Sanity slugs, so they map to themselves.
  // To localize another singleton later, add an entry here.
  pathnames: {
    "/": "/",
    "/about": { pl: "/o-nas", en: "/about" },
    "/posts": "/posts",
    "/posts/[slug]": "/posts/[slug]",
    "/breeds": { pl: "/rasy", en: "/breeds" },
    "/breeds/[slug]": { pl: "/rasy/[slug]", en: "/breeds/[slug]" },
    "/[slug]": "/[slug]",
    "/[...rest]": "/[...rest]",
  },
});

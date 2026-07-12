import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config — the single source of truth for supported locales.
 * Polish is the default; URLs are always prefixed (`/pl`, `/en`).
 */
export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

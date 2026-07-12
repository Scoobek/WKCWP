"use client";

import { useLocale } from "next-intl";

import { useLocaleAlternates } from "@/components/layout/locale-alternates";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Links to the current page under each locale. `usePathname()` from the i18n
 * navigation returns the path WITHOUT the locale prefix, so `Link` with a
 * `locale` prop switches language while preserving the route.
 *
 * Pages with per-locale paths (e.g. a post whose slug differs per language)
 * publish them via `SetLocaleAlternates`; when present we link each locale to
 * its own path instead of blindly reusing `pathname` — which would 404 on a
 * post whose translated slug differs. Otherwise we fall back to path reuse.
 *
 * `replace` is used so switching language swaps the current history entry
 * instead of pushing a new one — otherwise repeated toggling grows the back
 * stack with locale switches.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const active = useLocale();
  const alternates = useLocaleAlternates();

  // On a page with per-locale paths (alternates present), a locale missing from
  // the map has no translation — send it to that locale's posts list rather than
  // reusing this path (which would 404). Elsewhere, reuse the current path.
  const hrefFor = (locale: string) =>
    alternates ? (alternates[locale] ?? "/posts") : pathname;

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          locale={locale}
          replace
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "rounded px-1.5 py-0.5 uppercase transition-colors",
            locale === active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}

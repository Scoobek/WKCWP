"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { type ComponentProps } from "react";

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
 * post whose translated slug differs. The published map covers every locale
 * (see `buildLocaleAlternates`), so no per-type fallback is needed here.
 * Otherwise (no map) we fall back to path reuse.
 *
 * `replace` is used so switching language swaps the current history entry
 * instead of pushing a new one — otherwise repeated toggling grows the back
 * stack with locale switches.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();
  const alternates = useLocaleAlternates();

  // On a page with per-locale paths, link each locale to its published path
  // (the map covers every locale, including a fallback for those without a
  // translation). Elsewhere (no map), reuse the current route — passed as
  // `{ pathname, params }` so dynamic routes like `/posts/[slug]` get their
  // params (a bare template would throw "Insufficient params"). `Link` also
  // localizes it via `pathnames` (e.g. /about → /pl/o-nas).
  //
  // Alternates are concrete, runtime-validated paths (they carry per-locale
  // Sanity slugs); cast to the typed href — they can't be expressed as the
  // static `pathnames` union.
  const hrefFor = (locale: string) =>
    (alternates ? alternates[locale] : { pathname, params }) as ComponentProps<
      typeof Link
    >["href"];

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

"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Links to the current page under each locale. `usePathname()` from the i18n
 * navigation returns the path WITHOUT the locale prefix, so `Link` with a
 * `locale` prop switches language while preserving the route.
 *
 * `replace` is used so switching language swaps the current history entry
 * instead of pushing a new one — otherwise repeated toggling grows the back
 * stack with locale switches.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
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

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Link } from "@/i18n/navigation";

/**
 * Localized 404 for the public site. Rendered inside the `(site)` layout, so it
 * keeps the Header/Footer chrome, and inside `[locale]/layout.tsx`, so fonts,
 * theme and the intl provider are in place. It's the boundary for any
 * `notFound()` thrown in the group (e.g. an unresolved post slug) and for the
 * `[...rest]` catch-all that maps unknown localized URLs here.
 *
 * `not-found.tsx` receives no params, so we read strings via `getTranslations`
 * (the request locale is resolved from the URL). It renders dynamically, which
 * is fine for a 404.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Section>
      <Container>
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-muted-foreground text-6xl font-semibold tracking-tight sm:text-7xl">
            404
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
          <div>
            <Link
              href="/"
              className="text-foreground hover:text-muted-foreground text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

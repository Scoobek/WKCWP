import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";

/** Site header shell: sticky, bordered, with brand + nav + locale/theme controls. */
export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            WKCwP
          </Link>
          <nav className="flex items-center gap-6">
            <ul className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-foreground transition-colors"
                >
                  {t("posts")}
                </Link>
              </li>
            </ul>
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </Container>
    </header>
  );
}

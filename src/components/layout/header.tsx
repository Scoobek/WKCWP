import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { HeaderLogo } from "@/components/layout/header-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavAnchorLink } from "@/components/layout/nav-anchor-link";
import { NavCta } from "@/components/layout/nav-cta";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";
import type { NavItem } from "@/components/layout/types";
import { getSiteSettings } from "@/sanity/lib/queries";

/** Site header shell: sticky, bordered, with brand + nav + locale/theme controls. */
export async function Header() {
  const t = await getTranslations("nav");
  const locale = await getLocale();
  const settings = await getSiteSettings(locale);
  const navButton = settings?.navButton ?? null;

  const navItems: NavItem[] = [
    { id: "home", href: "/", label: t("home"), isAnchor: false },
    { id: "news", href: "#news", label: t("news"), isAnchor: true },
    {
      id: "contact",
      href: "#contact",
      label: t("contact"),
      isAnchor: true,
    },
  ];

  return (
    <header className="border-border bg-foreground sticky top-0 z-40 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <HeaderLogo logo={settings?.logo ?? null} />

          {/* Desktop nav: hidden below lg */}
          <nav className="hidden items-center gap-6 lg:flex">
            <ul className="flex items-center gap-6 text-sm font-medium text-white">
              {navItems.map((item) =>
                item.isAnchor ? (
                  <li key={item.id}>
                    <NavAnchorLink
                      item={item}
                      className="hover:text-accent transition-colors"
                    />
                  </li>
                ) : (
                  <li key={item.id}>
                    <Link
                      href="/"
                      className="hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
            {navButton && <NavCta button={navButton} />}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {/* <ThemeToggle /> */}
            </div>
          </nav>

          {/* Mobile menu: shown below lg */}
          <MobileMenu items={navItems} cta={navButton} />
        </div>
      </Container>
    </header>
  );
}

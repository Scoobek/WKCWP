import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";

/** Site header shell: sticky, bordered, with brand + nav + locale/theme controls. */
export function Header() {
  const t = useTranslations("nav");

  const navItems = [
    { id: "home", href: "/", label: t("home") },
    { id: "news", href: { pathname: "/", hash: "news" }, label: t("news") },
    {
      id: "contact",
      href: { pathname: "/", hash: "contact" },
      label: t("contact"),
    },
  ];

  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            WKCwP
          </Link>

          {/* Desktop nav: hidden below lg */}
          <nav className="hidden items-center gap-6 lg:flex">
            <ul className="text-muted-foreground flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.id}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile menu: shown below lg */}
          <MobileMenu items={navItems} />
        </div>
      </Container>
    </header>
  );
}

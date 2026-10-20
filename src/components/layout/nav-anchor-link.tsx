"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/components/layout/types";

/**
 * Section link for the header. On the home page it is a plain in-page anchor
 * (smooth scroll, keeps the query string). On any other page a bare `#id`
 * would resolve against that page's URL, so it routes to the home page of the
 * current locale with the hash instead.
 */
export function NavAnchorLink({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const hash = item.href.replace(/^#/, "");

  if (pathname === "/") {
    return (
      <a href={item.href} onClick={onClick} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={{ pathname: "/", hash }}
      onClick={onClick}
      className={className}
    >
      {item.label}
    </Link>
  );
}

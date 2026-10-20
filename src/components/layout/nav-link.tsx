import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/i18n/navigation";

/**
 * Header link to a page or an external URL. Internal paths use the locale-aware
 * Link (the URL is already resolved to the translated slug); external URLs open
 * in a new tab. No hooks, so it renders from both the server header and the
 * client menu.
 */
export function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  // The URL comes from Sanity as a free-form string, so cast to the typed href.
  return (
    <Link
      href={href as ComponentProps<typeof Link>["href"]}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
}

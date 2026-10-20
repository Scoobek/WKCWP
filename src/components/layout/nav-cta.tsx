import type { ComponentProps } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavButton } from "@/components/layout/types";

/**
 * Primary header button. Internal paths use the locale-aware Link (the URL is
 * already resolved to the translated slug); external URLs open in a new tab.
 * No hooks, so it renders from both the server header and the client menu.
 */
export function NavCta({
  button,
  className,
  onClick,
}: {
  button: NavButton;
  className?: string;
  onClick?: () => void;
}) {
  const styles = cn(
    "bg-primary text-primary-foreground inline-block rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90",
    className
  );

  if (/^https?:\/\//.test(button.url)) {
    return (
      <a
        href={button.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={styles}
      >
        {button.label}
      </a>
    );
  }

  // The URL comes from Sanity as a free-form string, so cast to the typed href.
  return (
    <Link
      href={button.url as ComponentProps<typeof Link>["href"]}
      onClick={onClick}
      className={styles}
    >
      {button.label}
    </Link>
  );
}

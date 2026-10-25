import { type ComponentProps, type ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import type { ResolvedLink } from "@/lib/resolve-link";

/**
 * A link to any target the CMS can pick. Internal pages go through the
 * locale-aware `Link`; external URLs and file downloads are plain anchors,
 * since the file URL is on another origin and must not be routed.
 */
export function AppLink({
  link,
  className,
  children,
}: {
  link: ResolvedLink;
  className?: string;
  children: ReactNode;
}) {
  const newTab = link.blank
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  if (link.kind === "internal") {
    return (
      <Link
        href={link.href as ComponentProps<typeof Link>["href"]}
        className={className}
        {...newTab}
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className} {...newTab}>
      {children}
    </a>
  );
}

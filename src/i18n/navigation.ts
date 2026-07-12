import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/**
 * Locale-aware navigation APIs. Use these `Link` / navigation helpers instead
 * of the ones from `next/link` / `next/navigation` so the active locale prefix
 * is applied automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

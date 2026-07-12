import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Locale negotiation + redirects (Next.js 16 "Proxy", formerly Middleware).
 * The matcher skips `/studio` (the un-localized Sanity Studio), API routes,
 * Next internals, and any path with a file extension.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};

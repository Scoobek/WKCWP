import { notFound } from "next/navigation";

/**
 * Catch-all for unknown localized URLs. With `localePrefix: "always"` a path
 * like `/pl/nope` matches the `[locale]` segment but no page; without this
 * route it would escape to the global 404 (no site chrome). Living inside the
 * `(site)` group, its `notFound()` resolves to the chrome'd `not-found.tsx`.
 *
 * `[...rest]` requires at least one segment, so it never shadows the `/[locale]`
 * home route.
 */
export default function CatchAllPage() {
  notFound();
}

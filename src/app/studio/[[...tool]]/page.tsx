/**
 * This route mounts the Sanity Studio at `/studio`.
 *
 * `dynamic = "force-static"` is valid here because Cache Components is NOT
 * enabled in `next.config.ts`. If Cache Components is ever turned on, this
 * export stops working (see node_modules/next/dist/docs/01-app/02-guides/
 * caching-without-cache-components.md) and would need to be revisited.
 *
 * The Studio itself lives in `./Studio` (a Client Component) so Sanity's
 * browser code is not evaluated in the React Server Component layer.
 */
import Studio from "./Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}

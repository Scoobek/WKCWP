import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { client } from "@/sanity/lib/client";

const builder = createImageUrlBuilder(client);

/**
 * Turns a Sanity image reference (from a query) into a URL builder. Chain
 * transforms and finish with `.url()`, e.g.
 * `urlFor(image.asset).width(1600).height(900).url()`.
 * Shared across the project — any `image` field can use it.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

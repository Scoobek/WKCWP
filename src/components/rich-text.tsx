import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";

type ImageValue = { asset?: { _ref?: string }; alt?: string };
type LinkValue = { href?: string; blank?: boolean };

/** Parse `image-<id>-<width>x<height>-<ext>` refs into pixel dimensions so
 * next/image gets the right intrinsic aspect ratio. */
function refDimensions(ref: string): { width: number; height: number } | null {
  const size = ref.split("-")[2];
  if (!size) return null;
  const [width, height] = size.split("x").map(Number);
  if (!width || !height) return null;
  return { width, height };
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const img = value as ImageValue;
      const ref = img.asset?._ref;
      if (!ref) return null;
      const dims = refDimensions(ref);
      return (
        <figure className="my-6">
          <Image
            src={urlFor(img).width(1600).fit("max").auto("format").url()}
            alt={img.alt ?? ""}
            width={dims?.width ?? 1600}
            height={dims?.height ?? 900}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-lg"
          />
          {img.alt ? (
            <figcaption className="text-muted-foreground mt-2 text-sm">
              {img.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const link = value as LinkValue | undefined;
      const blank = link?.blank;
      return (
        <a
          href={link?.href ?? "#"}
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-foreground hover:text-muted-foreground underline underline-offset-4 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

/**
 * Renders Sanity Portable Text (`body`) with our serializers: block-level
 * images (via `@sanity/image-url` + next/image) and link annotations. Default
 * blocks, lists and decorators fall back to `@portabletext/react`'s built-ins.
 */
export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}

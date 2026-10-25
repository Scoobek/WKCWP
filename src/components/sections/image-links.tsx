import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { urlFor } from "@/sanity/lib/image";
import type { ImageLinkItem, ImageLinksSection } from "@/sanity/lib/queries";

type ReadyImageLink = ImageLinkItem & {
  image: NonNullable<ImageLinkItem["image"]> & { asset: { _ref: string } };
  url: string;
};

function isReady(item: ImageLinkItem): item is ReadyImageLink {
  return Boolean(item.image?.asset && item.url);
}

/** A white band of clickable images, packed to the right. Each image is a fixed 100x100 box. */
export function ImageLinks({ items, id }: ImageLinksSection & { id?: string }) {
  const ready = (items ?? []).filter(isReady);
  if (ready.length === 0) return null;

  return (
    <Section id={id} tone="default" className="bg-white">
      <Container>
        <div className="flex flex-wrap justify-end gap-4">
          {ready.map((item) => (
            <a
              key={item._key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 transition-opacity hover:opacity-75"
            >
              <Image
                src={urlFor(item.image.asset)
                  .width(200)
                  .height(200)
                  .fit("max")
                  .url()}
                alt={item.image.alt || ""}
                width={100}
                height={100}
                className="h-[100px] w-[100px] object-contain"
              />
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryBlock } from "@/sanity/lib/queries";

export async function GalleryBlockView({ heading, images }: GalleryBlock) {
  const t = await getTranslations("posts.gallery");

  if (!images || images.length === 0) return null;

  const resolvedImages = images.map((img) => ({
    src: img.asset ? urlFor(img.asset).width(800).height(600).url() : "",
    alt: img.alt || "",
  }));

  return (
    <Container>
      {heading && <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>}
      <GalleryGrid images={resolvedImages} moreCountTemplate={t("moreCount")} />
    </Container>
  );
}

import { Container } from "@/components/layout/container";
import { Grid, Col } from "@/components/layout/grid";
import { RichText } from "@/components/rich-text";
import { EventDetailsBlockView } from "@/components/sections/event-details-block";
import { urlFor } from "@/sanity/lib/image";
import type {
  PostBlock,
  GalleryBlock,
  EventDetailsBlock,
  NewsCategory,
} from "@/sanity/lib/queries";
import Image from "next/image";

function GalleryBlockView({ heading, images }: GalleryBlock) {
  if (!images || images.length === 0) return null;

  return (
    <Container>
      {heading && <h2 className="mb-6 text-2xl font-semibold">{heading}</h2>}
      <Grid>
        {images.map((img, i) =>
          img.asset ? (
            <Col key={i} span={12} md={6} lg={4}>
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                <Image
                  src={urlFor(img.asset).width(800).height(600).url()}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            </Col>
          ) : null
        )}
      </Grid>
    </Container>
  );
}

export function PostContent({
  blocks,
  location,
  eventType,
}: {
  blocks: PostBlock[] | null;
  location: string | null;
  eventType: NewsCategory | null;
}) {
  return (blocks ?? []).map((block) => {
    switch (block._type) {
      case "richTextBlock":
        return block.text ? (
          <div key={block._key} className="mx-auto leading-7">
            <RichText value={block.text} />
          </div>
        ) : null;
      case "galleryBlock":
        return <GalleryBlockView key={block._key} {...block} />;
      case "eventDetailsBlock":
        return (
          <div key={block._key}>
            <EventDetailsBlockView
              {...(block as EventDetailsBlock)}
              location={location}
              eventType={eventType}
            />
          </div>
        );
      default:
        if (process.env.NODE_ENV !== "production") {
          const unknown = block as { _type: string };
          console.warn(
            `No component for content block type "${unknown._type}"`
          );
        }
        return null;
    }
  });
}

import { RichText } from "@/components/rich-text";
import { EventDetailsBlockView } from "@/components/sections/event-details-block";
import { GalleryBlockView } from "@/components/sections/gallery-block";
import { LocalisationBlockView } from "@/components/sections/localisation-block";
import type {
  PostBlock,
  EventDetailsBlock,
  LocalisationBlock,
  NewsCategory,
} from "@/sanity/lib/queries";

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
      case "localisationBlock":
        return (
          <div key={block._key}>
            <LocalisationBlockView
              {...(block as LocalisationBlock)}
              townName={location}
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

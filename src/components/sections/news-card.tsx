import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";
import { type NewsPost } from "@/sanity/lib/queries";
import { ImagePlaceholder } from "./image-placeholder";

export function NewsCard({ post, locale }: { post: NewsPost; locale: string }) {
  const categoryTitle = NEWS_CATEGORIES.find(
    (cat) => cat.id === post.category
  )?.title;

  const imageUrl = post.coverImage?.asset
    ? urlFor(post.coverImage.asset).width(600).height(400).url()
    : null;

  const displayDate = post.eventDate ?? post.publishedAt;
  const eventDate = displayDate
    ? new Date(displayDate).toLocaleDateString(
        locale === "pl" ? "pl-PL" : "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : null;

  return (
    <Link
      href={{ pathname: "/posts/[slug]", params: { slug: post.slug } }}
      className="group block"
    >
      <div className="border-border h-full overflow-hidden rounded-lg border transition hover:shadow-lg">
        {/* Cover image */}
        <div className="bg-background relative aspect-4/3 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.coverImage?.alt || post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div className="p-4">
          {/* Category + date row */}
          <div className="mb-3 flex items-center justify-between gap-2">
            {categoryTitle && (
              <span className="bg-accent text-accent-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                {categoryTitle}
              </span>
            )}
            {eventDate && (
              <span className="text-muted-foreground text-xs">{eventDate}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-foreground group-hover:text-muted-foreground mb-3 line-clamp-2 text-lg font-semibold">
            {post.title}
          </h3>

          {/* Location */}
          {post.location && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <svg
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

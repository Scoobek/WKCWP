import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import type { BreedListItem } from "@/sanity/lib/queries";
import { ImagePlaceholder } from "../image-placeholder";

export function BreedCard({ breed }: { breed: BreedListItem }) {
  const imageUrl = breed.coverImage?.asset
    ? urlFor(breed.coverImage.asset).width(600).height(400).url()
    : null;

  return (
    <Link
      href={{ pathname: "/breeds/[slug]", params: { slug: breed.slug } }}
      className="group block w-full"
    >
      <div className="border-border h-full overflow-hidden rounded-lg border transition hover:shadow-lg">
        {/* Cover image */}
        <div className="bg-muted relative aspect-4/3 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={breed.coverImage?.alt || breed.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div className="p-4">
          {/* Breed name */}
          <h3 className="text-foreground group-hover:text-muted-foreground mb-2 text-lg font-semibold">
            {breed.name}
          </h3>

          {/* Subtitle */}
          {breed.subtitle && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {breed.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

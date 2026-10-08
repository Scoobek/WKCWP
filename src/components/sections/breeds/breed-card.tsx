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
      <div className="h-full overflow-hidden rounded-lg border border-gray-200 transition hover:shadow-lg dark:border-gray-800">
        {/* Cover image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={breed.coverImage?.alt || breed.name}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        <div className="p-4">
          {/* Breed name */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
            {breed.name}
          </h3>

          {/* Subtitle */}
          {breed.subtitle && (
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {breed.subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

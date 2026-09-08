"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryGridProps = {
  images: GalleryImage[];
  moreCountTemplate: string;
};

export function GalleryGrid({ images, moreCountTemplate }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const hero = images[0];
  const gridImages = images.slice(1, 5);
  const totalCount = images.length;
  const moreCount = totalCount > 5 ? totalCount - 5 : 0;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Hero image — 50% on desktop, full width on mobile */}
        <div
          className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gray-200 lg:w-[50%] dark:bg-gray-800"
          style={{ aspectRatio: "4/3" }}
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openLightbox(0);
          }}
        >
          <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
        </div>

        {/* Grid of up to 4 images — 50% on desktop, full width on mobile */}
        {images.length > 1 && (
          <div className="w-full lg:w-[50%]">
            <div className="grid grid-cols-2 gap-4">
              {gridImages.map((img, idx) => {
                const realIndex = idx + 1;
                const isLastCell = idx === gridImages.length - 1;
                const showOverlay = isLastCell && moreCount > 0;

                return (
                  <div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800"
                    style={{ aspectRatio: "4/3" }}
                    onClick={() => openLightbox(realIndex)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        openLightbox(realIndex);
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                    {showOverlay && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                        <div className="text-center text-white">
                          <div className="text-2xl font-semibold">
                            +{moreCount}
                          </div>
                          <div className="text-sm">
                            {moreCountTemplate.replace(
                              "{count}",
                              `${moreCount}`
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={closeLightbox}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      />
    </>
  );
}

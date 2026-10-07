"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { urlFor } from "@/sanity/lib/image";
import type { BreedSection } from "@/sanity/lib/queries";

type BreedGalleryImage = {
  src: string;
  alt: string;
};

export function Breed({
  heading,
  subheading,
  images,
  facts,
  id,
}: BreedSection & { id?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build image gallery from Sanity images
  const galleryImages: BreedGalleryImage[] =
    images
      ?.map((img) => {
        if (!img.asset) return null;
        return {
          src: urlFor(img.asset).width(1200).height(900).url(),
          alt: img.alt || "Breed image",
        };
      })
      .filter((img): img is BreedGalleryImage => img !== null) || [];

  if (!galleryImages.length && !facts?.length) {
    return null;
  }

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const heroImage = galleryImages[0];
  const gridImages = galleryImages.slice(1, 5);
  const moreCount = galleryImages.length > 5 ? galleryImages.length - 5 : 0;

  return (
    <Section id={id}>
      <Container>
        {/* Heading */}
        {heading && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            {subheading && (
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Hero Image — 50% on desktop, full width on mobile */}
              {heroImage && (
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
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Grid of up to 4 images — 50% on desktop, full width on mobile */}
              {galleryImages.length > 1 && (
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
                              <div className="text-center text-lg font-semibold text-white">
                                +{moreCount} more
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
          </div>
        )}

        {/* Facts Tiles */}
        {facts && facts.length > 0 && (
          <Grid>
            {facts.map((fact) => (
              <Col key={fact._key} span={12} md={6} lg={3}>
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                  {fact.label && (
                    <div className="mb-2 text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                      {fact.label}
                    </div>
                  )}
                  {fact.value && (
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {fact.value}
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Grid>
        )}

        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex !== null}
          index={lightboxIndex ?? 0}
          close={closeLightbox}
          slides={galleryImages.map((img) => ({ src: img.src, alt: img.alt }))}
        />
      </Container>
    </Section>
  );
}

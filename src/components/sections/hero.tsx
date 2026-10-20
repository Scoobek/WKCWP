import Image from "next/image";
import { type ComponentProps } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { HeroSection } from "@/sanity/lib/queries";

export function Hero({
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
  image,
  id,
}: HeroSection & { id?: string }) {
  // Only build a URL when an asset was actually uploaded. `fit("max")` keeps the
  // whole image (no crop) by scaling it to fit 1600px wide, so the frame follows
  // the image's own aspect ratio (see `h-auto` below).
  const imageUrl = image?.asset
    ? urlFor(image.asset).width(1600).fit("max").url()
    : null;

  return (
    <Section id={id} tone="muted">
      <Container>
        {/* Stacked on small screens (image on top via order), two columns from
            md up (text left, image right). */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <div className="order-2 md:order-1 md:flex-1">
            {heading && (
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {heading}
              </h1>
            )}
            {subheading && (
              <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
            )}
            {ctaLabel && ctaUrl && (
              <Link
                // ctaUrl is a canonical internal path from Sanity (e.g.
                // "/about"); next-intl localizes it for the current locale.
                // It's a free-form string, so cast to the typed href.
                href={ctaUrl as ComponentProps<typeof Link>["href"]}
                className="bg-primary text-primary-foreground mt-8 inline-block rounded-md px-5 py-2.5 text-sm font-medium"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
          {imageUrl && (
            <div className="relative order-1 md:order-2 md:flex-1">
              {/* Sizes the box to the image's own proportions. Hidden, because the
                  visible version is the masked layer below. */}
              <Image
                src={imageUrl}
                alt={image?.alt ?? ""}
                loading="eager"
                width={1600}
                height={900}
                className="h-auto w-full opacity-0"
              />
              {/* The PNG's alpha channel is used as a mask, filled with the accent
                  token. Works for single-color images with a transparent background. */}
              <div
                aria-hidden="true"
                className="bg-accent absolute inset-0"
                style={{
                  maskImage: `url("${imageUrl}")`,
                  WebkitMaskImage: `url("${imageUrl}")`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

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
}: HeroSection) {
  // Only build a URL when an asset was actually uploaded.
  const imageUrl = image?.asset
    ? urlFor(image.asset).width(1600).height(900).url()
    : null;

  return (
    <Section>
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
                className="bg-foreground text-background mt-8 inline-block rounded-md px-5 py-2.5 text-sm font-medium"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
          {imageUrl && (
            <div className="order-1 md:order-2 md:flex-1">
              <Image
                src={imageUrl}
                alt={image?.alt ?? ""}
                loading="eager"
                width={1600}
                height={900}
                className="h-auto w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

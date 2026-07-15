import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { urlFor } from "@/sanity/lib/image";
import type { HeroSection } from "@/sanity/lib/queries";

export function Hero({ heading, subheading, ctaLabel, image }: HeroSection) {
  // Only build a URL when an asset was actually uploaded.
  const imageUrl = image?.asset
    ? urlFor(image.asset).width(1600).height(900).url()
    : null;

  return (
    <Section>
      <Container>
        {heading && (
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            {subheading}
          </p>
        )}
        {ctaLabel && (
          <button className="bg-foreground text-background mt-8 rounded-md px-5 py-2.5 text-sm font-medium">
            {ctaLabel}
          </button>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={image?.alt ?? ""}
            width={1600}
            height={900}
            className="mt-10 h-auto w-full rounded-lg"
          />
        )}
      </Container>
    </Section>
  );
}

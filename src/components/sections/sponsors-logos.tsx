"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { urlFor } from "@/sanity/lib/image";
import type { SponsorItem } from "@/sanity/lib/queries";

const SponsorLogo = ({ sponsor }: { sponsor: SponsorItem }) => {
  const logoUrl = sponsor.logo?.asset
    ? urlFor(sponsor.logo.asset).width(360).height(180).url()
    : null;

  return (
    <a
      href={sponsor.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 transition-opacity hover:opacity-75"
    >
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={sponsor.name || "Sponsor"}
          width={360}
          height={180}
          className="h-40 w-auto md:h-32"
        />
      )}
    </a>
  );
};

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false
  );
}

export function SponsorsLogos({ sponsors }: { sponsors: SponsorItem[] }) {
  const isDesktop = useIsDesktop();

  if (!sponsors.length) return null;

  const useCarousel = isDesktop ? sponsors.length > 3 : sponsors.length >= 2;

  if (!useCarousel) {
    return (
      <div className="flex items-center gap-6">
        {sponsors.map((sponsor) => (
          <SponsorLogo key={sponsor._key} sponsor={sponsor} />
        ))}
      </div>
    );
  }

  return <EmblaCarouselWrapper sponsors={sponsors} />;
}

function EmblaCarouselWrapper({ sponsors }: { sponsors: SponsorItem[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {sponsors.map((sponsor) => (
          <SponsorLogo key={sponsor._key} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}

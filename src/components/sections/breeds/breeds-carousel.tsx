"use client";

import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useIsDesktop } from "@/lib/hooks";

interface BreedsCarouselProps {
  children: React.ReactNode[];
}

export function BreedsCarousel({ children }: BreedsCarouselProps) {
  const isDesktop = useIsDesktop();
  const itemCount = children.length;

  const useCarousel = isDesktop ? itemCount > 4 : itemCount > 1;

  if (!useCarousel) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    );
  }

  return <BreedsCarouselWithAutoplay>{children}</BreedsCarouselWithAutoplay>;
}

function BreedsCarouselWithAutoplay({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      dragFree: false,
      loop: true,
      breakpoints: {
        "(min-width: 1024px)": { active: false },
      },
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const dotCount = children.length;

  // Update dot indicator on scroll
  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", handleSelect);
    handleSelect(); // Initialize

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden lg:overflow-visible">
        {/* Track: flex on mobile, grid on desktop */}
        <div className="flex touch-pan-y gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
          {children.map((child, idx) => (
            <div
              key={idx}
              className="flex min-w-0 shrink-0 basis-[80%] sm:basis-[45%] lg:basis-auto"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots — hidden on desktop */}
      {dotCount > 1 && (
        <div
          className="mt-4 flex justify-center gap-2 lg:hidden"
          aria-hidden="true"
        >
          {Array.from({ length: dotCount }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full transition-opacity ${
                idx === currentIndex
                  ? "bg-gray-900 opacity-100 dark:bg-white"
                  : "bg-gray-300 opacity-50 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { getBreeds, type BreedsSection } from "@/sanity/lib/queries";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BreedCard } from "./breed-card";
import { BreedsCarousel } from "./breeds-carousel";

export async function Breeds({
  heading,
  subheading,
  id,
  locale,
}: BreedsSection & {
  id?: string;
  locale?: string;
}) {
  const breeds = await getBreeds(locale || "pl");

  return (
    <Section id={id}>
      <Container>
        {/* Header row */}
        <div className="mb-12">
          {heading && (
            <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
          )}
          {subheading && (
            <p className="text-muted-foreground mt-2 text-lg">{subheading}</p>
          )}
        </div>

        {/* Carousel on mobile/tablet, grid on desktop */}
        {breeds.length > 0 ? (
          <BreedsCarousel>
            {breeds.map((breed) => (
              <BreedCard key={breed._id} breed={breed} />
            ))}
          </BreedsCarousel>
        ) : (
          <div className="text-muted-foreground text-center">
            No breeds found.
          </div>
        )}
      </Container>
    </Section>
  );
}

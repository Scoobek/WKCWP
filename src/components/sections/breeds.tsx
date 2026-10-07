import { getBreeds, type BreedsSection } from "@/sanity/lib/queries";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { BreedCard } from "@/components/sections/breed-card";

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
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {subheading}
            </p>
          )}
        </div>

        {/* Grid of breed cards: max 4 per row */}
        {breeds.length > 0 ? (
          <Grid>
            {breeds.map((breed) => (
              <Col key={breed._id} span={12} md={6} lg={3}>
                <BreedCard breed={breed} />
              </Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No breeds found.
          </div>
        )}
      </Container>
    </Section>
  );
}

import { type ComponentProps } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { Link } from "@/i18n/navigation";
import { SponsorsLogos } from "@/components/sections/sponsors-logos";
import type { SponsorsSection } from "@/sanity/lib/queries";

export function Sponsors({
  heading,
  sponsors,
  ctaLabel,
  ctaUrl,
  id,
}: SponsorsSection & { id?: string }) {
  const hasSponsor = sponsors && sponsors.length > 0;
  const hasCta = ctaLabel && ctaUrl;

  return (
    <Section id={id}>
      <Container>
        <Grid>
          {heading && (
            <Col span={12} md={4}>
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            </Col>
          )}

          {hasSponsor && (
            <Col span={12} md={8}>
              <SponsorsLogos sponsors={sponsors} />
            </Col>
          )}

          {hasCta && (
            <Col span={12}>
              <div className="pt-6">
                <Link
                  href={ctaUrl as ComponentProps<typeof Link>["href"]}
                  className="bg-foreground text-background inline-block rounded-md px-5 py-2.5 text-sm font-medium"
                >
                  {ctaLabel}
                </Link>
              </div>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

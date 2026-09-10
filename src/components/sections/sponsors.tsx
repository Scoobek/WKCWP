import Image from "next/image";
import { type ComponentProps } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { SponsorsSection } from "@/sanity/lib/queries";

export function Sponsors({
  heading,
  sponsors,
  ctaLabel,
  ctaUrl,
}: SponsorsSection) {
  const hasSponsor = sponsors && sponsors.length > 0;
  const hasCta = ctaLabel && ctaUrl;

  return (
    <Section>
      <Container>
        <Grid>
          {heading && (
            <Col span={12} md={3}>
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            </Col>
          )}

          {hasSponsor && (
            <Col span={12} md={6}>
              <div className="flex flex-wrap items-center gap-6">
                {sponsors.map((sponsor) => {
                  const logoUrl = sponsor.logo?.asset
                    ? urlFor(sponsor.logo.asset).width(160).height(80).url()
                    : null;

                  return (
                    <a
                      key={sponsor._key}
                      href={sponsor.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block transition-opacity hover:opacity-75"
                    >
                      {logoUrl && (
                        <Image
                          src={logoUrl}
                          alt={sponsor.name || "Sponsor"}
                          width={160}
                          height={80}
                          style={{ width: "auto", height: "auto" }}
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </Col>
          )}

          {hasCta && (
            <Col span={12} md={3}>
              <Link
                href={ctaUrl as ComponentProps<typeof Link>["href"]}
                className="bg-foreground text-background inline-block rounded-md px-5 py-2.5 text-sm font-medium"
              >
                {ctaLabel}
              </Link>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

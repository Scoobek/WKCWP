import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import {
  platformColors,
  platformIcons,
} from "@/components/sections/social-icons";
import { getYoutubeSubscriberCount } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import type { SocialMediaSection, SocialLinkItem } from "@/sanity/lib/queries";

async function SocialLinkTile({
  link,
  locale,
}: {
  link: SocialLinkItem;
  locale: string;
}) {
  const platformLabel = link.platform
    ? link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
    : "Social Media";

  let displayLabel = link.followersLabel || "";

  if (link.platform === "youtube" && link.youtubeChannelId) {
    const subscriberCount = await getYoutubeSubscriberCount(
      link.youtubeChannelId
    );
    if (subscriberCount !== null) {
      const formatter = new Intl.NumberFormat(locale, {
        notation: "compact",
      });
      displayLabel = `${formatter.format(subscriberCount)} subscribers`;
    }
  }

  const Icon = platformIcons[link.platform || ""] || platformIcons.facebook;
  const iconColor = platformColors[link.platform || ""] ?? "text-foreground";

  return (
    <a
      href={link.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border flex flex-col justify-between rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className={cn("h-8 w-8 shrink-0", iconColor)} />
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate font-medium">
            {platformLabel}
          </p>
          <p className="text-muted-foreground truncate text-sm">
            {link.profileName}
          </p>
        </div>
      </div>
      {displayLabel && (
        <p className="text-muted-foreground text-sm">{displayLabel}</p>
      )}
    </a>
  );
}

export async function SocialMedia({
  heading,
  subheading,
  links,
  locale = "pl",
  id,
}: SocialMediaSection & { locale?: string; id?: string }) {
  const hasLinks = links && links.length > 0;

  return (
    <Section id={id} tone="default">
      <Container>
        <Grid>
          {heading && (
            <Col span={12} md={4}>
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
              {subheading && (
                <p className="text-primary-foreground/80 mt-4">{subheading}</p>
              )}
            </Col>
          )}

          {hasLinks && (
            <Col span={12} md={8}>
              <div
                className="gap-6"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                }}
              >
                {links.map((link) => (
                  <SocialLinkTile key={link._key} link={link} locale={locale} />
                ))}
              </div>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

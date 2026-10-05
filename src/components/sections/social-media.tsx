import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiX,
  SiLinkerd,
} from "react-icons/si";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { getYoutubeSubscriberCount } from "@/lib/youtube";
import type { SocialMediaSection, SocialLinkItem } from "@/sanity/lib/queries";

const platformIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  x: SiX,
  linkedin: SiLinkerd,
};

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

  return (
    <a
      href={link.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col justify-between rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-8 w-8 shrink-0 text-gray-700" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900">{platformLabel}</p>
          <p className="truncate text-sm text-gray-600">{link.profileName}</p>
        </div>
      </div>
      {displayLabel && <p className="text-sm text-gray-500">{displayLabel}</p>}
    </a>
  );
}

export async function SocialMedia({
  heading,
  subheading,
  links,
  locale = "pl",
}: SocialMediaSection & { locale?: string }) {
  const hasLinks = links && links.length > 0;

  return (
    <Section>
      <Container>
        <Grid>
          {heading && (
            <Col span={12} md={4}>
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
              {subheading && <p className="mt-4 text-gray-600">{subheading}</p>}
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

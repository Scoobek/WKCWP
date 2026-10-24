import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { platformIcons } from "@/components/sections/social-icons";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import type { ProfilePerson, ProfilesSection } from "@/sanity/lib/queries";

// Static lookup so Tailwind detects each span class. Mobile is always one card
// per row; `columns` sets how many cards share a row from md up.
const cardSpan: Record<1 | 2 | 3, 12 | 6 | 4> = { 1: 12, 2: 6, 3: 4 };

function ProfileCard({ person }: { person: ProfilePerson }) {
  const imageUrl = person.photo?.asset
    ? urlFor(person.photo.asset).width(600).height(600).url()
    : null;
  const socials = (person.socials ?? []).filter((s) => s.url);
  const hasContact = person.email || person.phone || socials.length > 0;

  return (
    <div className="grid grid-cols-2 items-start gap-4 md:gap-6">
      <div
        className={cn(
          "bg-muted relative aspect-square overflow-hidden",
          person.photoShape === "square" ? "rounded-md" : "rounded-full"
        )}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={person.photo?.alt || person.name || ""}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="space-y-3">
        {person.name && (
          <h3 className="text-xl font-semibold">{person.name}</h3>
        )}
        {person.bio && (
          <p className="text-foreground/70 text-sm whitespace-pre-line">
            {person.bio}
          </p>
        )}
        {hasContact && (
          <ul className="text-foreground/70 space-y-2 text-sm">
            {person.email && (
              <li>
                <a
                  href={`mailto:${person.email}`}
                  className="hover:text-foreground break-all"
                >
                  {person.email}
                </a>
              </li>
            )}
            {person.phone && (
              <li>
                <a
                  href={`tel:${person.phone}`}
                  className="hover:text-foreground"
                >
                  {person.phone}
                </a>
              </li>
            )}
            {socials.length > 0 && (
              <li className="flex items-center gap-3 pt-1">
                {socials.map((social) => {
                  const Icon =
                    platformIcons[social.platform || ""] ||
                    platformIcons.facebook;
                  return (
                    <a
                      key={social._key}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform || "Social media"}
                      className="hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Profiles({
  heading,
  description,
  columns,
  people,
  id,
}: ProfilesSection & { id?: string }) {
  const perRow = columns ?? 2;
  const hasPeople = people && people.length > 0;

  return (
    <Section id={id} tone="default">
      <Container>
        <Grid>
          {heading && (
            <Col span={12}>
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            </Col>
          )}
          {description && (
            <Col span={12}>
              <p className="text-foreground/70 mt-2 max-w-3xl">{description}</p>
            </Col>
          )}

          {hasPeople && (
            <Col span={12} className="pt-6">
              <Grid className="gap-y-12">
                {people.map((person) => (
                  <Col key={person._key} span={12} md={cardSpan[perRow]}>
                    <ProfileCard person={person} />
                  </Col>
                ))}
              </Grid>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

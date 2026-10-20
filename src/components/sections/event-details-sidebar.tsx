import { type ComponentProps } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";
import type { NewsCategory } from "@/sanity/lib/news-categories";

type EventDetailsSidebarProps = {
  eventType: NewsCategory | null;
  date: string | null;
  hours: string | null;
  location: string | null | undefined;
  buttonLabel: string | null;
  buttonUrl: string | null;
  buttonBlank: boolean | null;
  organizer: string | null;
  organizerUrl: string | null;
};

export async function EventDetailsSidebar({
  eventType,
  date,
  hours,
  location,
  buttonLabel,
  buttonUrl,
  buttonBlank,
  organizer,
  organizerUrl,
}: EventDetailsSidebarProps) {
  const t = await getTranslations("posts.eventDetails");

  const eventTypeTitle = eventType
    ? NEWS_CATEGORIES.find((cat) => cat.id === eventType)?.title
    : null;

  return (
    <div className="border-border bg-muted/30 rounded-lg border p-6">
      <h3 className="mb-4 text-lg font-semibold">{t("details")}</h3>

      {/* Details grid: label on left, value on right */}
      <div className="mb-6 space-y-3">
        {eventTypeTitle && (
          <div className="border-border flex items-center justify-between border-b pb-2">
            <dt className="text-muted-foreground text-xs font-medium uppercase">
              {t("eventType")}
            </dt>
            <dd>{eventTypeTitle}</dd>
          </div>
        )}

        {date && (
          <div className="border-border flex items-center justify-between border-b pb-2">
            <dt className="text-muted-foreground text-xs font-medium uppercase">
              {t("dateTime")}
            </dt>
            <dd>
              {new Date(date).toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </dd>
          </div>
        )}

        {hours && (
          <div className="border-border flex items-center justify-between border-b pb-2">
            <dt className="text-muted-foreground text-xs font-medium uppercase">
              {t("hours")}
            </dt>
            <dd>{hours}</dd>
          </div>
        )}

        {location && (
          <div className="border-border flex items-center justify-between border-b pb-2">
            <dt className="text-muted-foreground text-xs font-medium uppercase">
              {t("town")}
            </dt>
            <dd>{location}</dd>
          </div>
        )}
      </div>

      {buttonLabel && buttonUrl && (
        <div className="mb-4">
          {buttonUrl.startsWith("http") ? (
            <a
              href={buttonUrl}
              className="bg-primary text-primary-foreground inline-block rounded-md px-5 py-2.5 text-sm font-medium"
              {...(buttonBlank
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {buttonLabel}
            </a>
          ) : (
            <Link
              href={buttonUrl as ComponentProps<typeof Link>["href"]}
              className="bg-primary text-primary-foreground inline-block rounded-md px-5 py-2.5 text-sm font-medium"
              {...(buttonBlank
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {buttonLabel}
            </Link>
          )}
        </div>
      )}

      {organizer && (
        <div className="border-border border-t pt-4">
          <dt className="text-muted-foreground text-xs font-medium uppercase">
            {t("organizer")}
          </dt>
          <dd className="mt-1">
            {organizerUrl ? (
              <Link
                href={organizerUrl as ComponentProps<typeof Link>["href"]}
                className="text-foreground hover:underline"
              >
                {organizer}
              </Link>
            ) : (
              organizer
            )}
          </dd>
        </div>
      )}
    </div>
  );
}

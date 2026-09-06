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
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">{t("details")}</h3>

      {/* Details grid: label on left, value on right */}
      <div className="mb-6 space-y-3">
        {eventTypeTitle && (
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
            <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
              {t("eventType")}
            </dt>
            <dd>{eventTypeTitle}</dd>
          </div>
        )}

        {date && (
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
            <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
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
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
            <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
              {t("hours")}
            </dt>
            <dd>{hours}</dd>
          </div>
        )}

        {location && (
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
            <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
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
              className="inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
              {...(buttonBlank
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {buttonLabel}
            </a>
          ) : (
            <Link
              href={buttonUrl as ComponentProps<typeof Link>["href"]}
              className="inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
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
        <div className="border-t border-gray-300 pt-4 dark:border-gray-700">
          <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
            {t("organizer")}
          </dt>
          <dd className="mt-1">
            {organizerUrl ? (
              <Link
                href={organizerUrl as ComponentProps<typeof Link>["href"]}
                className="text-blue-600 hover:underline dark:text-blue-400"
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

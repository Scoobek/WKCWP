import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/rich-text";
import { Grid, Col } from "@/components/layout/grid";
import { EventDetailsSidebar } from "@/components/sections/event-details-sidebar";
import type { EventDetailsBlock, NewsCategory } from "@/sanity/lib/queries";

export async function EventDetailsBlockView(
  props: EventDetailsBlock & {
    location?: string | null;
    eventType?: NewsCategory | null;
  }
) {
  const t = await getTranslations("posts.eventDetails");
  const {
    title,
    description,
    scheduleRows,
    scheduleTitle,
    date,
    hours,
    location,
    eventType,
    buttonLabel,
    buttonUrl,
    buttonBlank,
    organizer,
    organizerUrl,
  } = props;

  return (
    <Grid className="gap-8">
      {/* Left column: title, description, schedule */}
      <Col span={12} lg={8}>
        {title && <h2 className="text-2xl font-semibold">{title}</h2>}

        {description && (
          <div className="mt-6 leading-7">
            <RichText value={description} />
          </div>
        )}

        {scheduleRows && scheduleRows.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">
              {scheduleTitle || t("schedule")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <tbody>
                  {scheduleRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-300 even:bg-gray-50 dark:border-gray-700 dark:even:bg-gray-900"
                    >
                      <td className="w-1/5 border-r border-gray-300 px-4 py-3 font-medium dark:border-gray-700">
                        {row.time}
                      </td>
                      <td className="w-4/5 px-4 py-3">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Col>

      {/* Right column: details sidebar */}
      <Col span={12} lg={4}>
        <EventDetailsSidebar
          eventType={eventType}
          date={date}
          hours={hours}
          location={location}
          buttonLabel={buttonLabel}
          buttonUrl={buttonUrl}
          buttonBlank={buttonBlank}
          organizer={organizer}
          organizerUrl={organizerUrl}
        />
      </Col>
    </Grid>
  );
}

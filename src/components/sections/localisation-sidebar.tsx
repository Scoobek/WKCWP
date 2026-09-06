import { getTranslations } from "next-intl/server";
import { CopyGpsButton } from "@/components/sections/copy-gps-button";

type LocalisationSidebarProps = {
  townName: string | null;
  street: string | null;
  buildingNumber: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

function formatCoordinate(value: number, isLat: boolean): string {
  const direction = isLat ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  const absValue = Math.abs(value).toFixed(4);
  return `${absValue}° ${direction}`;
}

export async function LocalisationSidebar({
  townName,
  street,
  buildingNumber,
  postalCode,
  lat,
  lng,
}: LocalisationSidebarProps) {
  const t = await getTranslations("posts.localisation");

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
      {townName && (
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          📍 {townName}
        </h3>
      )}

      <div className="mb-6 space-y-3">
        <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
          <div className="space-y-2">
            <div>
              <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
                {t("street")}
              </dt>
              <dd className="mt-1 text-sm">{street || "—"}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
                {t("buildingNumber")}
              </dt>
              <dd className="mt-1 text-sm">{buildingNumber || "—"}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
                {t("postalCode")}
              </dt>
              <dd className="mt-1 text-sm">{postalCode || "—"}</dd>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-b border-gray-200 pb-2 dark:border-gray-700">
          <dt className="text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
            {t("geolocation")}
          </dt>
          <dd className="font-mono text-sm">
            <div>Lat: {formatCoordinate(lat, true)}</div>
            <div>Lon: {formatCoordinate(lng, false)}</div>
          </dd>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={`geo:${lat},${lng}`}
          className="flex-1 rounded-md bg-black px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          {t("navigate")}
        </a>
        <div className="flex-1">
          <CopyGpsButton lat={lat} lng={lng} />
        </div>
      </div>
    </div>
  );
}

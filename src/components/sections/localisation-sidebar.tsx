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
    <div className="border-border bg-muted/30 rounded-lg border p-6">
      {townName && (
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          📍 {townName}
        </h3>
      )}

      <div className="mb-6 space-y-3">
        <div className="border-border border-b pb-3">
          <div className="space-y-2">
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase">
                {t("street")}
              </dt>
              <dd className="mt-1 text-sm">{street || "—"}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase">
                {t("buildingNumber")}
              </dt>
              <dd className="mt-1 text-sm">{buildingNumber || "—"}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase">
                {t("postalCode")}
              </dt>
              <dd className="mt-1 text-sm">{postalCode || "—"}</dd>
            </div>
          </div>
        </div>

        <div className="border-border space-y-2 border-b pb-2">
          <dt className="text-muted-foreground text-xs font-medium uppercase">
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
          className="bg-primary text-primary-foreground flex-1 rounded-md px-5 py-2.5 text-center text-sm font-medium"
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

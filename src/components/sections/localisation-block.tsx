import { getTranslations } from "next-intl/server";
import { BlockHeading } from "@/components/sections/block-heading";
import { LocalisationMapLoader } from "@/components/sections/localisation-map-loader";
import { LocalisationSidebar } from "@/components/sections/localisation-sidebar";
import type { LocalisationBlock } from "@/sanity/lib/queries";

export async function LocalisationBlockView(
  props: LocalisationBlock & { townName?: string | null }
) {
  const t = await getTranslations("posts.localisation");
  const { title, street, buildingNumber, postalCode, location, townName } =
    props;

  if (!location) return null;

  return (
    <div>
      {title && <BlockHeading title={title} subtitle={t("subtitle")} />}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <LocalisationMapLoader
            lat={location.lat}
            lng={location.lng}
            townName={townName}
          />
        </div>

        <div className="w-full lg:w-[30%]">
          <LocalisationSidebar
            townName={townName}
            street={street}
            buildingNumber={buildingNumber}
            postalCode={postalCode}
            lat={location.lat}
            lng={location.lng}
          />
        </div>
      </div>
    </div>
  );
}

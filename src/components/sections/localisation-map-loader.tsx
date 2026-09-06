"use client";

import dynamic from "next/dynamic";

const LocalisationMap = dynamic(
  () => import("./localisation-map").then((mod) => mod.LocalisationMap),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-200 dark:bg-gray-800" />,
  }
);

type LocalisationMapLoaderProps = {
  lat: number;
  lng: number;
  townName: string | null;
};

export function LocalisationMapLoader({
  lat,
  lng,
  townName,
}: LocalisationMapLoaderProps) {
  return <LocalisationMap lat={lat} lng={lng} townName={townName} />;
}

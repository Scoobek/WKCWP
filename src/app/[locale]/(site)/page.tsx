import { setRequestLocale } from "next-intl/server";

import { PageSections } from "@/components/sections/page-sections";
import { getHomePage } from "@/sanity/lib/queries";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const home = await getHomePage(locale);

  return <PageSections sections={home?.sections ?? null} />;
}

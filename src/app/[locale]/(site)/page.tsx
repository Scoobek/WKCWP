import { setRequestLocale } from "next-intl/server";

import { PageSections } from "@/components/sections/page-sections";
import { getHomePage } from "@/sanity/lib/queries";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category = "all" } = await searchParams;
  setRequestLocale(locale);
  const home = await getHomePage(locale);

  return (
    <PageSections
      sections={home?.sections ?? null}
      locale={locale}
      category={category}
    />
  );
}

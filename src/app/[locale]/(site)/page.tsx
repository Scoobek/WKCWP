import { setRequestLocale } from "next-intl/server";

import { PageSections } from "@/components/sections/page-sections";
import { getHomePage } from "@/sanity/lib/queries";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category = "all", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  setRequestLocale(locale);
  const home = await getHomePage(locale);

  return (
    <PageSections
      sections={home?.sections ?? null}
      locale={locale}
      category={category}
      page={page}
    />
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SetLocaleAlternates } from "@/components/layout/locale-alternates";
import { PageSections } from "@/components/sections/page-sections";
import { buildLocaleAlternates } from "@/lib/locale-alternates";
import { getPage } from "@/sanity/lib/queries";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPage(locale, slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function DynamicPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await getPage(locale, slug);

  if (!page) {
    notFound();
  }

  // Point the language switcher at each locale's own slug. Locales without a
  // translation fall back to the home page.
  const alternates = buildLocaleAlternates({
    locale,
    path: `/${slug}`,
    translations: page.translations,
    toPath: (s) => `/${s}`,
    fallback: "/",
  });

  return (
    <>
      <SetLocaleAlternates alternates={alternates} />
      <PageSections sections={page.sections} />
    </>
  );
}

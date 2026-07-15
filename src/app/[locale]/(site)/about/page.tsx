import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageSections } from "@/components/sections/page-sections";
import { getAboutPage } from "@/sanity/lib/queries";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const about = await getAboutPage(locale);

  if (!about) {
    notFound();
  }

  return <PageSections sections={about.sections} />;
}

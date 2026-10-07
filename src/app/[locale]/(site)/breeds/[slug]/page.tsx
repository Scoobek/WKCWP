import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { SetLocaleAlternates } from "@/components/layout/locale-alternates";
import { Section } from "@/components/layout/section";
import { PageSections } from "@/components/sections/page-sections";
import { buildLocaleAlternates } from "@/lib/locale-alternates";
import { getBreed } from "@/sanity/lib/queries";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const breed = await getBreed(locale, slug);
  if (!breed) return {};
  return {
    title: breed.name,
    description: breed.subtitle ?? undefined,
  };
}

export default async function BreedPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const breed = await getBreed(locale, slug);

  if (!breed) {
    notFound();
  }

  // Point the language switcher at each locale's own slug. Locales without a
  // translation link to the same path, which will 404 under that locale.
  const alternates = buildLocaleAlternates({
    locale,
    path: `/breeds/${slug}`,
    translations: breed.translations,
    toPath: (s) => `/breeds/${s}`,
  });

  return (
    <Section>
      <SetLocaleAlternates alternates={alternates} />
      <Container>
        <Breadcrumb
          items={[
            {
              label: tNav("breeds"),
              href: { pathname: "/", hash: "breeds" },
            },
            { label: breed.name },
          ]}
        />

        {/* Breed title */}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {breed.name}
        </h1>

        {/* Subtitle */}
        {breed.subtitle && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {breed.subtitle}
          </p>
        )}

        {/* Sections (gallery/facts + article) */}
        <div className="mt-8 space-y-10">
          <PageSections sections={breed.sections} locale={locale} />
        </div>
      </Container>
    </Section>
  );
}

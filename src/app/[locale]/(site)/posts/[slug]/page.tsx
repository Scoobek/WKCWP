import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { Grid, Col } from "@/components/layout/grid";
import { SetLocaleAlternates } from "@/components/layout/locale-alternates";
import { Section } from "@/components/layout/section";
import { RichText } from "@/components/rich-text";
import { buildLocaleAlternates } from "@/lib/locale-alternates";
import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";
import { urlFor } from "@/sanity/lib/image";
import { getPost } from "@/sanity/lib/queries";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const post = await getPost(locale, slug);

  if (!post) {
    notFound();
  }

  // Point the language switcher at each locale's own slug so switching language
  // on this post doesn't 404. Locales without a translation fall back to the
  // posts list.
  const alternates = buildLocaleAlternates({
    locale,
    path: `/posts/${slug}`,
    translations: post.translations,
    toPath: (s) => `/posts/${s}`,
    fallback: "/posts",
  });

  const displayDate = post.eventDate ?? post.publishedAt;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString(
        locale === "pl" ? "pl-PL" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      )
    : null;

  const categoryTitle = post.category
    ? NEWS_CATEGORIES.find((cat) => cat.id === post.category)?.title
    : null;

  return (
    <Section>
      <SetLocaleAlternates alternates={alternates} />
      <Container>
        <Breadcrumb
          items={[
            { label: tNav("posts"), href: { pathname: "/", hash: "news" } },
            { label: post.title },
          ]}
        />

        {/* Category badge + date row */}
        <div className="mt-4 flex items-center justify-start gap-4">
          {categoryTitle && (
            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {categoryTitle}
            </span>
          )}
          {formattedDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage?.asset && (
          <div className="relative mt-6 aspect-16/9 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
            <Image
              src={urlFor(post.coverImage.asset).width(1600).height(900).url()}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Text content: title, category badge, date, location, body */}
        <div className="mx-auto mt-6 max-w-2xl">
          <article>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            {/* Location */}
            {post.location && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{post.location}</span>
              </div>
            )}

            {/* Body */}
            {post.body && (
              <div className="mt-8 space-y-4 leading-7">
                <RichText value={post.body} />
              </div>
            )}
          </article>
        </div>

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <div className="mt-10">
            <Grid>
              {post.gallery.map((img, i) =>
                img.asset ? (
                  <Col key={i} span={12} md={6} lg={4}>
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={urlFor(img.asset).width(800).height(600).url()}
                        alt={img.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Col>
                ) : null
              )}
            </Grid>
          </div>
        )}
      </Container>
    </Section>
  );
}

import { headers } from "next/headers";

import { getNewsPostsPage, type NewsSection } from "@/sanity/lib/queries";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { NewsCategoryChips } from "@/components/sections/news-category-chips";
import { NewsResults } from "@/components/sections/news-results";
import { isMobileUserAgent } from "@/lib/device";

const DESKTOP_PAGE_SIZE = 1;
const MOBILE_PAGE_SIZE = 1;

export async function News({
  heading,
  subheading,
  locale,
  category = "all",
  page = 1,
}: NewsSection & { locale: string; category: string; page?: number }) {
  const userAgent = (await headers()).get("user-agent");
  const pageSize = isMobileUserAgent(userAgent)
    ? MOBILE_PAGE_SIZE
    : DESKTOP_PAGE_SIZE;

  const { items: posts, total } = await getNewsPostsPage(
    locale,
    (category as "all" | string) === "all"
      ? "all"
      : (category as Parameters<typeof getNewsPostsPage>[1]),
    page,
    pageSize
  );

  return (
    <Section id="news">
      <Container>
        {/* Header row: heading/subheading left, chips right */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex-1">
            {heading && (
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            )}
            {subheading && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {subheading}
              </p>
            )}
          </div>

          {/* Category filter chips */}
          <NewsCategoryChips category={category} />
        </div>

        {/* Grid of news cards with client-side pagination */}
        {posts.length > 0 ? (
          <NewsResults
            initialPosts={posts}
            initialTotal={total}
            page={page}
            pageSize={pageSize}
            category={category}
            locale={locale}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No posts found in this category.
          </div>
        )}
      </Container>
    </Section>
  );
}

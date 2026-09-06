import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";
import { getNewsPosts, type NewsSection } from "@/sanity/lib/queries";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import { Link } from "@/i18n/navigation";
import { NewsCard } from "@/components/sections/news-card";
import { cn } from "@/lib/utils";

export async function News({
  heading,
  subheading,
  locale,
  category = "all",
}: NewsSection & { locale: string; category: string }) {
  const posts = await getNewsPosts(
    locale,
    (category as "all" | string) === "all"
      ? "all"
      : (category as Parameters<typeof getNewsPosts>[1]),
    9
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
          <div className="flex flex-wrap gap-2">
            {/* All chip */}
            <Link
              href={{ pathname: "/" }}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                category === "all"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              All
            </Link>

            {/* Category chips */}
            {NEWS_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={{ pathname: "/", query: { category: cat.id } }}
                className={cn(
                  "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                  category === cat.id
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid of news cards */}
        {posts.length > 0 ? (
          <Grid>
            {posts.map((post) => (
              <Col key={post._id} span={12} md={6} lg={4}>
                <NewsCard post={post} locale={locale} />
              </Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No posts found in this category.
          </div>
        )}
      </Container>
    </Section>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Col, Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Link } from "@/i18n/navigation";
import { getPosts } from "@/sanity/lib/queries";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("posts");
  const posts = await getPosts(locale);

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-6">{t("empty")}</p>
        ) : (
          <Grid className="mt-10">
            {posts.map((post) => (
              <Col key={post._id} span={12} md={6} lg={4}>
                <article className="border-border flex h-full flex-col rounded-lg border p-6">
                  <h2 className="text-lg font-medium">
                    <Link
                      href={{
                        pathname: "/posts/[slug]",
                        params: { slug: post.slug },
                      }}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={{
                      pathname: "/posts/[slug]",
                      params: { slug: post.slug },
                    }}
                    className="text-primary mt-4 inline-block text-sm font-medium"
                  >
                    {t("readMore")}
                  </Link>
                </article>
              </Col>
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}

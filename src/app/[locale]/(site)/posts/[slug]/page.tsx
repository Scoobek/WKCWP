import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { SetLocaleAlternates } from "@/components/layout/locale-alternates";
import { Section } from "@/components/layout/section";
import { Link } from "@/i18n/navigation";
import { buildLocaleAlternates } from "@/lib/locale-alternates";
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
  const t = await getTranslations("posts");
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

  return (
    <Section>
      <SetLocaleAlternates alternates={alternates} />
      <Container>
        <Link
          href="/posts"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← {t("backToList")}
        </Link>

        <article className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.publishedAt && (
            <p className="text-muted-foreground mt-2 text-sm">
              {new Date(post.publishedAt).toLocaleDateString(locale)}
            </p>
          )}
          {post.body && (
            <div className="mt-8 space-y-4 leading-7">
              <PortableText value={post.body} />
            </div>
          )}
        </article>
      </Container>
    </Section>
  );
}

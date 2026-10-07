import type { PortableTextComponents } from "@portabletext/react";

import { Container } from "@/components/layout/container";
import { Grid, Col } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { RichText } from "@/components/rich-text";
import { ArticleAuthor } from "@/components/sections/article-author";
import { ArticleToc } from "@/components/sections/article-toc";
import { getHeadings } from "@/lib/article-headings";
import { cn } from "@/lib/utils";
import type { ArticleSection as ArticleSectionType } from "@/sanity/lib/queries";

interface ArticleProps extends ArticleSectionType {
  id?: string;
}

export function Article({ id, title, body, author }: ArticleProps) {
  const { headings, keyToId } = getHeadings(body);

  const headingComponents: PortableTextComponents = {
    block: {
      h2: ({
        children,
        value,
      }: {
        children?: React.ReactNode;
        value: { _key?: string };
      }) => {
        const headingId = value._key ? keyToId[value._key] : "";
        return (
          <h2
            id={headingId}
            className={cn(
              "text-foreground mt-8 mb-4 scroll-mt-24 text-2xl font-bold"
            )}
          >
            {children}
          </h2>
        );
      },
      h3: ({
        children,
        value,
      }: {
        children?: React.ReactNode;
        value: { _key?: string };
      }) => {
        const headingId = value._key ? keyToId[value._key] : "";
        return (
          <h3
            id={headingId}
            className={cn(
              "text-foreground mt-6 mb-3 scroll-mt-24 text-xl font-semibold"
            )}
          >
            {children}
          </h3>
        );
      },
    },
  };

  return (
    <Section id={id}>
      <Container>
        {title && (
          <h1 className="text-foreground mb-8 text-3xl font-bold lg:mb-12">
            {title}
          </h1>
        )}

        <Grid>
          {/* TOC column - order first on mobile, last on desktop */}
          <Col span={12} lg={4} className="order-first lg:order-last">
            <div className="self-start lg:sticky lg:top-24">
              <ArticleToc headings={headings} />
            </div>
          </Col>

          {/* Content column */}
          <Col span={12} lg={8}>
            <div className="text-muted-foreground prose prose-sm max-w-none leading-7">
              <RichText value={body || []} components={headingComponents} />
            </div>
            <ArticleAuthor author={author} />
          </Col>
        </Grid>
      </Container>
    </Section>
  );
}

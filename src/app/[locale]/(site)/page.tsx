import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Col, Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {t("intro")}
          </p>
        </div>

        <Grid className="mt-10">
          <Col span={12} md={6} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 6 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Responsive column spans via the shared Grid primitives.
              </p>
            </div>
          </Col>
          <Col span={12} md={6} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 6 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Resize the window to see the breakpoints.
              </p>
            </div>
          </Col>
          <Col span={12} md={12} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 12 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Full width until lg, then a third.
              </p>
            </div>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
}

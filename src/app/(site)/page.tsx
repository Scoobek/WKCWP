import { Container } from "@/components/layout/container";
import { Col, Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";

export default function Home() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            WKCwP
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Layout & grid system starter. This page uses the shared{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              Section
            </code>{" "}
            /{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              Container
            </code>{" "}
            /{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">Grid</code>{" "}
            primitives.
          </p>
        </div>

        <Grid className="mt-10">
          <Col span={12} md={6} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 6 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Full width, then half at md, then a third at lg.
              </p>
            </div>
          </Col>
          <Col span={12} md={6} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 6 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Resize the window to see the responsive spans.
              </p>
            </div>
          </Col>
          <Col span={12} md={12} lg={4}>
            <div className="border-border bg-secondary text-secondary-foreground rounded-lg border p-6">
              <h2 className="font-medium">12 / 12 / 4</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Stays full width until lg, then a third.
              </p>
            </div>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
}

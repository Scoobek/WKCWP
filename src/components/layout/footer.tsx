import { Container } from "@/components/layout/container";

/** Site footer shell. */
export function Footer() {
  return (
    <footer className="border-border border-t">
      <Container>
        <div className="text-muted-foreground py-8 text-sm">
          © {new Date().getFullYear()} WKCwP. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

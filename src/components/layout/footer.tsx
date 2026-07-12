import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";

/** Site footer shell. */
export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-border border-t">
      <Container>
        <div className="text-muted-foreground py-8 text-sm">
          © {new Date().getFullYear()} WKCwP. {t("rights")}
        </div>
      </Container>
    </footer>
  );
}

import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import type { ContactSection } from "@/sanity/lib/queries";

export async function Contact(props: ContactSection & { id?: string }) {
  const t = await getTranslations("sections.contact");
  const {
    heading,
    subheading,
    street,
    buildingNumber,
    postalCode,
    town,
    email,
    phone,
    id,
  } = props;

  const hasAddress = street || buildingNumber || postalCode || town;
  const hasContact = email || phone;

  return (
    <Section id={id}>
      <Container>
        <Grid>
          <Col span={12} md={4}>
            {heading && (
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            )}
            {subheading && (
              <p className="text-muted-foreground mt-2">{subheading}</p>
            )}
          </Col>

          {hasAddress && (
            <Col span={12} md={4}>
              <p className="text-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                {t("address")}
              </p>
              <address className="text-muted-foreground space-y-2 text-sm not-italic">
                {(street || buildingNumber) && (
                  <div>
                    {street}
                    {street && buildingNumber && " "}
                    {buildingNumber}
                  </div>
                )}
                {(town || postalCode) && (
                  <div>
                    {postalCode}
                    {postalCode && town && " "}
                    {town}
                  </div>
                )}
              </address>
            </Col>
          )}

          {hasContact && (
            <Col span={12} md={4}>
              <p className="text-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                {t("contact")}
              </p>
              <div className="space-y-3 text-sm">
                {email && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

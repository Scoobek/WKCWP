import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, Col } from "@/components/layout/grid";
import type { ContactSection } from "@/sanity/lib/queries";

export async function Contact(props: ContactSection) {
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
  } = props;

  const hasAddress = street || buildingNumber || postalCode || town;
  const hasContact = email || phone;

  return (
    <Section>
      <Container>
        <Grid>
          <Col span={12} md={4}>
            {heading && (
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            )}
            {subheading && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {subheading}
              </p>
            )}
          </Col>

          {hasAddress && (
            <Col span={12} md={4}>
              <p className="mb-4 text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
                {t("address")}
              </p>
              <address className="space-y-2 text-sm text-gray-600 not-italic dark:text-gray-400">
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
              <p className="mb-4 text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
                {t("contact")}
              </p>
              <div className="space-y-3 text-sm">
                {email && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
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

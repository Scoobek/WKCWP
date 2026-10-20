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
    registrationName,
    nip,
    regon,
    krs,
    oppStatus,
    bankAccount,
    bankName,
    id,
  } = props;

  const hasAddress = street || buildingNumber || postalCode || town;
  const hasContact = email || phone;

  // Only the registration fields that are filled in get a row. The bank name is
  // a small note under the account number, not a row of its own.
  const registrationRows: {
    label: string;
    value: string | null;
    note?: string | null;
  }[] = [
    { label: t("organisation"), value: registrationName },
    { label: t("nip"), value: nip },
    { label: t("regon"), value: regon },
    { label: t("krs"), value: krs },
    { label: t("opp"), value: oppStatus },
    { label: t("bankAccount"), value: bankAccount, note: bankName },
  ].filter((row) => row.value);
  const hasRegistration = registrationRows.length > 0;

  return (
    <Section id={id} tone="ink">
      <Container>
        <Grid>
          <Col span={12} md={3}>
            {heading && (
              <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
            )}
            {subheading && (
              <p className="text-secondary-foreground/70 mt-2">{subheading}</p>
            )}
          </Col>

          {hasAddress && (
            <Col span={12} md={3}>
              <p className="text-secondary-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                {t("address")}
              </p>
              <address className="text-secondary-foreground/70 space-y-2 text-sm not-italic">
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
            <Col span={12} md={3}>
              <p className="text-secondary-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                {t("contact")}
              </p>
              <div className="space-y-3 text-sm">
                {email && (
                  <div>
                    <p className="text-secondary-foreground/70 mb-1 text-xs font-medium">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div>
                    <p className="text-secondary-foreground/70 mb-1 text-xs font-medium">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            </Col>
          )}

          {hasRegistration && (
            <Col span={12} md={3}>
              <p className="text-secondary-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                {t("registration")}
              </p>
              <dl className="space-y-3 text-sm">
                {registrationRows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-secondary-foreground/70 mb-1 text-xs font-medium">
                      {row.label}
                    </dt>
                    <dd className="text-secondary-foreground">{row.value}</dd>
                    {row.note && (
                      <dd className="text-secondary-foreground/70 text-xs">
                        {row.note}
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
}

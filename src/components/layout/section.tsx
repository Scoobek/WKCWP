import { cn } from "@/lib/utils";

/**
 * All valid section tones. Use this for option lists (e.g. CMS fields) and
 * validation; the type below is derived from it.
 */
export const SECTION_TONES = ["default", "muted", "pink", "ink"] as const;

export type SectionTone = (typeof SECTION_TONES)[number];

/**
 * Background bands drawn from the brand palette. Static class strings so
 * Tailwind can detect them.
 */
const toneClasses: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  pink: "bg-primary text-primary-foreground",
  ink: "bg-secondary text-secondary-foreground",
};

/**
 * A page section with standardized vertical rhythm. Use one <Section> per
 * distinct band of content; wrap inner content in <Container>.
 */
export function Section({
  className,
  id,
  tone = "default",
  children,
}: {
  className?: string;
  id?: string;
  tone?: SectionTone;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 py-12 sm:py-16 lg:py-24",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </section>
  );
}

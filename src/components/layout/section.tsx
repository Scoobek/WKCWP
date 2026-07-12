import { cn } from "@/lib/utils";

/**
 * A page section with standardized vertical rhythm. Use one <Section> per
 * distinct band of content; wrap inner content in <Container>.
 */
export function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-24", className)}>
      {children}
    </section>
  );
}

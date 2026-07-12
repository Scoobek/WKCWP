import { cn } from "@/lib/utils";

/** 12-column responsive grid with a standardized gap. */
export function Grid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-12 gap-6", className)}>{children}</div>
  );
}

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Static maps of literal class names so Tailwind's scanner detects every
// utility. Dynamic `col-span-${n}` strings would NOT be generated.
const baseSpan: Record<Span, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const mdSpan: Record<Span, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

const lgSpan: Record<Span, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

/**
 * A column inside <Grid>. `span` sets the base column count (default full-width
 * 12); `md`/`lg` set responsive spans at those breakpoints.
 */
export function Col({
  span = 12,
  md,
  lg,
  className,
  children,
}: {
  span?: Span;
  md?: Span;
  lg?: Span;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        baseSpan[span],
        md && mdSpan[md],
        lg && lgSpan[lg],
        className
      )}
    >
      {children}
    </div>
  );
}

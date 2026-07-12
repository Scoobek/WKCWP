import { cn } from "@/lib/utils";

/**
 * Centered page container. The single knob for page width (max-w-7xl = 1280px)
 * and the standard responsive horizontal padding.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

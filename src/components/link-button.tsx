import { AppLink } from "@/components/app-link";
import type { ResolvedLink } from "@/lib/resolve-link";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  outline:
    "border-primary text-primary hover:bg-primary hover:text-primary-foreground border",
};

/** A call-to-action styled link, used by the link block in posts. */
export function LinkButton({
  label,
  variant,
  target,
  className,
}: {
  label: string;
  variant: "primary" | "outline" | null;
  target: ResolvedLink;
  className?: string;
}) {
  return (
    <AppLink
      link={target}
      className={cn(
        "inline-block rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
        variantClasses[variant ?? "primary"],
        className
      )}
    >
      {label}
    </AppLink>
  );
}

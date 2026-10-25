import { AppLink } from "@/components/app-link";
import type { ResolvedLink } from "@/lib/resolve-link";
import { cn } from "@/lib/utils";
import type { LinkBlockItem } from "@/sanity/lib/queries";

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

type ReadyLinkItem = LinkBlockItem & { label: string; target: ResolvedLink };

function isReady(item: LinkBlockItem): item is ReadyLinkItem {
  return Boolean(item.label && item.target);
}

/**
 * Buttons side by side (wrapping onto new rows when needed) or one after
 * another. Items missing a label or a target are skipped.
 */
export function LinkButtons({
  items,
  layout,
}: {
  items: LinkBlockItem[];
  layout: "inline" | "stacked" | null;
}) {
  const ready = items.filter(isReady);
  if (ready.length === 0) return null;

  return (
    <div
      className={cn(
        "my-8 flex gap-3",
        layout === "stacked" ? "flex-col items-start" : "flex-wrap"
      )}
    >
      {ready.map((item) => (
        <LinkButton
          key={item._key}
          label={item.label}
          variant={item.variant}
          target={item.target}
        />
      ))}
    </div>
  );
}

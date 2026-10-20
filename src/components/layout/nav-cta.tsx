import { NavLink } from "@/components/layout/nav-link";
import { cn } from "@/lib/utils";
import type { NavButton } from "@/components/layout/types";

/** Primary header button: the Studio navigation button, styled as a CTA. */
export function NavCta({
  button,
  className,
  onClick,
}: {
  button: NavButton;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      href={button.url}
      onClick={onClick}
      className={cn(
        "bg-primary text-primary-foreground inline-block rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90",
        className
      )}
    >
      {button.label}
    </NavLink>
  );
}

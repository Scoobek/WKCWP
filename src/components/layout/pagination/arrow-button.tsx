"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Href } from "./page-items";
import { squareButton } from "./shared";

export function ArrowButton({
  direction,
  page,
  disabled,
  createHref,
  onPageChange,
}: {
  direction: "prev" | "next";
  page: number;
  disabled: boolean;
  createHref?: (page: number) => Href;
  onPageChange?: (page: number) => void;
}) {
  const Icon = direction === "prev" ? HiChevronLeft : HiChevronRight;
  const label = direction === "prev" ? "Previous page" : "Next page";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className={cn(
          squareButton,
          "border-border text-muted-foreground/50 border"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  }

  const commonClass = cn(
    squareButton,
    "border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );

  if (onPageChange) {
    return (
      <button
        type="button"
        onClick={() => onPageChange(page)}
        aria-label={label}
        className={commonClass}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Link href={createHref!(page)} aria-label={label} className={commonClass}>
      <Icon className="h-4 w-4" />
    </Link>
  );
}

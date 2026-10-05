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
          "border border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  }

  const commonClass = cn(
    squareButton,
    "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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

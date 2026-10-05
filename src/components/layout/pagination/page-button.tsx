"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Href } from "./page-items";
import { squareButton } from "./shared";

export function PageButton({
  page,
  isActive,
  createHref,
  onPageChange,
}: {
  page: number;
  isActive: boolean;
  createHref?: (page: number) => Href;
  onPageChange?: (page: number) => void;
}) {
  const commonClass = cn(
    squareButton,
    "hidden sm:flex",
    isActive
      ? "bg-black text-white dark:bg-white dark:text-black"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
  );

  if (onPageChange) {
    return (
      <button
        type="button"
        onClick={() => onPageChange(page)}
        aria-current={isActive ? "page" : undefined}
        className={commonClass}
      >
        {page}
      </button>
    );
  }

  return (
    <Link
      href={createHref!(page)}
      aria-current={isActive ? "page" : undefined}
      className={commonClass}
    >
      {page}
    </Link>
  );
}

import { type ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

export type Href = ComponentProps<typeof Link>["href"];

export const ELLIPSIS = "ellipsis" as const;

export function getPageItems(
  currentPage: number,
  totalPages: number
): (number | typeof ELLIPSIS)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = new Set<number>([
    1,
    2,
    totalPages - 1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const sorted = [...items]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const withEllipsis: (number | typeof ELLIPSIS)[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) {
      withEllipsis.push(ELLIPSIS);
    }
    withEllipsis.push(page);
  });

  return withEllipsis;
}

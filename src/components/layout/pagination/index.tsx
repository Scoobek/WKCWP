"use client";

import { ArrowButton } from "./arrow-button";
import { ELLIPSIS, getPageItems, type Href } from "./page-items";
import { PageButton } from "./page-button";

/**
 * Reusable pagination control with two modes:
 * - Link mode (default): renders Link-based navigation for SSR pagination
 * - Button mode: renders button-based onChange for client-side pagination
 */
export function Pagination({
  currentPage,
  totalPages,
  createHref,
  onPageChange,
}: {
  /** 1-indexed current page. */
  currentPage: number;
  totalPages: number;
  /** Builds the href for a given page number (Link mode). Mutually exclusive with onPageChange. */
  createHref?: (page: number) => Href;
  /** Called when a page is selected (Button mode). Mutually exclusive with createHref. */
  onPageChange?: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 md:justify-end"
    >
      <ArrowButton
        direction="prev"
        page={currentPage - 1}
        disabled={currentPage === 1}
        createHref={createHref}
        onPageChange={onPageChange}
      />

      {/* Compact mobile indicator */}
      <span className="flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 sm:hidden dark:border-gray-600 dark:text-gray-300">
        {currentPage} / {totalPages}
      </span>

      {/* Full page-number row on sm+ */}
      {items.map((item, i) =>
        item === ELLIPSIS ? (
          <span
            key={`ellipsis-${i}`}
            className="hidden h-10 w-10 shrink-0 items-center justify-center text-sm text-gray-400 sm:flex dark:text-gray-600"
          >
            …
          </span>
        ) : (
          <PageButton
            key={item}
            page={item}
            isActive={item === currentPage}
            createHref={createHref}
            onPageChange={onPageChange}
          />
        )
      )}

      <ArrowButton
        direction="next"
        page={currentPage + 1}
        disabled={currentPage === totalPages}
        createHref={createHref}
        onPageChange={onPageChange}
      />
    </nav>
  );
}

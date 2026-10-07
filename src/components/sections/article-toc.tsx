"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/article-headings";

interface ArticleTocProps {
  headings: Heading[];
}

export function ArticleToc({ headings }: ArticleTocProps) {
  const t = useTranslations("sections.article");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!headings.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="article-toc-list"
        className="border-border bg-muted hover:bg-muted/80 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors"
      >
        <span className="text-foreground font-semibold">
          {t("inThisArticle")}
        </span>
        <svg
          className={cn(
            "h-5 w-5 transition-transform duration-200 motion-reduce:duration-0",
            isOpen ? "rotate-180" : ""
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      <nav
        id="article-toc-list"
        className={cn(
          "flex flex-col gap-2 transition-all duration-200 motion-reduce:duration-0",
          !isOpen && "hidden"
        )}
      >
        {headings.map((heading, index) => {
          const h2Index = headings
            .slice(0, index + 1)
            .filter((h) => h.level === 2).length;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "hover:text-foreground flex gap-2 text-sm transition-colors",
                heading.level === 2
                  ? "text-muted-foreground font-medium"
                  : "text-muted-foreground ml-4"
              )}
            >
              {heading.level === 2 && (
                <span className="text-muted-foreground/60 w-8 shrink-0">
                  {String(h2Index).padStart(2, "0")}
                </span>
              )}
              {heading.level === 3 && (
                <span className="text-muted-foreground/60 w-8 shrink-0" />
              )}
              <span>{heading.text}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

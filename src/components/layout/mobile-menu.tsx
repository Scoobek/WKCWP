"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/layout/types";

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative flex h-6 w-6 items-center justify-center lg:hidden"
      >
        {/* Three-bar hamburger morphing to X */}
        <div className="relative h-5 w-5">
          {/* Top bar */}
          <span
            className={cn(
              "bg-foreground absolute h-0.5 w-5 transition-transform duration-300 motion-reduce:duration-0",
              isOpen ? "top-2.5 rotate-45" : "top-1"
            )}
          />
          {/* Middle bar */}
          <span
            className={cn(
              "bg-foreground absolute h-0.5 w-5 transition-opacity duration-300 motion-reduce:duration-0",
              "top-2.5",
              isOpen ? "opacity-0" : "opacity-100"
            )}
          />
          {/* Bottom bar */}
          <span
            className={cn(
              "bg-foreground absolute h-0.5 w-5 transition-transform duration-300 motion-reduce:duration-0",
              isOpen ? "top-2.5 -rotate-45" : "top-4"
            )}
          />
        </div>
      </button>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-30 lg:hidden",
          "bg-background flex flex-col",
          "transition-[opacity,transform] duration-300 motion-reduce:transition-none motion-reduce:duration-0",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        {/* Nav links - scrollable middle section */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="text-muted-foreground flex flex-col gap-4 text-sm font-medium">
            {items.map((item) =>
              item.isAnchor ? (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-foreground block py-1 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ) : (
                <li key={item.id}>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-foreground block py-1 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Language switcher + theme toggle - fixed at bottom */}
        <div className="border-border flex items-center justify-between gap-4 border-t px-4 py-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

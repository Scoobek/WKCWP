"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal light/dark toggle. Flips the `.dark` class on <html> and persists the
 * choice to a `theme` cookie, which the root layout reads server-side to render
 * the correct class on first paint (no flash, no bootstrapping script).
 * Dependency-free; swap for `next-themes` if the theming needs grow.
 *
 * The current theme is read from the DOM via `useSyncExternalStore` so the
 * button stays in sync with the `.dark` class without setting state in an
 * effect, and renders a stable value during SSR.
 */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    // 1 year; readable by the server layout on subsequent requests.
    document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

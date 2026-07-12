"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Lets a page override where the `LanguageSwitcher` links each locale.
 *
 * The switcher lives in the `Header`, a *sibling* of the page content, so a page
 * can't prop-drill into it. Instead the provider wraps both (in the site
 * layout); a page publishes per-locale, locale-stripped paths (e.g.
 * `/posts/my-first-post`) via `<SetLocaleAlternates>`, and the switcher reads
 * them. Default is `null` → the switcher keeps its path-reuse behaviour.
 */
type Alternates = Record<string, string>;

const LocaleAlternatesContext = createContext<Alternates | null>(null);
const SetLocaleAlternatesContext = createContext<
  (alternates: Alternates | null) => void
>(() => {});

export function LocaleAlternatesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [alternates, setAlternates] = useState<Alternates | null>(null);

  return (
    <SetLocaleAlternatesContext.Provider value={setAlternates}>
      <LocaleAlternatesContext.Provider value={alternates}>
        {children}
      </LocaleAlternatesContext.Provider>
    </SetLocaleAlternatesContext.Provider>
  );
}

/** Per-locale target paths for the current page, or `null` for path reuse. */
export function useLocaleAlternates() {
  return useContext(LocaleAlternatesContext);
}

/**
 * Publishes per-locale alternates for the page that renders it, and clears them
 * on unmount so they don't leak to the next page. Renders nothing.
 */
export function SetLocaleAlternates({
  alternates,
}: {
  alternates: Alternates;
}) {
  const setAlternates = useContext(SetLocaleAlternatesContext);
  // Serialize so a fresh object with equal contents doesn't refire the effect.
  const key = JSON.stringify(alternates);

  useEffect(() => {
    setAlternates(alternates);
    return () => setAlternates(null);
    // `key` is the value-identity of `alternates`; depending on the object
    // itself would refire on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAlternates, key]);

  return null;
}

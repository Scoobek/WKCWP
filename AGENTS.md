<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Commits & branches

- Commit messages: Conventional Commits — `feat:` `fix:` `chore:` `docs:`
  `refactor:` `test:` `style:` `perf:` `ci:` `build:` `revert:`. Enforced by
  commitlint via the `commit-msg` hook.
- Do NOT add a `Co-Authored-By` footer to commit messages.
- NEVER commit directly to `main`. Before committing, verify you are on a
  properly named branch for the change; if not, create one first
  (`git switch -c <type>/<short-desc>`). Enforced by the `pre-commit` hook.
- Branch names: `develop`, or `<type>/<short-desc>` in lowercase kebab-case
  (e.g. `feat/sanity-studio`, `fix/login-redirect`). Types match the commit
  types above. Enforced by the `pre-commit` hook.

# Layout & grid

- Build pages with the primitives in `src/components/layout/`, not ad-hoc
  utilities: `Container` (page width — `max-w-7xl`/1280px + responsive padding),
  `Section` (vertical rhythm), `Grid` + `Col` (12-column responsive grid).
- `Col` spans use `span` / `md` / `lg` props (1–12). Do not build
  `col-span-${n}` strings — Tailwind won't detect them; extend the static maps
  in `grid.tsx` if new spans are needed.
- Public site pages live under `src/app/[locale]/(site)/` and get the
  header/footer shell from that group's `layout.tsx`. `/studio` has its own bare
  root layout — do NOT add site chrome to it.
- Merge class names with `cn()` from `src/lib/utils.ts` so `className` props can
  override component defaults.

# Internationalization (PL/EN)

- Locales: `pl` (default) + `en`, always URL-prefixed (`/pl`, `/en`). Source of
  truth: `src/i18n/routing.ts`. Locale detection/redirects run in
  `src/proxy.ts` (Next 16 "Proxy", formerly middleware) — its matcher excludes
  `/studio`, api, and static.
- Site routes live under `src/app/[locale]/`; `/studio` stays outside `[locale]`.
  There are TWO root layouts (`[locale]/layout.tsx`, `studio/layout.tsx`) sharing
  fonts from `src/app/fonts.ts`.
- Navigate with `Link` / helpers from `@/i18n/navigation` (locale-aware), NOT
  `next/link`. In pages, `await params` for `locale` and call `setRequestLocale`.
  UI strings: `useTranslations` / `getTranslations` + `messages/{pl,en}.json`.
- Content is **document-level** translated in Sanity
  (`@sanity/document-internationalization`): one `post` doc per language, filtered
  by `language == $locale` in GROQ (`src/sanity/lib/queries.ts`). Keep
  `src/sanity/i18n.ts` languages in sync with `src/i18n/routing.ts`.

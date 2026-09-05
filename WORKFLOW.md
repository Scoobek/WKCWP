# Workflow & working standards

How we build WKCwP. This is the human-facing "how we work" guide; the
machine-enforced rules (and the agent-facing conventions) live in
[`AGENTS.md`](./AGENTS.md) and the git hooks under `.husky/`. Where a rule is
enforced, this file points there rather than restating it, so the two can't
drift.

## Environment

- **Node 24**, pinned in [`.nvmrc`](./.nvmrc). Run `nvm use` in the repo root
  before working (installs 24 on first use).
- Install deps with `npm install`. The `prepare` script wires up Husky hooks
  automatically on install.
- Secrets live in `.env.local` (gitignored). `.env.example` is the tracked
  template — keep it in sync when adding new vars. Sanity needs
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `NEXT_PUBLIC_SANITY_API_VERSION`.

## Everyday commands

| Command            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Next dev server                                |
| `npm run build`    | Production build (also full type-check)        |
| `npm run lint`     | ESLint                                         |
| `npm run format`   | Prettier write (`format:check` to verify only) |
| `npx tsc --noEmit` | Type-check without emitting                    |

## Branching & commits

The rules are enforced by the `pre-commit` and `commit-msg` hooks and specified
in [`AGENTS.md`](./AGENTS.md#commits--branches). In short:

- **Never commit to `main`.** Always work on a branch first:
  `git switch -c <type>/<short-desc>` (e.g. `fix/login-redirect`). The
  `pre-commit` hook blocks `main` and rejects off-pattern branch names.
- **Conventional Commits** for messages (`feat:` `fix:` `chore:` `docs:`
  `refactor:` `test:` `style:` `perf:` `ci:` `build:` `revert:`), enforced by
  commitlint in `commit-msg`.
- **No `Co-Authored-By` footer.**
- On commit, `lint-staged` auto-runs `eslint --fix` + `prettier --write` on
  staged code and `prettier --write` on staged `json/md/css/html`.

### Delivery flow

1. Branch off `main` → do the work → commit.
2. Push and open a PR; merge to `main` via the PR (squash).
3. The feature branch can be deleted after merge (local branches persist until
   you prune them; that's fine).

## Definition of done (quality gates)

Before considering a change complete, run and pass:

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors
- `npm run format` (or `format:check`) — clean
- `npm run build` — succeeds (the real catch-all; it type-checks and validates
  routes/layouts)

**Verify against reality, not assumptions.** When behaviour depends on data or
an external service (Sanity, routing), confirm with the actual data — e.g. run
the real GROQ query against the dataset — before declaring it fixed. Several
bugs this session (the translation-metadata `_key`, stale dev servers) only
surfaced by checking the live behaviour rather than trusting the code as
written. Client-side console warnings can't be verified by grepping server
logs — check the browser (or remove the offending construct entirely).

## Working with this Next.js

This repo runs a **modified Next.js** whose APIs differ from upstream. Before
writing Next-specific code, read the relevant guide in
`node_modules/next/dist/docs/`. Notable differences already in play:

- **Middleware is "Proxy"**: `src/proxy.ts` (default export + `config.matcher`),
  not `middleware.ts`.
- Route `params` are Promises — `const { locale } = await params`.
- Multiple root layouts via route groups (used to keep `/studio` un-localized).

## Architecture conventions

Specifics live in [`AGENTS.md`](./AGENTS.md); the essentials:

- **Layout/grid** — build pages from the primitives in `src/components/layout/`
  (`Container`, `Section`, `Grid`/`Col`), not ad-hoc utilities. Merge class names
  with `cn()` from `src/lib/utils.ts`. Site pages live under
  `src/app/[locale]/(site)/`; `/studio` has its own bare root layout — no site
  chrome there.
- **i18n** — locales `pl` (default) + `en`, always URL-prefixed. Navigate with
  `Link`/helpers from `@/i18n/navigation` (never `next/link`). UI strings via
  `next-intl` + `messages/{pl,en}.json`. Content is **document-level** translated
  in Sanity (one doc per language, filtered by `language == $locale`). Keep
  `src/sanity/i18n.ts` in sync with `src/i18n/routing.ts`.
- **Per-locale post slugs** — slugs differ per language by design (SEO). The
  language switcher is fed each locale's real slug via the locale-alternates
  context (`src/components/layout/locale-alternates.tsx`) so it never 404s.
  Translation locale comes from the referenced doc's `language` field, **not**
  the `translations[]` array `_key` (which is a random UUID in this plugin
  version).

### Adding locale-dependent content (two recipes)

The per-locale plumbing is generic and reusable — new features should not
re-implement it. Two cases:

**A. Non-routed localized content** (settings, nav, footer, homepage blocks —
same URL across locales). The site is server-rendered per `/[locale]/…`, so a
language switch is a full navigation that re-runs any `language == $locale`
fetch. No alternates, no client state. Just:

1. Schema with a `language` field; register in `schemaTypes/index.ts`, and add
   the type to `documentInternationalization({ schemaTypes: [...] })` in
   `sanity.config.ts` if it's document-i18n.
2. A `getX(locale)` query in `src/sanity/lib/queries.ts` filtering
   `language == $locale`; fetch it in the server component with the page's
   `locale`. The switcher's default (path reuse) already handles the URL.

**B. Slug-routed localized content** (new doc types whose slug differs per
locale, like posts). Reuse the alternates channel:

1. Schema + `schemaTypes` registration, as in recipe A.
2. Detail query interpolates the shared `TRANSLATIONS_FRAGMENT`
   (`src/sanity/lib/queries.ts`) to pull each locale's slug.
3. In the detail page, build the switcher map with `buildLocaleAlternates`
   (`src/lib/locale-alternates.ts`) — pass `toPath` and a `fallback` for
   untranslated locales — and render `<SetLocaleAlternates alternates={…} />`.
   List pages that share a path across locales render nothing (default reuse).

## Sanity content & images

- **Content Lake stores the original upload unchanged** — there is no Studio
  option to transcode uploads to WebP. Storage size of the original is not
  something we optimise at upload time.
- **Optimise on delivery**: build image URLs with `@sanity/image-url` and
  `.auto("format")` so the CDN serves AVIF/WebP per the browser, plus
  `width`/`quality` as needed. This is the intended path for small, fast images.

## Planning habit

For non-trivial changes: understand the code first, write a short plan (problem
→ approach → files → verification), confirm the approach, then implement and run
the quality gates above. Keep commits scoped to one logical change.

# Project: WKCwP

Bilingual (PL/EN) marketing site with a Sanity-backed CMS. Editors create
dynamic, translated **posts**; the public site renders them per-locale.

## Stack

- **Next.js 16.2** (App Router, modified build — see below) + **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` in `src/app/globals.css`, no
  `tailwind.config.js`); manual class-based dark mode via a `theme` cookie
- **next-intl 4** for locale routing + UI strings (`pl` default, `en`)
- **Sanity 6** embedded Studio at `/studio` (`next-sanity 13`), with
  **document-level** translations (`@sanity/document-internationalization`)
- Content rendered with `@portabletext/react`

## Layout

```
src/
  app/
    [locale]/               # localized site (two root layouts total)
      layout.tsx            # root: <html>, fonts, theme cookie, intl provider
      (site)/               # header/footer shell (NOT applied to /studio)
        page.tsx            # home
        posts/page.tsx      # post list
        posts/[slug]/page.tsx
    studio/                 # un-localized; its own bare root layout
      [[...tool]]/          # embedded Sanity Studio (Studio.tsx is "use client")
    globals.css             # Tailwind v4 theme tokens
    fonts.ts                # Geist fonts shared by both root layouts
  components/layout/        # Container, Section, Grid/Col, Header, Footer, etc.
  i18n/                     # routing.ts, navigation.ts, request.ts
  lib/utils.ts              # cn()
  proxy.ts                  # locale detection/redirects (Next 16 "Proxy")
  sanity/                   # config split: env, client, queries, schema, i18n
messages/{pl,en}.json       # UI strings
```

## Run it

- `nvm use` (Node 24, pinned in `.nvmrc`) → `npm install` → `npm run dev`.
- Needs `.env.local` with `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` /
  `_API_VERSION` (template in `.env.example`). Content lives in Sanity's hosted
  Content Lake, so the Studio talks to the cloud even locally.
- Quality gates before done: `npx tsc --noEmit`, `npm run lint`,
  `npm run format`, `npm run build`. Verify data-dependent behaviour against the
  real dataset, not assumptions. Fuller process notes in `WORKFLOW.md`.

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
- Do NOT push changes after commit to origin

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

Set up Sanity using the `sanity-best-practices` skill's `getting-started` reference.

If the skill can't be found, install it by running `npx skills add sanity-io/agent-toolkit --skill sanity-best-practices -y`. If the install fails, stop and ask me to run it.

Context:

- Project: WKHwP (ppprmsum)
- Dataset: production
- Framework: Next.js
- This is a monorepo: the current folder is the root, with the Studio in `studio` and the Next.js app in `web`
- Connect Sanity to my new `web` app
- First, confirm `studio` and `web` are both in your working directory. If not, stop and ask me to restart you from the `wkhwp` folder.
- Keep the Studio standalone — do not embed it in the Next.js app

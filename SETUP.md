# Project Setup & Roadmap — WKCwP

Stack: **Next.js 16** · **Sanity** · **Tailwind v4** · **TypeScript**
Location: `wkcwp/` · Node 22 · ESLint 9 (flat config) · App Router + `src/`

This document tracks how the project was set up and what remains. Update it as
steps are completed.

---

## ✅ Done

### 1. Project init

- Scaffolded with `create-next-app` (TypeScript, ESLint, Tailwind v4, App
  Router, `src/` dir, `@/*` import alias).
- Result: Next.js 16.2.10, React 19, `.gitignore` and base ESLint flat config
  included out of the box.

### 2. Git init + first commit

- Repo initialized on `main`.
- Initial commit: `Initial commit from Create Next App`.
- Standards adopted: **Conventional Commits** (`feat:`, `fix:`, `chore:`,
  `docs:`), `.env*` ignored, `main` as default branch.

### 3. Prettier + ESLint integration — commit `b9c2a81`

- Installed dev deps: `prettier`, `prettier-plugin-tailwindcss`,
  `eslint-config-prettier`.
- `.prettierrc.json` — shared style config; loads the Tailwind class-sorting
  plugin.
- `.prettierignore` — skips `.next/`, `out/`, `build/`, `node_modules/`,
  `package-lock.json`, `next-env.d.ts`.
- `eslint.config.mjs` — appended `eslintConfigPrettier` **last** so Prettier owns
  formatting and the two tools don't conflict.
- `package.json` scripts: `format` (`prettier --write .`),
  `format:check` (`prettier --check .`); existing `lint` kept.
- Verified: formatting, lint, and Tailwind class sorting all work.

### 4. Husky pre-commit + Node pin — commit `729f2e2`

- Installed dev deps: `husky`, `lint-staged`.
- `.husky/pre-commit` — runs `npx lint-staged`.
- `lint-staged` config (in `package.json`): `eslint --fix` + `prettier --write`
  on staged JS/TS; `prettier --write` on staged JSON/MD/CSS/HTML.
- `prepare` script (`husky`) — auto-installs hooks on `npm install`, so a fresh
  clone needs no manual setup.
- `.nvmrc` — pinned to Node **24** (current Active LTS as of mid-2026).
- Verified: hook fires on commit and lint-staged formats staged files.
- Note: commits in this repo omit the `Co-Authored-By` footer by preference.

### 5. Commit + branch naming standards — commit `d696b02`

- Installed dev deps: `@commitlint/cli`, `@commitlint/config-conventional`.
- `commitlint.config.mjs` — Conventional Commits; allowed types: `feat`, `fix`,
  `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`.
- `.husky/commit-msg` — runs `commitlint --edit`; rejects non-conforming messages.
- `.husky/pre-commit` — also validates branch name before running lint-staged.
- **Branch naming:** `main` / `develop`, or `<type>/<short-desc>` (lowercase
  kebab-case), e.g. `feat/sanity-studio`, `fix/login-redirect`. Types match the
  commit types above.
- Verified: bad messages/branch names are rejected, valid ones pass.

### 6. Add Sanity (embedded studio) — commit `362a63d`

Embedded Studio at `/studio`, sharing the single Next.js deploy. Set up
**code-first** (packages + config written by hand) rather than via the
interactive scaffolder, since the Sanity project is created later.

- Installed deps: `sanity` (v6), `next-sanity` (v13), `@sanity/vision`,
  `styled-components` (Studio peer dep).
- `sanity.config.ts` (`basePath: /studio`, `structureTool` + `visionTool`),
  `sanity.cli.ts`.
- `src/sanity/env.ts` (validated env vars), `schemaTypes/index.ts` (empty
  schema to start), `lib/client.ts` (`next-sanity` client).
- Route `src/app/studio/[[...tool]]/page.tsx` + `Studio.tsx`. The Studio import
  lives behind a **Client Component** (`Studio.tsx`) so Sanity's browser code
  (and its `swr` dep) isn't pulled into the React Server Component layer —
  otherwise `swr`'s `react-server` build (no default export) breaks the build.
- `dynamic = "force-static"` on the route — valid because `cacheComponents` is
  off; would need revisiting if it's ever enabled.
- Env: `.env.example` (committed, no secrets) + `.env.local` (gitignored);
  added `!.env.example` negation to `.gitignore`. Two datasets: `production`
  (default in example) and `development` (default in local).
- Verified pre-auth: `tsc --noEmit`, `lint`, and `next dev` all pass; `/studio`
  returns 200 and renders the Studio shell (with a throwaway project ID); home
  page unaffected.

**Still required to go live (needs interactive Sanity login):**

1. `npx sanity login`
2. Create the project + `production`/`development` datasets (`npx sanity init`
   or via sanity.io/manage).
3. Fill `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
4. Then `/studio` connects live and `npm run build` fully passes.

---

## ⏭️ To do

### 7. Project-standard files

- `.env.example` — done in step 6 (Sanity keys documented, no secrets).
- `README.md` — setup + run steps (dev, build, studio).
- `.editorconfig` — consistent whitespace across editors.
- (`.nvmrc` already added in step 4.)
- Commit: `docs: add readme and env example`.

### 8. (Optional, later) CI

- GitHub Actions running `lint`, `format:check`, and `build` on PRs.

---

## Reference — useful commands

```bash
npm run dev           # start Next.js dev server
npm run build         # production build
npm run lint          # ESLint
npm run format        # format all files with Prettier
npm run format:check  # check formatting without writing
```

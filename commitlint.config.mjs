/**
 * Commit messages must follow Conventional Commits.
 * See: https://www.conventionalcommits.org
 * Enforced via the Husky `commit-msg` hook.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allowed commit types (kept in sync with the branch-name convention).
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "test",
        "style",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
  },
};

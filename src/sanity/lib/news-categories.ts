export const NEWS_CATEGORIES = [
  { id: "coursing", title: "Coursing" },
  { id: "beauty", title: "Beauty" },
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]["id"];

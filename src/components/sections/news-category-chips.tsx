import { NEWS_CATEGORIES } from "@/sanity/lib/news-categories";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NewsCategoryChips({ category }: { category: string }) {
  return (
    <div className="flex scrollbar-none gap-2 overflow-x-auto overscroll-x-contain sm:flex-wrap sm:overflow-visible">
      {/* All chip */}
      <Link
        href={{ pathname: "/" }}
        className={cn(
          "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition",
          category === "all"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
      >
        All
      </Link>

      {/* Category chips */}
      {NEWS_CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={{ pathname: "/", query: { category: cat.id } }}
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition",
            category === cat.id
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
        >
          {cat.title}
        </Link>
      ))}
    </div>
  );
}

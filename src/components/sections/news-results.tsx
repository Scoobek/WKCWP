"use client";

import { useCallback, useState } from "react";

import { Grid, Col } from "@/components/layout/grid";
import { Pagination } from "@/components/layout/pagination";
import { NewsCard } from "@/components/sections/news-card";
import type { NewsPost } from "@/sanity/lib/queries";

export function NewsResults({
  initialPosts,
  initialTotal,
  page,
  pageSize,
  category,
  locale,
}: {
  initialPosts: NewsPost[];
  initialTotal: number;
  page: number;
  pageSize: number;
  category: string;
  locale: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(page);
  const [isPending, setIsPending] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = useCallback(
    async (p: number) => {
      if (p < 1 || p > totalPages || p === currentPage) return;

      setIsPending(true);
      try {
        const params = new URLSearchParams({
          locale,
          category,
          page: String(p),
          pageSize: String(pageSize),
        });

        const res = await fetch(`/api/news?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as {
          items: NewsPost[];
          total: number;
        };

        setPosts(data.items);
        setTotal(data.total);
        setCurrentPage(p);

        // Update URL without triggering server re-render
        const query = new URLSearchParams();
        if (category !== "all") query.set("category", category);
        if (p > 1) query.set("page", String(p));

        const url = query.toString().length > 0 ? `/?${query}` : "/";
        window.history.replaceState(null, "", url);
      } catch (error) {
        console.error("Failed to fetch page:", error);
      } finally {
        setIsPending(false);
      }
    },
    [locale, category, pageSize, currentPage, totalPages]
  );

  return (
    <>
      <Grid>
        {posts.map((post) => (
          <Col
            key={post._id}
            span={12}
            md={6}
            lg={4}
            className={isPending ? "pointer-events-none opacity-50" : ""}
          >
            <NewsCard post={post} locale={locale} />
          </Col>
        ))}
      </Grid>

      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
}

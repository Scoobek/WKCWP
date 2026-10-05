import { type NextRequest, NextResponse } from "next/server";

import { getNewsPostsPage, type NewsCategory } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const locale = searchParams.get("locale") || "pl";
  const categoryParam = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 6);

  try {
    const result = await getNewsPostsPage(
      locale,
      (categoryParam === "all" ? "all" : categoryParam) as "all" | NewsCategory,
      page,
      pageSize
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/news] Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

/**
 * Shell for the public site: header + footer around the page content. Lives in
 * a route group so it wraps site pages but NOT `/studio` (which stays on the
 * bare root layout). Returns a fragment so the three land as direct children of
 * the root <body> (flex column) — giving a sticky footer.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

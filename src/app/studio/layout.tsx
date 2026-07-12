import "../globals.css";

import { geistMono, geistSans } from "@/app/fonts";

/**
 * Minimal root layout for the Sanity Studio. The Studio manages its own
 * full-screen UI/theming, so this only provides the required <html>/<body>.
 * Kept separate from the localized site root (`[locale]/layout.tsx`) because
 * `/studio` lives outside the `[locale]` segment.
 */
export const metadata = {
  title: "WKCwP Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

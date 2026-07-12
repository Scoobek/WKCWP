import "../globals.css";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { geistMono, geistSans } from "@/app/fonts";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WKCwP",
  description: "WKCwP",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Theme is resolved server-side from a cookie (set by <ThemeToggle />), so the
  // correct `.dark` class is in the initial HTML — no flash and no client-side
  // bootstrapping <script> (which React 19 warns about).
  const isDark = (await cookies()).get("theme")?.value === "dark";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
        isDark && "dark"
      )}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";

// Shared across both root layouts (site + studio) to avoid duplicate font setup.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

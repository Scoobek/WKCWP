import localFont from "next/font/local";
import { Geist_Mono, Montserrat } from "next/font/google";

// Shared across both root layouts (site + studio) to avoid duplicate font setup.
// `latin-ext` is required for Polish diacritics (ą ć ę ł ń ó ś ź ż).
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

// Bodoni 72 Book, self-hosted (not on Google Fonts). Single weight, so 400 only.
export const bodoni = localFont({
  src: "./bodoni-72-book.ttf",
  variable: "--font-bodoni",
  weight: "400",
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

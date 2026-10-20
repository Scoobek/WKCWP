import { Bodoni_Moda, Geist_Mono, Montserrat } from "next/font/google";

// Shared across both root layouts (site + studio) to avoid duplicate font setup.
// `latin-ext` is required for Polish diacritics (ą ć ę ł ń ó ś ź ż).
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

// Bodoni 72 is not on Google Fonts; Bodoni Moda is its web-available counterpart.
export const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

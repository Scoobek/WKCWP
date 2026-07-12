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

// Runs before paint to apply the persisted (or system) theme, preventing a
// flash of the wrong theme on load. Kept as a plain string so it can be inlined.
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

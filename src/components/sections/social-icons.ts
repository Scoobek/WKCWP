import type { ComponentType } from "react";
import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiX,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";

/** Icon per social platform value, shared by social media and profile sections. */
export const platformIcons: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  x: SiX,
  linkedin: FaLinkedinIn,
};

/**
 * Brand color per platform, as static class strings so Tailwind detects them.
 * X and TikTok are black marks, so they switch to white in dark mode.
 */
export const platformColors: Record<string, string> = {
  facebook: "text-[#1877F2]",
  instagram: "text-[#E4405F]",
  youtube: "text-[#FF0000]",
  tiktok: "text-black dark:text-white",
  x: "text-black dark:text-white",
  linkedin: "text-[#0A66C2]",
};

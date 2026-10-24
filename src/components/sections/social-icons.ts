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

import { ReactNode } from "react";

export interface NavItem {
  id: string;
  href: string;
  label: string | ReactNode;
  isAnchor?: boolean;
}

/** Header call-to-action button, already resolved for the current locale. */
export interface NavButton {
  label: string;
  url: string;
}

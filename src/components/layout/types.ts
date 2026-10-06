import { ReactNode } from "react";

export interface NavItem {
  id: string;
  href: string;
  label: string | ReactNode;
  isAnchor?: boolean;
}

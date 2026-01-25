import type { HTMLAttributes, ReactNode } from "react";

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  items?: MenuItem[]; // For nested menus
}

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  /** Menu items */
  items: MenuItem[];
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Callback when item is clicked */
  onItemClick?: (item: MenuItem) => void;
}

export interface MenuItemProps {
  item: MenuItem;
  size?: "sm" | "md" | "lg";
  onClick?: (item: MenuItem) => void;
}

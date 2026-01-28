import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import MenuView from "./View";
import type { MenuProps } from "./types";

/**
 * Menu component for navigation lists
 *
 * Supports horizontal and vertical orientations with icons,
 * dividers, and click handlers.
 *
 * @example
 * // Vertical menu
 * <Menu
 *   items={[
 *     { id: "home", label: "Home", href: "/" },
 *     { id: "about", label: "About", href: "/about" },
 *     { id: "divider", label: "", divider: true },
 *     { id: "contact", label: "Contact", href: "/contact" },
 *   ]}
 * />
 *
 * @example
 * // Horizontal menu with icons
 * <Menu
 *   orientation="horizontal"
 *   items={[
 *     { id: "home", label: "Home", icon: <HomeIcon /> },
 *     { id: "posts", label: "Posts", icon: <PostsIcon /> },
 *   ]}
 *   onItemClick={(item) => console.log(item.id)}
 * />
 */
const Menu = forwardRef<HTMLElement, MenuProps>((props, ref) => {
  return <MenuView ref={ref} {...props} />;
});

Menu.displayName = "Menu";

export default pipeline(React.memo)(Menu) as React.MemoExoticComponent<
  typeof Menu
>;

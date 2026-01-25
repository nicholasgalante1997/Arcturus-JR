import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import NavLinkView from "./View";
import type { NavLinkProps } from "./types";

/**
 * NavLink component for navigation with active state indication
 *
 * Provides various active state indicators including underline,
 * background, and border options.
 *
 * @example
 * // Basic navigation link
 * <NavLink href="/about">About</NavLink>
 *
 * @example
 * // Active link with underline
 * <NavLink href="/home" active activeIndicator="underline">
 *   Home
 * </NavLink>
 *
 * @example
 * // With icon
 * <NavLink href="/settings" icon={<SettingsIcon />}>
 *   Settings
 * </NavLink>
 *
 * @example
 * // Background indicator
 * <NavLink href="/dashboard" active activeIndicator="background">
 *   Dashboard
 * </NavLink>
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  return <NavLinkView ref={ref} {...props} />;
});

NavLink.displayName = "NavLink";

export default pipeline(React.memo)(NavLink) as React.MemoExoticComponent<
  typeof NavLink
>;

import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import LinkView from "./View";
import type { LinkProps } from "./types";

/**
 * Link component for navigation and actions
 *
 * Supports multiple variants, underline behaviors, and external link handling.
 * External links automatically get target="_blank" and proper rel attributes.
 *
 * @example
 * // Basic link
 * <Link href="/about">About us</Link>
 *
 * @example
 * // External link
 * <Link href="https://github.com" external>
 *   GitHub
 * </Link>
 *
 * @example
 * // Muted variant
 * <Link href="/privacy" variant="muted">
 *   Privacy Policy
 * </Link>
 *
 * @example
 * // Always underlined
 * <Link href="/docs" underline="always">
 *   Documentation
 * </Link>
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <LinkView ref={ref} {...props} />;
});

Link.displayName = "Link";

export default pipeline(React.memo)(Link) as React.MemoExoticComponent<
  typeof Link
>;

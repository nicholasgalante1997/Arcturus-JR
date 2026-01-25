import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import BreadcrumbView from "./View";
import type { BreadcrumbProps } from "./types";

/**
 * Breadcrumb component for showing navigation hierarchy
 *
 * Supports custom separators, overflow handling with ellipsis,
 * and active state for the current page.
 *
 * @example
 * // Basic breadcrumb
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Posts", href: "/posts" },
 *     { label: "Current Post", active: true },
 *   ]}
 * />
 *
 * @example
 * // With max items (shows ellipsis for overflow)
 * <Breadcrumb
 *   items={longPath}
 *   maxItems={4}
 * />
 *
 * @example
 * // Custom separator
 * <Breadcrumb
 *   items={items}
 *   separator={<span>/</span>}
 * />
 */
const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => {
  return <BreadcrumbView ref={ref} {...props} />;
});

Breadcrumb.displayName = "Breadcrumb";

export default pipeline(React.memo)(Breadcrumb) as React.MemoExoticComponent<
  typeof Breadcrumb
>;

import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import DividerView from "./View";
import type { DividerProps } from "./types";

/**
 * Divider component for separating content
 *
 * Supports horizontal and vertical orientations with different
 * visual styles and spacing options.
 *
 * @example
 * // Basic horizontal divider
 * <Divider />
 *
 * @example
 * // Dashed divider with large spacing
 * <Divider variant="dashed" spacing="lg" />
 *
 * @example
 * // Vertical divider in a flex container
 * <Stack direction="horizontal">
 *   <span>Left</span>
 *   <Divider orientation="vertical" />
 *   <span>Right</span>
 * </Stack>
 */
const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  return <DividerView ref={ref} {...props} />;
});

Divider.displayName = "Divider";

export default pipeline(React.memo)(Divider) as React.MemoExoticComponent<
  typeof Divider
>;

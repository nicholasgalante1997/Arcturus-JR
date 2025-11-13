import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import StackView from "./View";
import type { StackProps } from "./types";

/**
 * Stack component for laying out children with consistent spacing
 *
 * Supports vertical or horizontal direction with configurable
 * alignment, justification, and spacing.
 *
 * @example
 * // Vertical stack (default)
 * <Stack spacing="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 *
 * @example
 * // Horizontal stack
 * <Stack direction="horizontal" align="center" spacing="md">
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </Stack>
 *
 * @example
 * // With justify between
 * <Stack direction="horizontal" justify="between">
 *   <Logo />
 *   <Navigation />
 * </Stack>
 */
const Stack = forwardRef<HTMLElement, StackProps>((props, ref) => {
  return <StackView ref={ref} {...props} />;
});

Stack.displayName = "Stack";

export default pipeline(React.memo)(Stack) as React.MemoExoticComponent<
  typeof Stack
>;

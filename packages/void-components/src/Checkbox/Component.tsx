import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import CheckboxView from "./View";
import type { CheckboxProps } from "./types";

/**
 * Checkbox component for boolean selections
 *
 * Extends native HTMLInputElement props (except type), supporting all
 * standard checkbox attributes and events.
 *
 * @example
 * // Basic usage
 * <Checkbox
 *   checked={agreed}
 *   onChange={(e) => setAgreed(e.target.checked)}
 *   label="I agree to the terms"
 * />
 *
 * @example
 * // With helper text
 * <Checkbox
 *   label="Subscribe to newsletter"
 *   helperText="We'll only send important updates"
 * />
 *
 * @example
 * // With error
 * <Checkbox
 *   label="Accept terms"
 *   error={!accepted ? "You must accept the terms" : undefined}
 * />
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return <CheckboxView ref={ref} {...props} />;
});

Checkbox.displayName = "Checkbox";

export default pipeline(React.memo)(Checkbox) as React.MemoExoticComponent<
  typeof Checkbox
>;

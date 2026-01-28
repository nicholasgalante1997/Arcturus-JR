import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import SelectView from "./View";
import type { SelectProps } from "./types";

/**
 * Select component for dropdown selection
 *
 * Extends native HTMLSelectElement props, supporting all standard
 * select attributes and events. Provides built-in validation states.
 *
 * @example
 * // Basic usage
 * <Select
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" },
 *   ]}
 *   value={selected}
 *   onChange={(e) => setSelected(e.target.value)}
 * />
 *
 * @example
 * // With label and placeholder
 * <Select
 *   label="Country"
 *   placeholder="Select a country..."
 *   options={countries}
 * />
 *
 * @example
 * // With validation error
 * <Select
 *   options={categories}
 *   error={!category ? "Please select a category" : undefined}
 * />
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return <SelectView ref={ref} {...props} />;
});

Select.displayName = "Select";

export default pipeline(React.memo)(Select) as React.MemoExoticComponent<
  typeof Select
>;

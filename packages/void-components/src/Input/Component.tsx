import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import InputView from "./View";
import type { InputProps } from "./types";

/**
 * Input component for text entry with validation support
 *
 * Extends native HTMLInputElement props, supporting all standard
 * input attributes and events. Provides built-in validation states.
 *
 * @example
 * // Basic usage
 * <Input value={name} onChange={(e) => setName(e.target.value)} />
 *
 * @example
 * // With label and helper text
 * <Input
 *   label="Email"
 *   helperText="We'll never share your email"
 *   type="email"
 * />
 *
 * @example
 * // With validation error
 * <Input
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={!isValidEmail(email) ? "Enter a valid email" : undefined}
 * />
 *
 * @example
 * // With icons
 * <Input
 *   leftElement={<SearchIcon />}
 *   placeholder="Search..."
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <InputView ref={ref} {...props} />;
});

Input.displayName = "Input";

export default pipeline(React.memo)(Input) as React.MemoExoticComponent<
  typeof Input
>;

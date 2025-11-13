import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import TextareaView from "./View";
import type { TextareaProps } from "./types";

/**
 * Textarea component for multi-line text entry
 *
 * Extends native HTMLTextAreaElement props, supporting all standard
 * textarea attributes and events. Provides built-in validation states
 * and resize options.
 *
 * @example
 * // Basic usage
 * <Textarea
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   placeholder="Enter your message..."
 * />
 *
 * @example
 * // With label and helper text
 * <Textarea
 *   label="Message"
 *   helperText="Max 500 characters"
 *   rows={6}
 * />
 *
 * @example
 * // With validation error
 * <Textarea
 *   value={bio}
 *   error={bio.length > 500 ? "Bio is too long" : undefined}
 *   resize="none"
 * />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return <TextareaView ref={ref} {...props} />;
  }
);

Textarea.displayName = "Textarea";

export default pipeline(React.memo)(Textarea) as React.MemoExoticComponent<
  typeof Textarea
>;

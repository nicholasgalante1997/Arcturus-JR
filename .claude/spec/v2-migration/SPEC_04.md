# SPEC-04: Form Components (void-components)

## Context

This spec adds form components to the `@arcjr/void-components` library. These components follow the Container/View pattern and integrate with the Void design system.

## Prerequisites

- SPEC-01 through SPEC-03 completed (Tailwind/PostCSS pipeline working)
- `@arcjr/void-components` package structure exists

## Requirements

### 1. Input Component

Create `packages/void-components/src/Input/types.ts`:

```typescript
import type { InputHTMLAttributes } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual size of the input */
  size?: InputSize;
  /** Visual variant/state */
  variant?: InputVariant;
  /** Label text above input */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message (sets variant to error) */
  error?: string;
  /** Full width of container */
  fullWidth?: boolean;
  /** Left icon/element */
  leftElement?: React.ReactNode;
  /** Right icon/element */
  rightElement?: React.ReactNode;
}
```

Create `packages/void-components/src/Input/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { InputProps } from "./types";

function InputView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    leftElement,
    rightElement,
    className,
    id,
    disabled,
    ...props
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputId = id || `void-input-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-input-wrapper",
        fullWidth && "void-input-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={inputId} className="void-input__label">
          {label}
        </label>
      )}
      <div className="void-input__container">
        {leftElement && (
          <span className="void-input__left-element">{leftElement}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={clsx(
            "void-input",
            `void-input--${size}`,
            `void-input--${effectiveVariant}`,
            leftElement && "void-input--has-left",
            rightElement && "void-input--has-right",
            disabled && "void-input--disabled"
          )}
          aria-invalid={effectiveVariant === "error"}
          aria-describedby={
            effectiveHelperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {rightElement && (
          <span className="void-input__right-element">{rightElement}</span>
        )}
      </div>
      {effectiveHelperText && (
        <span
          id={`${inputId}-helper`}
          className={clsx(
            "void-input__helper",
            effectiveVariant === "error" && "void-input__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default forwardRef(InputView);
```

Create `packages/void-components/src/Input/Component.tsx`:

```tsx
import { forwardRef } from "react";
import InputView from "./View";
import type { InputProps } from "./types";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <InputView ref={ref} {...props} />;
});

Input.displayName = "Input";

export default Input;
```

Create `packages/void-components/src/Input/Input.css`:

```css
.void-input-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: var(--void-spacing-1);
}

.void-input-wrapper--full-width {
  display: flex;
  width: 100%;
}

.void-input__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
}

.void-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.void-input {
  flex: 1;
  padding: var(--void-spacing-2) var(--void-spacing-3);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--void-color-base-white);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  border-radius: var(--void-border-radius-md);
  transition: border-color var(--void-transition-duration-fast)
      var(--void-transition-easing-ease),
    box-shadow var(--void-transition-duration-fast)
      var(--void-transition-easing-ease);
}

.void-input::placeholder {
  color: var(--void-color-gray-500);
}

.void-input:hover:not(:disabled) {
  border-color: var(--void-color-gray-600);
}

.void-input:focus {
  outline: none;
  border-color: var(--void-color-brand-violet);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

/* Sizes */
.void-input--sm {
  padding: var(--void-spacing-1) var(--void-spacing-2);
  font-size: 0.875rem;
}

.void-input--lg {
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 1.125rem;
}

/* Variants */
.void-input--error {
  border-color: var(--void-color-semantic-error);
}

.void-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

.void-input--success {
  border-color: var(--void-color-semantic-success);
}

.void-input--success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
}

/* Disabled */
.void-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* With elements */
.void-input--has-left {
  padding-left: var(--void-spacing-10);
}

.void-input--has-right {
  padding-right: var(--void-spacing-10);
}

.void-input__left-element,
.void-input__right-element {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--void-spacing-10);
  color: var(--void-color-gray-400);
  pointer-events: none;
}

.void-input__left-element {
  left: 0;
}

.void-input__right-element {
  right: 0;
}

/* Helper text */
.void-input__helper {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.void-input__helper--error {
  color: var(--void-color-semantic-error);
}
```

Create `packages/void-components/src/Input/index.ts`:

```typescript
export { default as Input } from "./Component";
export type { InputProps, InputSize, InputVariant } from "./types";
```

### 2. Textarea Component

Create `packages/void-components/src/Textarea/types.ts`:

```typescript
import type { TextareaHTMLAttributes } from "react";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "error" | "success";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  variant?: TextareaVariant;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  resize?: TextareaResize;
}
```

Create `packages/void-components/src/Textarea/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { TextareaProps } from "./types";

function TextareaView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    resize = "vertical",
    className,
    id,
    disabled,
    rows = 4,
    ...props
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const textareaId =
    id || `void-textarea-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-textarea-wrapper",
        fullWidth && "void-textarea-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={textareaId} className="void-textarea__label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={clsx(
          "void-textarea",
          `void-textarea--${size}`,
          `void-textarea--${effectiveVariant}`,
          `void-textarea--resize-${resize}`,
          disabled && "void-textarea--disabled"
        )}
        aria-invalid={effectiveVariant === "error"}
        aria-describedby={
          effectiveHelperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />
      {effectiveHelperText && (
        <span
          id={`${textareaId}-helper`}
          className={clsx(
            "void-textarea__helper",
            effectiveVariant === "error" && "void-textarea__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default forwardRef(TextareaView);
```

Create `packages/void-components/src/Textarea/Component.tsx`:

```tsx
import { forwardRef } from "react";
import TextareaView from "./View";
import type { TextareaProps } from "./types";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return <TextareaView ref={ref} {...props} />;
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
```

Create `packages/void-components/src/Textarea/Textarea.css`:

```css
.void-textarea-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: var(--void-spacing-1);
}

.void-textarea-wrapper--full-width {
  display: flex;
  width: 100%;
}

.void-textarea__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
}

.void-textarea {
  width: 100%;
  padding: var(--void-spacing-2) var(--void-spacing-3);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--void-color-base-white);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  border-radius: var(--void-border-radius-md);
  transition: border-color var(--void-transition-duration-fast)
      var(--void-transition-easing-ease),
    box-shadow var(--void-transition-duration-fast)
      var(--void-transition-easing-ease);
}

.void-textarea::placeholder {
  color: var(--void-color-gray-500);
}

.void-textarea:hover:not(:disabled) {
  border-color: var(--void-color-gray-600);
}

.void-textarea:focus {
  outline: none;
  border-color: var(--void-color-brand-violet);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

/* Sizes */
.void-textarea--sm {
  padding: var(--void-spacing-1) var(--void-spacing-2);
  font-size: 0.875rem;
}

.void-textarea--lg {
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 1.125rem;
}

/* Variants */
.void-textarea--error {
  border-color: var(--void-color-semantic-error);
}

.void-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

.void-textarea--success {
  border-color: var(--void-color-semantic-success);
}

/* Resize */
.void-textarea--resize-none {
  resize: none;
}
.void-textarea--resize-vertical {
  resize: vertical;
}
.void-textarea--resize-horizontal {
  resize: horizontal;
}
.void-textarea--resize-both {
  resize: both;
}

/* Disabled */
.void-textarea--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Helper text */
.void-textarea__helper {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.void-textarea__helper--error {
  color: var(--void-color-semantic-error);
}
```

Create `packages/void-components/src/Textarea/index.ts`:

```typescript
export { default as Textarea } from "./Component";
export type {
  TextareaProps,
  TextareaSize,
  TextareaVariant,
  TextareaResize,
} from "./types";
```

### 3. Select Component

Create `packages/void-components/src/Select/types.ts`:

```typescript
import type { SelectHTMLAttributes } from "react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "default" | "error" | "success";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: SelectSize;
  variant?: SelectVariant;
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}
```

Create `packages/void-components/src/Select/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { SelectProps } from "./types";

function SelectView(
  {
    size = "md",
    variant = "default",
    label,
    helperText,
    error,
    fullWidth = false,
    options,
    placeholder,
    className,
    id,
    disabled,
    ...props
  }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const selectId =
    id || `void-select-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveVariant = error ? "error" : variant;
  const effectiveHelperText = error || helperText;

  return (
    <div
      className={clsx(
        "void-select-wrapper",
        fullWidth && "void-select-wrapper--full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={selectId} className="void-select__label">
          {label}
        </label>
      )}
      <div className="void-select__container">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={clsx(
            "void-select",
            `void-select--${size}`,
            `void-select--${effectiveVariant}`,
            disabled && "void-select--disabled"
          )}
          aria-invalid={effectiveVariant === "error"}
          aria-describedby={
            effectiveHelperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="void-select__icon" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {effectiveHelperText && (
        <span
          id={`${selectId}-helper`}
          className={clsx(
            "void-select__helper",
            effectiveVariant === "error" && "void-select__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default forwardRef(SelectView);
```

Create `packages/void-components/src/Select/Component.tsx`:

```tsx
import { forwardRef } from "react";
import SelectView from "./View";
import type { SelectProps } from "./types";

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return <SelectView ref={ref} {...props} />;
});

Select.displayName = "Select";

export default Select;
```

Create `packages/void-components/src/Select/Select.css`:

```css
.void-select-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: var(--void-spacing-1);
}

.void-select-wrapper--full-width {
  display: flex;
  width: 100%;
}

.void-select__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
}

.void-select__container {
  position: relative;
  display: flex;
}

.void-select {
  flex: 1;
  appearance: none;
  padding: var(--void-spacing-2) var(--void-spacing-10) var(--void-spacing-2)
    var(--void-spacing-3);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--void-color-base-white);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  border-radius: var(--void-border-radius-md);
  cursor: pointer;
  transition: border-color var(--void-transition-duration-fast)
      var(--void-transition-easing-ease),
    box-shadow var(--void-transition-duration-fast)
      var(--void-transition-easing-ease);
}

.void-select:hover:not(:disabled) {
  border-color: var(--void-color-gray-600);
}

.void-select:focus {
  outline: none;
  border-color: var(--void-color-brand-violet);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

/* Sizes */
.void-select--sm {
  padding: var(--void-spacing-1) var(--void-spacing-8) var(--void-spacing-1)
    var(--void-spacing-2);
  font-size: 0.875rem;
}

.void-select--lg {
  padding: var(--void-spacing-3) var(--void-spacing-12) var(--void-spacing-3)
    var(--void-spacing-4);
  font-size: 1.125rem;
}

/* Variants */
.void-select--error {
  border-color: var(--void-color-semantic-error);
}

.void-select--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

.void-select--success {
  border-color: var(--void-color-semantic-success);
}

/* Disabled */
.void-select--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Icon */
.void-select__icon {
  position: absolute;
  right: var(--void-spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--void-color-gray-400);
  pointer-events: none;
}

/* Helper text */
.void-select__helper {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.void-select__helper--error {
  color: var(--void-color-semantic-error);
}
```

Create `packages/void-components/src/Select/index.ts`:

```typescript
export { default as Select } from "./Component";
export type { SelectProps, SelectOption, SelectSize, SelectVariant } from "./types";
```

### 4. Checkbox Component

Create `packages/void-components/src/Checkbox/types.ts`:

```typescript
import type { InputHTMLAttributes } from "react";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  size?: CheckboxSize;
  label?: string;
  helperText?: string;
  error?: string;
}
```

Create `packages/void-components/src/Checkbox/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { CheckboxProps } from "./types";

function CheckboxView(
  {
    size = "md",
    label,
    helperText,
    error,
    className,
    id,
    disabled,
    ...props
  }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const checkboxId =
    id || `void-checkbox-${Math.random().toString(36).slice(2, 9)}`;
  const effectiveHelperText = error || helperText;

  return (
    <div className={clsx("void-checkbox-wrapper", className)}>
      <label
        htmlFor={checkboxId}
        className={clsx(
          "void-checkbox__label",
          disabled && "void-checkbox__label--disabled"
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          disabled={disabled}
          className={clsx(
            "void-checkbox",
            `void-checkbox--${size}`,
            error && "void-checkbox--error"
          )}
          aria-invalid={!!error}
          aria-describedby={
            effectiveHelperText ? `${checkboxId}-helper` : undefined
          }
          {...props}
        />
        {label && <span className="void-checkbox__text">{label}</span>}
      </label>
      {effectiveHelperText && (
        <span
          id={`${checkboxId}-helper`}
          className={clsx(
            "void-checkbox__helper",
            error && "void-checkbox__helper--error"
          )}
        >
          {effectiveHelperText}
        </span>
      )}
    </div>
  );
}

export default forwardRef(CheckboxView);
```

Create `packages/void-components/src/Checkbox/Component.tsx`:

```tsx
import { forwardRef } from "react";
import CheckboxView from "./View";
import type { CheckboxProps } from "./types";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return <CheckboxView ref={ref} {...props} />;
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
```

Create `packages/void-components/src/Checkbox/Checkbox.css`:

```css
.void-checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-1);
}

.void-checkbox__label {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-2);
  cursor: pointer;
  user-select: none;
}

.void-checkbox__label--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.void-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  appearance: none;
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  border-radius: var(--void-border-radius-sm);
  cursor: pointer;
  transition: all var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.void-checkbox:hover:not(:disabled) {
  border-color: var(--void-color-gray-600);
}

.void-checkbox:focus-visible {
  outline: var(--void-border-width-medium) solid var(--void-color-brand-violet);
  outline-offset: 2px;
}

.void-checkbox:checked {
  background-color: var(--void-color-brand-violet);
  border-color: var(--void-color-brand-violet);
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}

/* Sizes */
.void-checkbox--sm {
  width: 1rem;
  height: 1rem;
}

.void-checkbox--lg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Error */
.void-checkbox--error {
  border-color: var(--void-color-semantic-error);
}

/* Text */
.void-checkbox__text {
  font-size: 0.875rem;
  color: var(--void-color-gray-200);
}

/* Helper text */
.void-checkbox__helper {
  margin-left: calc(1.25rem + var(--void-spacing-2));
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.void-checkbox__helper--error {
  color: var(--void-color-semantic-error);
}
```

Create `packages/void-components/src/Checkbox/index.ts`:

```typescript
export { default as Checkbox } from "./Component";
export type { CheckboxProps, CheckboxSize } from "./types";
```

### 5. Update Main Export

Update `packages/void-components/src/index.ts`:

```typescript
// Existing exports
export { Button } from "./Button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./Button";

export { Card } from "./Card";
export type { CardProps, CardPadding, CardVariant } from "./Card";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

// New form components
export { Input } from "./Input";
export type { InputProps, InputSize, InputVariant } from "./Input";

export { Textarea } from "./Textarea";
export type {
  TextareaProps,
  TextareaSize,
  TextareaVariant,
  TextareaResize,
} from "./Textarea";

export { Select } from "./Select";
export type { SelectProps, SelectOption, SelectSize, SelectVariant } from "./Select";

export { Checkbox } from "./Checkbox";
export type { CheckboxProps, CheckboxSize } from "./Checkbox";
```

### 6. Add Stories

Create Storybook stories for each component following the existing pattern in `packages/void-components/src/Button/Button.stories.tsx`.

## Acceptance Criteria

- [ ] Input component with sizes, variants, label, helper text, error state
- [ ] Textarea component with resize options and all Input features
- [ ] Select component with options array and placeholder
- [ ] Checkbox component with label and helper text
- [ ] All components use forwardRef for ref forwarding
- [ ] All components have proper ARIA attributes
- [ ] All CSS uses void-tokens variables
- [ ] Storybook stories document all variants
- [ ] `bun run build` completes without errors

## Notes

- All form components follow the same structural pattern
- Use `forwardRef` for form element ref access
- Generate unique IDs for label/input association
- Error state overrides variant prop
- Helper text displays error message when error prop is set

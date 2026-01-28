# SPEC-05: Layout Components (void-components)

## Context

This spec adds layout primitives to `@arcjr/void-components`. These components provide the structural building blocks for page composition.

## Prerequisites

- SPEC-01 through SPEC-03 completed (build pipeline)
- SPEC-04 completed (form components pattern established)

## Requirements

### 1. Container Component

Create `packages/void-components/src/Container/types.ts`:

```typescript
import type { HTMLAttributes } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the container */
  size?: ContainerSize;
  /** Center the container horizontally */
  centered?: boolean;
  /** Add horizontal padding */
  padded?: boolean;
  /** Render as a different element */
  as?: "div" | "section" | "article" | "main" | "aside";
}
```

Create `packages/void-components/src/Container/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef, type ElementType } from "react";
import clsx from "clsx";
import type { ContainerProps } from "./types";

function ContainerView(
  {
    size = "xl",
    centered = true,
    padded = true,
    as: Component = "div",
    className,
    children,
    ...props
  }: ContainerProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-container",
        `void-container--${size}`,
        centered && "void-container--centered",
        padded && "void-container--padded",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default forwardRef(ContainerView);
```

Create `packages/void-components/src/Container/Component.tsx`:

```tsx
import { forwardRef } from "react";
import ContainerView from "./View";
import type { ContainerProps } from "./types";

const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  return <ContainerView ref={ref} {...props} />;
});

Container.displayName = "Container";

export default Container;
```

Create `packages/void-components/src/Container/Container.css`:

```css
.void-container {
  width: 100%;
}

.void-container--centered {
  margin-left: auto;
  margin-right: auto;
}

.void-container--padded {
  padding-left: var(--void-spacing-4);
  padding-right: var(--void-spacing-4);
}

@media (min-width: 640px) {
  .void-container--padded {
    padding-left: var(--void-spacing-6);
    padding-right: var(--void-spacing-6);
  }
}

@media (min-width: 1024px) {
  .void-container--padded {
    padding-left: var(--void-spacing-8);
    padding-right: var(--void-spacing-8);
  }
}

/* Sizes */
.void-container--sm {
  max-width: 640px;
}
.void-container--md {
  max-width: 768px;
}
.void-container--lg {
  max-width: 1024px;
}
.void-container--xl {
  max-width: 1280px;
}
.void-container--2xl {
  max-width: 1536px;
}
.void-container--full {
  max-width: 100%;
}
```

Create `packages/void-components/src/Container/index.ts`:

```typescript
export { default as Container } from "./Component";
export type { ContainerProps, ContainerSize } from "./types";
```

### 2. Stack Component

Create `packages/void-components/src/Stack/types.ts`:

```typescript
import type { HTMLAttributes } from "react";

export type StackDirection = "vertical" | "horizontal";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type StackSpacing =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction of the stack */
  direction?: StackDirection;
  /** Alignment of items on cross axis */
  align?: StackAlign;
  /** Justification of items on main axis */
  justify?: StackJustify;
  /** Gap between items */
  spacing?: StackSpacing;
  /** Wrap items to next line */
  wrap?: boolean;
  /** Render as a different element */
  as?: "div" | "section" | "article" | "ul" | "ol" | "nav";
}
```

Create `packages/void-components/src/Stack/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { StackProps } from "./types";

function StackView(
  {
    direction = "vertical",
    align = "stretch",
    justify = "start",
    spacing = "md",
    wrap = false,
    as: Component = "div",
    className,
    children,
    ...props
  }: StackProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-stack",
        `void-stack--${direction}`,
        `void-stack--align-${align}`,
        `void-stack--justify-${justify}`,
        `void-stack--spacing-${spacing}`,
        wrap && "void-stack--wrap",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default forwardRef(StackView);
```

Create `packages/void-components/src/Stack/Component.tsx`:

```tsx
import { forwardRef } from "react";
import StackView from "./View";
import type { StackProps } from "./types";

const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <StackView ref={ref} {...props} />;
});

Stack.displayName = "Stack";

export default Stack;
```

Create `packages/void-components/src/Stack/Stack.css`:

```css
.void-stack {
  display: flex;
}

/* Direction */
.void-stack--vertical {
  flex-direction: column;
}

.void-stack--horizontal {
  flex-direction: row;
}

/* Alignment */
.void-stack--align-start {
  align-items: flex-start;
}
.void-stack--align-center {
  align-items: center;
}
.void-stack--align-end {
  align-items: flex-end;
}
.void-stack--align-stretch {
  align-items: stretch;
}
.void-stack--align-baseline {
  align-items: baseline;
}

/* Justification */
.void-stack--justify-start {
  justify-content: flex-start;
}
.void-stack--justify-center {
  justify-content: center;
}
.void-stack--justify-end {
  justify-content: flex-end;
}
.void-stack--justify-between {
  justify-content: space-between;
}
.void-stack--justify-around {
  justify-content: space-around;
}
.void-stack--justify-evenly {
  justify-content: space-evenly;
}

/* Spacing */
.void-stack--spacing-none {
  gap: 0;
}
.void-stack--spacing-xs {
  gap: var(--void-spacing-1);
}
.void-stack--spacing-sm {
  gap: var(--void-spacing-2);
}
.void-stack--spacing-md {
  gap: var(--void-spacing-4);
}
.void-stack--spacing-lg {
  gap: var(--void-spacing-6);
}
.void-stack--spacing-xl {
  gap: var(--void-spacing-8);
}
.void-stack--spacing-2xl {
  gap: var(--void-spacing-12);
}
.void-stack--spacing-3xl {
  gap: var(--void-spacing-16);
}

/* Wrap */
.void-stack--wrap {
  flex-wrap: wrap;
}
```

Create `packages/void-components/src/Stack/index.ts`:

```typescript
export { default as Stack } from "./Component";
export type {
  StackProps,
  StackDirection,
  StackAlign,
  StackJustify,
  StackSpacing,
} from "./types";
```

### 3. Grid Component

Create `packages/void-components/src/Grid/types.ts`:

```typescript
import type { HTMLAttributes } from "react";

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12 | "auto";
export type GridSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  cols?: GridCols;
  /** Columns at sm breakpoint */
  colsSm?: GridCols;
  /** Columns at md breakpoint */
  colsMd?: GridCols;
  /** Columns at lg breakpoint */
  colsLg?: GridCols;
  /** Gap between grid items */
  spacing?: GridSpacing;
  /** Render as a different element */
  as?: "div" | "section" | "ul";
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span */
  span?: number;
  /** Column span at sm breakpoint */
  spanSm?: number;
  /** Column span at md breakpoint */
  spanMd?: number;
  /** Column span at lg breakpoint */
  spanLg?: number;
}
```

Create `packages/void-components/src/Grid/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { GridProps } from "./types";

function GridView(
  {
    cols = 1,
    colsSm,
    colsMd,
    colsLg,
    spacing = "md",
    as: Component = "div",
    className,
    children,
    ...props
  }: GridProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Component
      ref={ref}
      className={clsx(
        "void-grid",
        `void-grid--cols-${cols}`,
        colsSm && `void-grid--sm-cols-${colsSm}`,
        colsMd && `void-grid--md-cols-${colsMd}`,
        colsLg && `void-grid--lg-cols-${colsLg}`,
        `void-grid--spacing-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default forwardRef(GridView);
```

Create `packages/void-components/src/Grid/GridItem.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { GridItemProps } from "./types";

function GridItemView(
  { span, spanSm, spanMd, spanLg, className, children, ...props }: GridItemProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "void-grid-item",
        span && `void-grid-item--span-${span}`,
        spanSm && `void-grid-item--sm-span-${spanSm}`,
        spanMd && `void-grid-item--md-span-${spanMd}`,
        spanLg && `void-grid-item--lg-span-${spanLg}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const GridItem = forwardRef(GridItemView);
GridItem.displayName = "GridItem";

export default GridItem;
```

Create `packages/void-components/src/Grid/Component.tsx`:

```tsx
import { forwardRef } from "react";
import GridView from "./View";
import GridItem from "./GridItem";
import type { GridProps } from "./types";

interface GridComponent
  extends React.ForwardRefExoticComponent<
    GridProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: typeof GridItem;
}

const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <GridView ref={ref} {...props} />;
}) as GridComponent;

Grid.displayName = "Grid";
Grid.Item = GridItem;

export default Grid;
```

Create `packages/void-components/src/Grid/Grid.css`:

```css
.void-grid {
  display: grid;
}

/* Base columns */
.void-grid--cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.void-grid--cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.void-grid--cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.void-grid--cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.void-grid--cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.void-grid--cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
.void-grid--cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
.void-grid--cols-auto {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* SM breakpoint columns */
@media (min-width: 640px) {
  .void-grid--sm-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .void-grid--sm-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .void-grid--sm-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .void-grid--sm-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .void-grid--sm-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/* MD breakpoint columns */
@media (min-width: 768px) {
  .void-grid--md-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .void-grid--md-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .void-grid--md-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .void-grid--md-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .void-grid--md-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/* LG breakpoint columns */
@media (min-width: 1024px) {
  .void-grid--lg-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .void-grid--lg-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .void-grid--lg-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .void-grid--lg-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .void-grid--lg-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

/* Spacing */
.void-grid--spacing-none {
  gap: 0;
}
.void-grid--spacing-xs {
  gap: var(--void-spacing-1);
}
.void-grid--spacing-sm {
  gap: var(--void-spacing-2);
}
.void-grid--spacing-md {
  gap: var(--void-spacing-4);
}
.void-grid--spacing-lg {
  gap: var(--void-spacing-6);
}
.void-grid--spacing-xl {
  gap: var(--void-spacing-8);
}

/* Grid item spans */
.void-grid-item--span-1 {
  grid-column: span 1;
}
.void-grid-item--span-2 {
  grid-column: span 2;
}
.void-grid-item--span-3 {
  grid-column: span 3;
}
.void-grid-item--span-4 {
  grid-column: span 4;
}
.void-grid-item--span-6 {
  grid-column: span 6;
}
.void-grid-item--span-12 {
  grid-column: span 12;
}

/* Responsive spans */
@media (min-width: 640px) {
  .void-grid-item--sm-span-1 {
    grid-column: span 1;
  }
  .void-grid-item--sm-span-2 {
    grid-column: span 2;
  }
  .void-grid-item--sm-span-3 {
    grid-column: span 3;
  }
  .void-grid-item--sm-span-4 {
    grid-column: span 4;
  }
  .void-grid-item--sm-span-6 {
    grid-column: span 6;
  }
}

@media (min-width: 768px) {
  .void-grid-item--md-span-1 {
    grid-column: span 1;
  }
  .void-grid-item--md-span-2 {
    grid-column: span 2;
  }
  .void-grid-item--md-span-3 {
    grid-column: span 3;
  }
  .void-grid-item--md-span-4 {
    grid-column: span 4;
  }
  .void-grid-item--md-span-6 {
    grid-column: span 6;
  }
}

@media (min-width: 1024px) {
  .void-grid-item--lg-span-1 {
    grid-column: span 1;
  }
  .void-grid-item--lg-span-2 {
    grid-column: span 2;
  }
  .void-grid-item--lg-span-3 {
    grid-column: span 3;
  }
  .void-grid-item--lg-span-4 {
    grid-column: span 4;
  }
  .void-grid-item--lg-span-6 {
    grid-column: span 6;
  }
}
```

Create `packages/void-components/src/Grid/index.ts`:

```typescript
export { default as Grid } from "./Component";
export { default as GridItem } from "./GridItem";
export type { GridProps, GridItemProps, GridCols, GridSpacing } from "./types";
```

### 4. Divider Component

Create `packages/void-components/src/Divider/types.ts`:

```typescript
import type { HTMLAttributes } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Visual style */
  variant?: DividerVariant;
  /** Spacing around the divider */
  spacing?: "none" | "sm" | "md" | "lg";
}
```

Create `packages/void-components/src/Divider/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { DividerProps } from "./types";

function DividerView(
  {
    orientation = "horizontal",
    variant = "solid",
    spacing = "md",
    className,
    ...props
  }: DividerProps,
  ref: ForwardedRef<HTMLHRElement>
) {
  return (
    <hr
      ref={ref}
      className={clsx(
        "void-divider",
        `void-divider--${orientation}`,
        `void-divider--${variant}`,
        `void-divider--spacing-${spacing}`,
        className
      )}
      aria-orientation={orientation}
      {...props}
    />
  );
}

export default forwardRef(DividerView);
```

Create `packages/void-components/src/Divider/Component.tsx`:

```tsx
import { forwardRef } from "react";
import DividerView from "./View";
import type { DividerProps } from "./types";

const Divider = forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  return <DividerView ref={ref} {...props} />;
});

Divider.displayName = "Divider";

export default Divider;
```

Create `packages/void-components/src/Divider/Divider.css`:

```css
.void-divider {
  border: none;
  background-color: var(--void-color-gray-700);
}

/* Orientation */
.void-divider--horizontal {
  width: 100%;
  height: 1px;
}

.void-divider--vertical {
  width: 1px;
  height: 100%;
  min-height: 1em;
}

/* Variants */
.void-divider--solid {
  background-color: var(--void-color-gray-700);
}

.void-divider--dashed {
  background: repeating-linear-gradient(
    90deg,
    var(--void-color-gray-700) 0,
    var(--void-color-gray-700) 4px,
    transparent 4px,
    transparent 8px
  );
}

.void-divider--dotted {
  background: repeating-linear-gradient(
    90deg,
    var(--void-color-gray-700) 0,
    var(--void-color-gray-700) 2px,
    transparent 2px,
    transparent 6px
  );
}

/* Spacing */
.void-divider--spacing-none.void-divider--horizontal {
  margin: 0;
}
.void-divider--spacing-sm.void-divider--horizontal {
  margin: var(--void-spacing-2) 0;
}
.void-divider--spacing-md.void-divider--horizontal {
  margin: var(--void-spacing-4) 0;
}
.void-divider--spacing-lg.void-divider--horizontal {
  margin: var(--void-spacing-8) 0;
}

.void-divider--spacing-none.void-divider--vertical {
  margin: 0;
}
.void-divider--spacing-sm.void-divider--vertical {
  margin: 0 var(--void-spacing-2);
}
.void-divider--spacing-md.void-divider--vertical {
  margin: 0 var(--void-spacing-4);
}
.void-divider--spacing-lg.void-divider--vertical {
  margin: 0 var(--void-spacing-8);
}
```

Create `packages/void-components/src/Divider/index.ts`:

```typescript
export { default as Divider } from "./Component";
export type { DividerProps, DividerOrientation, DividerVariant } from "./types";
```

### 5. Update Main Export

Add to `packages/void-components/src/index.ts`:

```typescript
// Layout components
export { Container } from "./Container";
export type { ContainerProps, ContainerSize } from "./Container";

export { Stack } from "./Stack";
export type {
  StackProps,
  StackDirection,
  StackAlign,
  StackJustify,
  StackSpacing,
} from "./Stack";

export { Grid, GridItem } from "./Grid";
export type { GridProps, GridItemProps, GridCols, GridSpacing } from "./Grid";

export { Divider } from "./Divider";
export type { DividerProps, DividerOrientation, DividerVariant } from "./Divider";
```

## Acceptance Criteria

- [ ] Container component with size variants and padding options
- [ ] Stack component supporting vertical/horizontal directions with spacing
- [ ] Grid component with responsive column support
- [ ] GridItem component with responsive span support
- [ ] Divider component with orientation and style variants
- [ ] All components use forwardRef
- [ ] All CSS uses void-tokens variables
- [ ] Responsive breakpoints: sm (640px), md (768px), lg (1024px)
- [ ] Storybook stories for each component

## Notes

- Layout components are the foundation for page structure
- Grid.Item is accessed as a static property: `<Grid.Item>`
- All components accept `as` prop for semantic HTML flexibility
- Spacing values map to void-tokens spacing scale

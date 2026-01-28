# SPEC-06: Navigation Components (void-components)

## Context

This spec adds navigation primitives to `@arcjr/void-components`. These components handle links, menus, and navigation patterns used throughout the application.

## Prerequisites

- SPEC-01 through SPEC-05 completed (build pipeline, form and layout components)

## Requirements

### 1. Link Component

Create `packages/void-components/src/Link/types.ts`:

```typescript
import type { AnchorHTMLAttributes } from "react";

export type LinkVariant = "default" | "muted" | "accent" | "nav";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual variant */
  variant?: LinkVariant;
  /** Show underline on hover only */
  underline?: "always" | "hover" | "none";
  /** External link (adds rel and target attributes) */
  external?: boolean;
  /** Disabled state */
  disabled?: boolean;
}
```

Create `packages/void-components/src/Link/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { LinkProps } from "./types";

function LinkView(
  {
    variant = "default",
    underline = "hover",
    external = false,
    disabled = false,
    className,
    children,
    href,
    ...props
  }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const externalProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={clsx(
        "void-link",
        `void-link--${variant}`,
        `void-link--underline-${underline}`,
        disabled && "void-link--disabled",
        className
      )}
      aria-disabled={disabled}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="void-link__external-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 3h5.5v5.5M9 3L3 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}

export default forwardRef(LinkView);
```

Create `packages/void-components/src/Link/Component.tsx`:

```tsx
import { forwardRef } from "react";
import LinkView from "./View";
import type { LinkProps } from "./types";

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <LinkView ref={ref} {...props} />;
});

Link.displayName = "Link";

export default Link;
```

Create `packages/void-components/src/Link/Link.css`:

```css
.void-link {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-1);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
  cursor: pointer;
}

/* Variants */
.void-link--default {
  color: var(--void-color-brand-azure);
}

.void-link--default:hover {
  color: var(--void-color-brand-violet);
}

.void-link--muted {
  color: var(--void-color-gray-400);
}

.void-link--muted:hover {
  color: var(--void-color-gray-200);
}

.void-link--accent {
  color: var(--void-color-brand-violet);
}

.void-link--accent:hover {
  color: var(--void-color-brand-azure);
}

.void-link--nav {
  color: var(--void-color-gray-300);
  font-weight: 500;
}

.void-link--nav:hover {
  color: var(--void-color-base-white);
}

/* Underline */
.void-link--underline-always {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.void-link--underline-hover:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.void-link--underline-none {
  text-decoration: none;
}

.void-link--underline-none:hover {
  text-decoration: none;
}

/* Disabled */
.void-link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* External icon */
.void-link__external-icon {
  flex-shrink: 0;
  opacity: 0.7;
}
```

Create `packages/void-components/src/Link/index.ts`:

```typescript
export { default as Link } from "./Component";
export type { LinkProps, LinkVariant } from "./types";
```

### 2. NavLink Component

Create `packages/void-components/src/NavLink/types.ts`:

```typescript
import type { AnchorHTMLAttributes } from "react";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether the link is currently active */
  active?: boolean;
  /** Visual indicator style when active */
  activeIndicator?: "underline" | "background" | "border" | "none";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}
```

Create `packages/void-components/src/NavLink/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { NavLinkProps } from "./types";

function NavLinkView(
  {
    active = false,
    activeIndicator = "underline",
    size = "md",
    icon,
    disabled = false,
    className,
    children,
    href,
    ...props
  }: NavLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={clsx(
        "void-nav-link",
        `void-nav-link--${size}`,
        `void-nav-link--indicator-${activeIndicator}`,
        active && "void-nav-link--active",
        disabled && "void-nav-link--disabled",
        className
      )}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <span className="void-nav-link__icon">{icon}</span>}
      <span className="void-nav-link__text">{children}</span>
    </a>
  );
}

export default forwardRef(NavLinkView);
```

Create `packages/void-components/src/NavLink/Component.tsx`:

```tsx
import { forwardRef } from "react";
import NavLinkView from "./View";
import type { NavLinkProps } from "./types";

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  return <NavLinkView ref={ref} {...props} />;
});

NavLink.displayName = "NavLink";

export default NavLink;
```

Create `packages/void-components/src/NavLink/NavLink.css`:

```css
.void-nav-link {
  display: inline-flex;
  align-items: center;
  gap: var(--void-spacing-2);
  text-decoration: none;
  color: var(--void-color-gray-400);
  font-weight: 500;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease),
    background-color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
  cursor: pointer;
  position: relative;
}

.void-nav-link:hover {
  color: var(--void-color-base-white);
}

/* Sizes */
.void-nav-link--sm {
  font-size: 0.875rem;
  padding: var(--void-spacing-1) var(--void-spacing-2);
}

.void-nav-link--md {
  font-size: 1rem;
  padding: var(--void-spacing-2) var(--void-spacing-3);
}

.void-nav-link--lg {
  font-size: 1.125rem;
  padding: var(--void-spacing-3) var(--void-spacing-4);
}

/* Active states by indicator type */
.void-nav-link--active {
  color: var(--void-color-base-white);
}

/* Underline indicator */
.void-nav-link--indicator-underline::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--void-color-brand-violet);
  transition: width var(--void-transition-duration-fast) var(--void-transition-easing-ease),
    left var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.void-nav-link--indicator-underline.void-nav-link--active::after,
.void-nav-link--indicator-underline:hover::after {
  width: 100%;
  left: 0;
}

/* Background indicator */
.void-nav-link--indicator-background.void-nav-link--active {
  background-color: var(--void-color-gray-800);
  border-radius: var(--void-border-radius-md);
}

.void-nav-link--indicator-background:hover {
  background-color: var(--void-color-gray-800);
  border-radius: var(--void-border-radius-md);
}

/* Border indicator */
.void-nav-link--indicator-border {
  border-left: 2px solid transparent;
}

.void-nav-link--indicator-border.void-nav-link--active {
  border-left-color: var(--void-color-brand-violet);
}

/* Disabled */
.void-nav-link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Icon */
.void-nav-link__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

Create `packages/void-components/src/NavLink/index.ts`:

```typescript
export { default as NavLink } from "./Component";
export type { NavLinkProps } from "./types";
```

### 3. Breadcrumb Component

Create `packages/void-components/src/Breadcrumb/types.ts`:

```typescript
import type { HTMLAttributes } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator between items */
  separator?: React.ReactNode;
  /** Max items to show (uses ellipsis for overflow) */
  maxItems?: number;
}
```

Create `packages/void-components/src/Breadcrumb/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import type { BreadcrumbProps, BreadcrumbItem } from "./types";

const DefaultSeparator = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function BreadcrumbView(
  {
    items,
    separator = <DefaultSeparator />,
    maxItems,
    className,
    ...props
  }: BreadcrumbProps,
  ref: ForwardedRef<HTMLElement>
) {
  let displayItems = items;

  // Handle overflow with ellipsis
  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [
      firstItem,
      { label: "...", href: undefined, active: false },
      ...lastItems,
    ];
  }

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={clsx("void-breadcrumb", className)}
      {...props}
    >
      <ol className="void-breadcrumb__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <li key={index} className="void-breadcrumb__item">
              {isEllipsis ? (
                <span className="void-breadcrumb__ellipsis">{item.label}</span>
              ) : item.href && !item.active ? (
                <a href={item.href} className="void-breadcrumb__link">
                  {item.label}
                </a>
              ) : (
                <span
                  className={clsx(
                    "void-breadcrumb__text",
                    item.active && "void-breadcrumb__text--active"
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="void-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default forwardRef(BreadcrumbView);
```

Create `packages/void-components/src/Breadcrumb/Component.tsx`:

```tsx
import { forwardRef } from "react";
import BreadcrumbView from "./View";
import type { BreadcrumbProps } from "./types";

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => {
  return <BreadcrumbView ref={ref} {...props} />;
});

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
```

Create `packages/void-components/src/Breadcrumb/Breadcrumb.css`:

```css
.void-breadcrumb {
  font-size: 0.875rem;
}

.void-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--void-spacing-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.void-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-1);
}

.void-breadcrumb__link {
  color: var(--void-color-gray-400);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.void-breadcrumb__link:hover {
  color: var(--void-color-brand-azure);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.void-breadcrumb__text {
  color: var(--void-color-gray-500);
}

.void-breadcrumb__text--active {
  color: var(--void-color-base-white);
  font-weight: 500;
}

.void-breadcrumb__ellipsis {
  color: var(--void-color-gray-500);
}

.void-breadcrumb__separator {
  display: flex;
  align-items: center;
  color: var(--void-color-gray-600);
}
```

Create `packages/void-components/src/Breadcrumb/index.ts`:

```typescript
export { default as Breadcrumb } from "./Component";
export type { BreadcrumbProps, BreadcrumbItem } from "./types";
```

### 4. Menu Component

Create `packages/void-components/src/Menu/types.ts`:

```typescript
import type { HTMLAttributes, ReactNode } from "react";

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  items?: MenuItem[]; // For nested menus
}

export interface MenuProps extends HTMLAttributes<HTMLElement> {
  /** Menu items */
  items: MenuItem[];
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Callback when item is clicked */
  onItemClick?: (item: MenuItem) => void;
}

export interface MenuItemProps {
  item: MenuItem;
  size?: "sm" | "md" | "lg";
  onClick?: (item: MenuItem) => void;
}
```

Create `packages/void-components/src/Menu/MenuItem.tsx`:

```tsx
import { memo } from "react";
import clsx from "clsx";
import type { MenuItemProps } from "./types";

function MenuItemView({ item, size = "md", onClick }: MenuItemProps) {
  if (item.divider) {
    return <li className="void-menu__divider" role="separator" />;
  }

  const handleClick = () => {
    if (!item.disabled && onClick) {
      onClick(item);
    }
  };

  const content = (
    <>
      {item.icon && <span className="void-menu-item__icon">{item.icon}</span>}
      <span className="void-menu-item__label">{item.label}</span>
    </>
  );

  const itemClasses = clsx(
    "void-menu-item",
    `void-menu-item--${size}`,
    item.disabled && "void-menu-item--disabled"
  );

  if (item.href && !item.disabled) {
    return (
      <li role="none">
        <a
          href={item.href}
          className={itemClasses}
          role="menuitem"
          onClick={handleClick}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li role="none">
      <button
        type="button"
        className={itemClasses}
        role="menuitem"
        disabled={item.disabled}
        onClick={handleClick}
      >
        {content}
      </button>
    </li>
  );
}

export default memo(MenuItemView);
```

Create `packages/void-components/src/Menu/View.tsx`:

```tsx
import { forwardRef, type ForwardedRef } from "react";
import clsx from "clsx";
import MenuItem from "./MenuItem";
import type { MenuProps } from "./types";

function MenuView(
  {
    items,
    orientation = "vertical",
    size = "md",
    onItemClick,
    className,
    ...props
  }: MenuProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <nav
      ref={ref}
      className={clsx(
        "void-menu",
        `void-menu--${orientation}`,
        `void-menu--${size}`,
        className
      )}
      {...props}
    >
      <ul className="void-menu__list" role="menu">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            size={size}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}

export default forwardRef(MenuView);
```

Create `packages/void-components/src/Menu/Component.tsx`:

```tsx
import { forwardRef } from "react";
import MenuView from "./View";
import type { MenuProps } from "./types";

const Menu = forwardRef<HTMLElement, MenuProps>((props, ref) => {
  return <MenuView ref={ref} {...props} />;
});

Menu.displayName = "Menu";

export default Menu;
```

Create `packages/void-components/src/Menu/Menu.css`:

```css
.void-menu {
  width: 100%;
}

.void-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

/* Orientation */
.void-menu--vertical .void-menu__list {
  flex-direction: column;
}

.void-menu--horizontal .void-menu__list {
  flex-direction: row;
  align-items: center;
}

/* Menu item */
.void-menu-item {
  display: flex;
  align-items: center;
  gap: var(--void-spacing-2);
  width: 100%;
  text-align: left;
  text-decoration: none;
  color: var(--void-color-gray-300);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease),
    background-color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.void-menu-item:hover {
  color: var(--void-color-base-white);
  background-color: var(--void-color-gray-800);
}

/* Sizes */
.void-menu-item--sm {
  padding: var(--void-spacing-1) var(--void-spacing-2);
  font-size: 0.875rem;
}

.void-menu-item--md {
  padding: var(--void-spacing-2) var(--void-spacing-3);
  font-size: 1rem;
}

.void-menu-item--lg {
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 1.125rem;
}

/* Horizontal specific */
.void-menu--horizontal .void-menu-item {
  width: auto;
  border-radius: var(--void-border-radius-md);
}

/* Vertical specific */
.void-menu--vertical .void-menu-item {
  border-radius: var(--void-border-radius-sm);
}

/* Disabled */
.void-menu-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Icon */
.void-menu-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25em;
  height: 1.25em;
}

/* Divider */
.void-menu__divider {
  height: 1px;
  margin: var(--void-spacing-2) 0;
  background-color: var(--void-color-gray-700);
}

.void-menu--horizontal .void-menu__divider {
  width: 1px;
  height: 1.5em;
  margin: 0 var(--void-spacing-2);
}
```

Create `packages/void-components/src/Menu/index.ts`:

```typescript
export { default as Menu } from "./Component";
export { default as MenuItem } from "./MenuItem";
export type { MenuProps, MenuItem as MenuItemType, MenuItemProps } from "./types";
```

### 5. Update Main Export

Add to `packages/void-components/src/index.ts`:

```typescript
// Navigation components
export { Link } from "./Link";
export type { LinkProps, LinkVariant } from "./Link";

export { NavLink } from "./NavLink";
export type { NavLinkProps } from "./NavLink";

export { Breadcrumb } from "./Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./Breadcrumb";

export { Menu, MenuItem } from "./Menu";
export type { MenuProps, MenuItemType, MenuItemProps } from "./Menu";
```

### 6. Create Storybook Stories

Create `packages/void-components/src/Link/Link.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import Link from "./Component";

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "accent", "nav"],
    },
    underline: {
      control: "select",
      options: ["always", "hover", "none"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    children: "Click me",
    href: "#",
  },
};

export const External: Story = {
  args: {
    children: "External link",
    href: "https://example.com",
    external: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Link href="#" variant="default">Default</Link>
      <Link href="#" variant="muted">Muted</Link>
      <Link href="#" variant="accent">Accent</Link>
      <Link href="#" variant="nav">Nav</Link>
    </div>
  ),
};
```

## Acceptance Criteria

- [ ] Link component with variants, underline options, external link support
- [ ] NavLink component with active state indicators
- [ ] Breadcrumb component with separator and overflow handling
- [ ] Menu component with horizontal/vertical orientations
- [ ] All components use forwardRef
- [ ] All CSS uses void-tokens variables
- [ ] Proper ARIA attributes for accessibility
- [ ] Storybook stories for each component
- [ ] `bun run build` completes without errors

## Notes

- Link is for general anchor elements
- NavLink is specifically for navigation with active states
- These components are building blocks for V2 Header/Footer
- Menu supports nested items (though not fully implemented in this spec)
- Consider integration with React Router's NavLink in app layer

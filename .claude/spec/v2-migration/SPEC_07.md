# SPEC-07: V2 Header Component

## Context

This spec refines the existing V2 Header component with responsive navigation, blur effects, animations, and improved accessibility. The Header serves as the primary navigation for all V2 pages.

## Prerequisites

- SPEC-01 through SPEC-06 completed (design system components available)
- Existing V2 Header component in `apps/web/src/components/v2/Header/`
- Tailwind utilities available from void-css

## Requirements

### 1. Header Component Types

Create `apps/web/src/components/v2/Header/types.ts`:

```typescript
export interface V2HeaderProps {
  /** Whether header should start transparent (for hero pages) */
  transparent?: boolean;
  /** Custom className for additional styling */
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface V2HeaderViewProps extends V2HeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  navigationItems: NavigationItem[];
  onToggleMobileMenu: () => void;
}
```

### 2. Header View Component

Create `apps/web/src/components/v2/Header/View.tsx`:

```tsx
import { memo } from "react";
import { Link, NavLink } from "react-router";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import type { V2HeaderViewProps } from "./types";

function V2HeaderView({
  transparent = false,
  className,
  isScrolled,
  isMobileMenuOpen,
  navigationItems,
  onToggleMobileMenu,
}: V2HeaderViewProps) {
  const showBackground = !transparent || isScrolled;

  return (
    <header
      className={clsx(
        "v2-header",
        showBackground && "v2-header--scrolled",
        isMobileMenuOpen && "v2-header--menu-open",
        className
      )}
    >
      <div className="v2-header__container">
        <div className="v2-header__content">
          {/* Logo */}
          <Link to="/" className="v2-header__logo" aria-label="Home">
            <span className="v2-header__logo-text">Arc-Jr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="v2-header__nav" aria-label="Primary navigation">
            <ul className="v2-header__nav-list">
              {navigationItems.map((item) => (
                <li key={item.href} className="v2-header__nav-item">
                  {item.external ? (
                    <a
                      href={item.href}
                      className="v2-header__nav-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        clsx(
                          "v2-header__nav-link",
                          isActive && "v2-header__nav-link--active"
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="v2-header__mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={onToggleMobileMenu}
          >
            <span className="v2-header__hamburger">
              <span className="v2-header__hamburger-line" />
              <span className="v2-header__hamburger-line" />
              <span className="v2-header__hamburger-line" />
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            className="v2-header__mobile-menu"
            aria-label="Mobile navigation"
          >
            <ul className="v2-header__mobile-list">
              {navigationItems.map((item) => (
                <li key={item.href} className="v2-header__mobile-item">
                  {item.external ? (
                    <a
                      href={item.href}
                      className="v2-header__mobile-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onToggleMobileMenu}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        clsx(
                          "v2-header__mobile-link",
                          isActive && "v2-header__mobile-link--active"
                        )
                      }
                      onClick={onToggleMobileMenu}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default pipeline(memo)(V2HeaderView);
```

### 3. Header Container Component

Create `apps/web/src/components/v2/Header/Component.tsx`:

```tsx
import { useState, useEffect, memo, useCallback } from "react";

import { pipeline } from "@/utils/pipeline";
import V2HeaderView from "./View";
import type { V2HeaderProps, NavigationItem } from "./types";

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SCROLL_THRESHOLD = 20;

function V2Header(props: V2HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <V2HeaderView
      {...props}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      navigationItems={NAVIGATION_ITEMS}
      onToggleMobileMenu={handleToggleMobileMenu}
    />
  );
}

export default pipeline(memo)(V2Header);
```

### 4. Header Styles

Create `apps/web/public/css/components/v2-header.css`:

```css
/**
 * V2 Header Component
 * Responsive navigation with blur effect and animations
 */

.v2-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color var(--void-transition-duration-normal)
      var(--void-transition-easing-ease),
    backdrop-filter var(--void-transition-duration-normal)
      var(--void-transition-easing-ease),
    box-shadow var(--void-transition-duration-normal)
      var(--void-transition-easing-ease);
}

.v2-header--scrolled {
  background-color: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

.v2-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--void-spacing-4);
}

.v2-header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

/* Logo */
.v2-header__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--void-color-base-white);
  transition: color var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-header__logo:hover {
  color: var(--void-color-brand-violet);
}

.v2-header__logo-text {
  background: linear-gradient(
    135deg,
    var(--void-color-brand-violet),
    var(--void-color-brand-azure)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Desktop Navigation */
.v2-header__nav {
  display: none;
}

@media (min-width: 768px) {
  .v2-header__nav {
    display: block;
  }
}

.v2-header__nav-list {
  display: flex;
  gap: var(--void-spacing-6);
  list-style: none;
  margin: 0;
  padding: 0;
}

.v2-header__nav-item {
  position: relative;
}

.v2-header__nav-link {
  display: inline-block;
  padding: var(--void-spacing-2) 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-header__nav-link:hover {
  color: var(--void-color-base-white);
}

.v2-header__nav-link--active {
  color: var(--void-color-brand-violet);
  position: relative;
}

.v2-header__nav-link--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--void-color-brand-violet),
    var(--void-color-brand-azure)
  );
  border-radius: var(--void-border-radius-full);
}

/* Mobile Menu Button */
.v2-header__mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--void-color-base-white);
  transition: color var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

@media (min-width: 768px) {
  .v2-header__mobile-toggle {
    display: none;
  }
}

.v2-header__mobile-toggle:hover {
  color: var(--void-color-brand-violet);
}

.v2-header__hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
  height: 18px;
}

.v2-header__hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  border-radius: var(--void-border-radius-full);
  transition: transform var(--void-transition-duration-fast)
      var(--void-transition-easing-ease),
    opacity var(--void-transition-duration-fast)
      var(--void-transition-easing-ease);
}

.v2-header--menu-open .v2-header__hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.v2-header--menu-open .v2-header__hamburger-line:nth-child(2) {
  opacity: 0;
}

.v2-header--menu-open .v2-header__hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu */
.v2-header__mobile-menu {
  padding: var(--void-spacing-4) 0 var(--void-spacing-6);
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-800);
  animation: slide-down var(--void-transition-duration-normal)
    var(--void-transition-easing-ease);
}

@media (min-width: 768px) {
  .v2-header__mobile-menu {
    display: none;
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v2-header__mobile-list {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.v2-header__mobile-link {
  display: block;
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 1rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
  text-decoration: none;
  border-radius: var(--void-border-radius-md);
  transition: background-color var(--void-transition-duration-fast)
      var(--void-transition-easing-ease),
    color var(--void-transition-duration-fast)
      var(--void-transition-easing-ease);
}

.v2-header__mobile-link:hover {
  background-color: var(--void-color-gray-900);
  color: var(--void-color-base-white);
}

.v2-header__mobile-link--active {
  background-color: rgba(139, 92, 246, 0.15);
  color: var(--void-color-brand-violet);
}
```

### 5. Update Header Index Export

Update `apps/web/src/components/v2/Header/index.ts`:

```typescript
export { default as V2Header } from "./Component";
export type { V2HeaderProps, NavigationItem } from "./types";
```

## Acceptance Criteria

- [ ] Header is fixed at top with smooth scroll-based background transition
- [ ] Blur effect applies when scrolled (backdrop-filter)
- [ ] Desktop navigation shows on screens ≥768px
- [ ] Mobile menu toggles with hamburger button
- [ ] Active navigation link has visual indicator
- [ ] All links navigate correctly with React Router
- [ ] Mobile menu closes when route changes
- [ ] Animations respect `prefers-reduced-motion`
- [ ] ARIA attributes properly set for accessibility
- [ ] Logo gradient uses brand colors

## Notes

- Transparent header option for hero pages
- Scroll threshold of 20px before background appears
- Mobile menu uses slide-down animation
- Hamburger transforms to X when menu open
- NavLink component handles active state automatically
- External links open in new tab with proper rel attributes

## Verification

```bash
# Test in browser
bun run dev
# Navigate to http://localhost:3000/v2
# Scroll page and verify blur effect
# Toggle mobile menu on narrow viewport
# Check navigation highlighting
```

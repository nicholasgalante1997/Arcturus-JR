# SPEC-08: V2 Footer Component

## Context

This spec creates the V2 Footer component with navigation links, social media links, copyright information, and responsive layout. The Footer completes the V2 application shell alongside the Header.

## Prerequisites

- SPEC-01 through SPEC-06 completed (design system components available)
- SPEC-07 completed (Header component for consistency)
- Tailwind utilities available from void-css

## Requirements

### 1. Footer Component Types

Create `apps/web/src/components/v2/Footer/types.ts`:

```typescript
export interface V2FooterProps {
  /** Custom className for additional styling */
  className?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}
```

### 2. Social Icons Component

Create `apps/web/src/components/v2/Footer/SocialIcons.tsx`:

```tsx
import { memo } from "react";
import type { SocialLink } from "./types";

interface SocialIconsProps {
  links: SocialLink[];
}

function SocialIcons({ links }: SocialIconsProps) {
  return (
    <div className="v2-footer__social">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="v2-footer__social-link"
          aria-label={link.ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

export default memo(SocialIcons);
```

### 3. Footer View Component

Create `apps/web/src/components/v2/Footer/View.tsx`:

```tsx
import { memo } from "react";
import { Link } from "react-router";
import clsx from "clsx";

import { pipeline } from "@/utils/pipeline";
import SocialIcons from "./SocialIcons";
import type { V2FooterProps, FooterSection, SocialLink } from "./types";

// GitHub Icon
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Twitter Icon
const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Posts", href: "/posts" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Documentation", href: "/docs" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: <GitHubIcon />,
    ariaLabel: "Visit our GitHub profile",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <TwitterIcon />,
    ariaLabel: "Follow us on Twitter",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: <LinkedInIcon />,
    ariaLabel: "Connect on LinkedIn",
  },
];

function V2FooterView({ className }: V2FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={clsx("v2-footer", className)}>
      <div className="v2-footer__container">
        {/* Top Section */}
        <div className="v2-footer__top">
          {/* Brand */}
          <div className="v2-footer__brand">
            <Link to="/" className="v2-footer__logo">
              <span className="v2-footer__logo-text">Arc-Jr</span>
            </Link>
            <p className="v2-footer__tagline">
              Building the future with React, TypeScript, and modern web
              technologies.
            </p>
            <SocialIcons links={SOCIAL_LINKS} />
          </div>

          {/* Navigation Sections */}
          <div className="v2-footer__sections">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="v2-footer__section">
                <h3 className="v2-footer__section-title">{section.title}</h3>
                <ul className="v2-footer__link-list">
                  {section.links.map((link) => (
                    <li key={link.href} className="v2-footer__link-item">
                      {link.external ? (
                        <a
                          href={link.href}
                          className="v2-footer__link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="v2-footer__link">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="v2-footer__bottom">
          <p className="v2-footer__copyright">
            © {currentYear} Arc-Jr. All rights reserved.
          </p>
          <p className="v2-footer__attribution">
            Built with{" "}
            <span className="v2-footer__heart" aria-label="love">
              ♥
            </span>{" "}
            using React 19 and Bun
          </p>
        </div>
      </div>
    </footer>
  );
}

export default pipeline(memo)(V2FooterView);
```

### 4. Footer Container Component

Create `apps/web/src/components/v2/Footer/Component.tsx`:

```tsx
import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import V2FooterView from "./View";
import type { V2FooterProps } from "./types";

function V2Footer(props: V2FooterProps) {
  return <V2FooterView {...props} />;
}

export default pipeline(memo)(V2Footer);
```

### 5. Footer Styles

Create `apps/web/public/css/components/v2-footer.css`:

```css
/**
 * V2 Footer Component
 * Responsive footer with navigation, social links, and copyright
 */

.v2-footer {
  background-color: var(--void-color-gray-950);
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-900);
  margin-top: auto;
}

.v2-footer__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--void-spacing-12) var(--void-spacing-4);
}

/* Top Section */
.v2-footer__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--void-spacing-8);
  padding-bottom: var(--void-spacing-8);
  border-bottom: var(--void-border-width-thin) solid var(--void-color-gray-900);
}

@media (min-width: 768px) {
  .v2-footer__top {
    grid-template-columns: 2fr 3fr;
  }
}

/* Brand */
.v2-footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-4);
}

.v2-footer__logo {
  display: inline-block;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  width: fit-content;
}

.v2-footer__logo-text {
  background: linear-gradient(
    135deg,
    var(--void-color-brand-violet),
    var(--void-color-brand-azure)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.v2-footer__tagline {
  max-width: 300px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--void-color-gray-400);
  margin: 0;
}

/* Social Links */
.v2-footer__social {
  display: flex;
  gap: var(--void-spacing-3);
}

.v2-footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--void-color-gray-400);
  background-color: var(--void-color-gray-900);
  border-radius: var(--void-border-radius-md);
  transition: all var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-footer__social-link:hover {
  color: var(--void-color-base-white);
  background-color: var(--void-color-brand-violet);
  transform: translateY(-2px);
}

/* Navigation Sections */
.v2-footer__sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--void-spacing-6);
}

@media (min-width: 768px) {
  .v2-footer__sections {
    grid-template-columns: repeat(2, 1fr);
  }
}

.v2-footer__section {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-3);
}

.v2-footer__section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--void-color-base-white);
  margin: 0;
}

.v2-footer__link-list {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.v2-footer__link {
  font-size: 0.875rem;
  color: var(--void-color-gray-400);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast)
    var(--void-transition-easing-ease);
}

.v2-footer__link:hover {
  color: var(--void-color-brand-azure);
}

/* Bottom Section */
.v2-footer__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--void-spacing-2);
  padding-top: var(--void-spacing-6);
  text-align: center;
}

@media (min-width: 768px) {
  .v2-footer__bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
}

.v2-footer__copyright,
.v2-footer__attribution {
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
  margin: 0;
}

.v2-footer__heart {
  color: var(--void-color-semantic-error);
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  10%,
  30% {
    transform: scale(1.1);
  }
  20%,
  40% {
    transform: scale(0.9);
  }
}

@media (prefers-reduced-motion: reduce) {
  .v2-footer__heart {
    animation: none;
  }
}
```

### 6. Update Footer Index Export

Create `apps/web/src/components/v2/Footer/index.ts`:

```typescript
export { default as V2Footer } from "./Component";
export type { V2FooterProps, FooterLink, FooterSection, SocialLink } from "./types";
```

## Acceptance Criteria

- [ ] Footer displays at bottom of all V2 pages
- [ ] Grid layout responsive at different breakpoints
- [ ] Brand section includes logo, tagline, and social links
- [ ] Navigation sections organized and properly linked
- [ ] Social links open in new tab with proper rel attributes
- [ ] Copyright year updates automatically
- [ ] Heart animation respects `prefers-reduced-motion`
- [ ] All links navigate correctly
- [ ] Hover effects smooth and consistent
- [ ] Proper semantic HTML (footer, nav, lists)

## Notes

- Footer uses CSS Grid for responsive layout
- Social icons are inline SVGs for performance
- Current year calculated dynamically in component
- External links have target="_blank" and rel="noopener noreferrer"
- Heart animation adds personality without distraction
- Footer sections can be customized via FOOTER_SECTIONS constant
- Social links array makes it easy to add/remove platforms

## Verification

```bash
# Test in browser
bun run dev
# Navigate to http://localhost:3000/v2
# Scroll to bottom of page
# Verify all links work
# Test on mobile viewport
# Check hover states and animations
```

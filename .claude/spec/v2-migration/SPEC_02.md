# SPEC-02: void-css Module Expansion

## Context

This spec expands the `@arcjr/void-css` package with comprehensive CSS utilities, resets, and base styles that work alongside Tailwind. The goal is to provide a complete CSS foundation for the V2 design system.

## Prerequisites

- SPEC-01 completed (Tailwind v4 integration working)
- `@arcjr/void-tokens` built and accessible

## Requirements

### 1. CSS Reset Module

Update `packages/void-css/css/void-reset.css`:

```css
/**
 * Void CSS Reset
 * A modern, minimal CSS reset for the Void design system
 */

/* Box sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margins and paddings */
* {
  margin: 0;
  padding: 0;
}

/* Prevent font size inflation */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* Remove list styles */
ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Core body defaults */
body {
  min-height: 100vh;
  line-height: 1.6;
}

/* Set shorter line heights on headings */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  text-wrap: balance;
}

/* A elements without class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

/* Responsive images */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Textarea default */
textarea:not([rows]) {
  min-height: 10em;
}

/* Anchor target scroll margin */
:target {
  scroll-margin-block: 5ex;
}

/* Remove animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2. Base Styles Module

Update `packages/void-css/css/void-base.css`:

```css
/**
 * Void Base Styles
 * Foundation styles that build on the reset
 */

@import "./void-reset.css";

:root {
  /* Import all void tokens */
  color-scheme: dark;
}

html {
  font-family: var(--void-font-family-base);
  font-size: 16px;
  background-color: var(--void-color-base-black);
  color: var(--void-color-base-white);
  scroll-behavior: smooth;
}

body {
  font-size: 1rem;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography Scale */
h1 {
  font-size: var(--void-font-size-5xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--void-font-size-4xl);
  font-weight: 700;
  letter-spacing: -0.01em;
}

h3 {
  font-size: var(--void-font-size-3xl);
  font-weight: 600;
}

h4 {
  font-size: var(--void-font-size-2xl);
  font-weight: 600;
}

h5 {
  font-size: var(--void-font-size-xl);
  font-weight: 600;
}

h6 {
  font-size: var(--void-font-size-lg);
  font-weight: 600;
}

p {
  margin-bottom: 1em;
}

/* Links */
a {
  color: var(--void-color-brand-azure);
  text-decoration: none;
  transition: color var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

a:hover {
  color: var(--void-color-brand-violet);
  text-decoration: underline;
}

/* Code */
code,
kbd,
samp,
pre {
  font-family: var(--void-font-family-mono);
  font-size: 0.875em;
}

code {
  background-color: var(--void-color-gray-800);
  padding: 0.125em 0.375em;
  border-radius: var(--void-border-radius-sm);
}

pre {
  background-color: var(--void-color-gray-900);
  padding: var(--void-spacing-4);
  border-radius: var(--void-border-radius-md);
  overflow-x: auto;
}

pre code {
  background-color: transparent;
  padding: 0;
}

/* Selection */
::selection {
  background-color: var(--void-color-brand-violet);
  color: var(--void-color-base-white);
}

/* Focus */
:focus-visible {
  outline: var(--void-border-width-medium) solid var(--void-color-brand-violet);
  outline-offset: 2px;
}

/* Horizontal rule */
hr {
  border: none;
  border-top: var(--void-border-width-thin) solid var(--void-color-gray-700);
  margin: var(--void-spacing-8) 0;
}

/* Blockquote */
blockquote {
  border-left: var(--void-border-width-thick) solid var(--void-color-brand-violet);
  padding-left: var(--void-spacing-4);
  margin: var(--void-spacing-4) 0;
  font-style: italic;
  color: var(--void-color-gray-300);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--void-spacing-3) var(--void-spacing-4);
  text-align: left;
  border-bottom: var(--void-border-width-thin) solid var(--void-color-gray-700);
}

th {
  font-weight: 600;
  color: var(--void-color-gray-300);
}
```

### 3. Layout Utilities Module

Create `packages/void-css/css/void-layout.css`:

```css
/**
 * Void Layout Utilities
 * Container, grid, and spacing utilities
 */

/* Container */
.void-container {
  width: 100%;
  max-width: var(--void-container-max-width, 1280px);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--void-spacing-4);
  padding-right: var(--void-spacing-4);
}

@media (min-width: 640px) {
  .void-container {
    padding-left: var(--void-spacing-6);
    padding-right: var(--void-spacing-6);
  }
}

@media (min-width: 1024px) {
  .void-container {
    padding-left: var(--void-spacing-8);
    padding-right: var(--void-spacing-8);
  }
}

/* Container sizes */
.void-container--sm {
  --void-container-max-width: 640px;
}

.void-container--md {
  --void-container-max-width: 768px;
}

.void-container--lg {
  --void-container-max-width: 1024px;
}

.void-container--xl {
  --void-container-max-width: 1280px;
}

.void-container--2xl {
  --void-container-max-width: 1536px;
}

.void-container--full {
  --void-container-max-width: 100%;
}

/* Stack (vertical spacing) */
.void-stack {
  display: flex;
  flex-direction: column;
}

.void-stack--gap-1 { gap: var(--void-spacing-1); }
.void-stack--gap-2 { gap: var(--void-spacing-2); }
.void-stack--gap-3 { gap: var(--void-spacing-3); }
.void-stack--gap-4 { gap: var(--void-spacing-4); }
.void-stack--gap-6 { gap: var(--void-spacing-6); }
.void-stack--gap-8 { gap: var(--void-spacing-8); }
.void-stack--gap-12 { gap: var(--void-spacing-12); }
.void-stack--gap-16 { gap: var(--void-spacing-16); }

/* Row (horizontal layout) */
.void-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.void-row--nowrap {
  flex-wrap: nowrap;
}

.void-row--gap-1 { gap: var(--void-spacing-1); }
.void-row--gap-2 { gap: var(--void-spacing-2); }
.void-row--gap-3 { gap: var(--void-spacing-3); }
.void-row--gap-4 { gap: var(--void-spacing-4); }
.void-row--gap-6 { gap: var(--void-spacing-6); }
.void-row--gap-8 { gap: var(--void-spacing-8); }

/* Alignment */
.void-row--center { justify-content: center; align-items: center; }
.void-row--between { justify-content: space-between; }
.void-row--around { justify-content: space-around; }
.void-row--evenly { justify-content: space-evenly; }
.void-row--start { justify-content: flex-start; }
.void-row--end { justify-content: flex-end; }

.void-items-start { align-items: flex-start; }
.void-items-center { align-items: center; }
.void-items-end { align-items: flex-end; }
.void-items-stretch { align-items: stretch; }

/* Grid */
.void-grid {
  display: grid;
  gap: var(--void-spacing-4);
}

.void-grid--cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.void-grid--cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.void-grid--cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.void-grid--cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.void-grid--cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.void-grid--cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* Responsive grid */
@media (min-width: 640px) {
  .void-grid--sm-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .void-grid--sm-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .void-grid--sm-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .void-grid--md-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .void-grid--md-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .void-grid--md-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .void-grid--lg-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .void-grid--lg-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .void-grid--lg-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Visibility */
.void-hidden { display: none !important; }
.void-visible { visibility: visible; }
.void-invisible { visibility: hidden; }

@media (max-width: 639px) {
  .void-hidden--sm-down { display: none !important; }
}

@media (min-width: 640px) {
  .void-hidden--sm-up { display: none !important; }
}

@media (max-width: 767px) {
  .void-hidden--md-down { display: none !important; }
}

@media (min-width: 768px) {
  .void-hidden--md-up { display: none !important; }
}

@media (max-width: 1023px) {
  .void-hidden--lg-down { display: none !important; }
}

@media (min-width: 1024px) {
  .void-hidden--lg-up { display: none !important; }
}
```

### 4. Form Styles Module

Create `packages/void-css/css/void-forms.css`:

```css
/**
 * Void Form Styles
 * Base styles for form elements
 */

/* Input base */
.void-input {
  display: block;
  width: 100%;
  padding: var(--void-spacing-2) var(--void-spacing-3);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--void-color-base-white);
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  border-radius: var(--void-border-radius-md);
  transition: border-color var(--void-transition-duration-fast) var(--void-transition-easing-ease),
              box-shadow var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.void-input::placeholder {
  color: var(--void-color-gray-500);
}

.void-input:hover {
  border-color: var(--void-color-gray-600);
}

.void-input:focus {
  outline: none;
  border-color: var(--void-color-brand-violet);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

.void-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input sizes */
.void-input--sm {
  padding: var(--void-spacing-1) var(--void-spacing-2);
  font-size: 0.875rem;
}

.void-input--lg {
  padding: var(--void-spacing-3) var(--void-spacing-4);
  font-size: 1.125rem;
}

/* Input states */
.void-input--error {
  border-color: var(--void-color-semantic-error);
}

.void-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

.void-input--success {
  border-color: var(--void-color-semantic-success);
}

/* Textarea */
.void-textarea {
  min-height: 120px;
  resize: vertical;
}

/* Select */
.void-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right var(--void-spacing-2) center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: var(--void-spacing-10);
}

/* Checkbox and Radio */
.void-checkbox,
.void-radio {
  width: 1.25rem;
  height: 1.25rem;
  appearance: none;
  background-color: var(--void-color-gray-900);
  border: var(--void-border-width-thin) solid var(--void-color-gray-700);
  cursor: pointer;
  transition: all var(--void-transition-duration-fast) var(--void-transition-easing-ease);
}

.void-checkbox {
  border-radius: var(--void-border-radius-sm);
}

.void-radio {
  border-radius: var(--void-border-radius-full);
}

.void-checkbox:checked,
.void-radio:checked {
  background-color: var(--void-color-brand-violet);
  border-color: var(--void-color-brand-violet);
}

.void-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}

.void-radio:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}

/* Label */
.void-label {
  display: block;
  margin-bottom: var(--void-spacing-1);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--void-color-gray-300);
}

/* Helper text */
.void-helper {
  margin-top: var(--void-spacing-1);
  font-size: 0.75rem;
  color: var(--void-color-gray-500);
}

.void-helper--error {
  color: var(--void-color-semantic-error);
}

/* Form group */
.void-form-group {
  margin-bottom: var(--void-spacing-4);
}
```

### 5. Font Module

Update `packages/void-css/css/void-font.css`:

```css
/**
 * Void Font Loading
 * Inter font from Google Fonts CDN
 */

/* Preconnect hints should be in HTML head, but we can provide the imports */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Font face declarations for self-hosting (alternative) */
/* Uncomment these if you prefer self-hosted fonts */
/*
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2');
}
*/
```

### 6. Main Entry Point

Update `packages/void-css/css/void.css`:

```css
/**
 * Void CSS
 * Complete CSS foundation for the Void design system
 *
 * Import order matters:
 * 1. Tokens (CSS custom properties)
 * 2. Reset (normalize browser defaults)
 * 3. Base (typography, elements)
 * 4. Layout (containers, grids)
 * 5. Forms (inputs, buttons)
 * 6. Components (via void-components package)
 */

/* Design tokens */
@import "@arcjr/void-tokens/dist/css/void-tokens.css";

/* Font loading */
@import "./void-font.css";

/* Reset and base */
@import "./void-base.css";

/* Layout utilities */
@import "./void-layout.css";

/* Form styles */
@import "./void-forms.css";
```

### 7. Update Package Scripts

Ensure `packages/void-css/package.json` has proper build configuration:

```json
{
  "scripts": {
    "build": "bun run clean && bun run postcss:all",
    "postcss:all": "postcss ./css/*.css --dir dist --base ./css --ext .min.css",
    "postcss:watch": "postcss ./css/*.css --dir dist --base ./css --ext .min.css --watch",
    "clean": "rm -rf dist && mkdir -p dist",
    "serve:css": "bunx http-server ./dist -p 8080 --open"
  }
}
```

## Acceptance Criteria

- [ ] `void-reset.css` provides comprehensive browser normalization
- [ ] `void-base.css` establishes typography scale and element styles
- [ ] `void-layout.css` includes container, stack, row, and grid utilities
- [ ] `void-forms.css` styles all form elements consistently
- [ ] `void.css` imports all modules in correct order
- [ ] `bun run build` produces minified versions of all CSS files
- [ ] All utilities use void tokens for values (no magic numbers)
- [ ] Responsive breakpoints consistent across all utilities

## Notes

- BEM naming convention: `.void-{block}--{modifier}` or `.void-{block}__{element}`
- All colors, spacing, etc. must reference CSS custom properties
- Keep utilities minimal - prefer Tailwind for one-off styles
- Forms are styled as base classes; void-components will wrap with React

## Verification Commands

```bash
cd packages/void-css

# Clean build
bun run build

# List output files
ls -la dist/

# Check combined size
du -h dist/*.min.css

# Verify imports resolve
head -20 dist/void.min.css
```

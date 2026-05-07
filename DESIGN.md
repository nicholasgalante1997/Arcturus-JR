---
version: alpha
name: Void
description: "High-contrast dark-only design system for the Arcturus-JR technical blog. Jet-black surfaces (#000000), five vivid brand accents (azure #3a86ff, rose #ff006e, violet #8338ec, amber #ffbe0b, orange #fb5607), and a signature hover behavior — every interactive element pivots from its default color to rose (#ff006e) on hover, regardless of variant. Fira Sans at 15px base (html font-size: 15px; all rem values resolve to 15px, not the browser default of 16px). No light mode."

colors:
  # Brand primitives
  amber: "#ffbe0b"
  orange: "#fb5607"
  rose: "#ff006e"
  violet: "#8338ec"
  azure: "#3a86ff"

  # Neutral scale
  black: "#000000"
  gray-950: "#0a0a0a"
  gray-900: "#0f0f0f"
  gray-800: "#1a1a1a"
  gray-700: "#2a2a2a"
  gray-600: "#3a3a3a"
  gray-400: "#808080"
  gray-300: "#a0a0a0"
  gray-200: "#c0c0c0"
  gray-100: "#e8e8e8"
  white: "#ffffff"

  # Status (hardcoded hex in component files — no CSS variable exists for these)
  success: "#10b981"
  success-hover: "#059669"

  # Semantic intent tokens
  primary: "#3a86ff"
  primary-hover: "#ff006e"
  secondary: "#8338ec"
  accent: "#ff006e"
  warning: "#ffbe0b"
  danger: "#fb5607"
  background: "#000000"
  surface: "#0a0a0a"
  surface-raised: "#0f0f0f"
  surface-muted: "#1a1a1a"
  on-surface: "#e8e8e8"
  on-surface-strong: "#ffffff"
  on-surface-muted: "#a0a0a0"
  on-surface-subtle: "#808080"
  on-primary: "#ffffff"
  on-warning: "#000000"
  border-subtle: "#2a2a2a"
  border-default: "#3a3a3a"
  border-active: "#3a86ff"
  placeholder: "#808080"

typography:
  headline-xl:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.2
  headline-lg:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
  headline-md:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 23px
    fontWeight: 700
    lineHeight: 1.2
  headline-sm:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 19px
    fontWeight: 700
    lineHeight: 1.2
  headline-xs:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  label-strong:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
  label-sm:
    fontFamily: Fira Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.05em
  code:
    fontFamily: JetBrains Mono, Courier New, Courier, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
  code-block:
    fontFamily: JetBrains Mono, Courier New, Courier, monospace
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  none: 0
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px

components:
  # Buttons — primary (azure default)
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-active:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-disabled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"

  # Button — secondary (violet)
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-secondary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"

  # Button — outline
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-outline-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"

  # Button — ghost
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-ghost-hover:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"

  # Button — danger
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-danger-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"

  # Button — success
  button-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-success-hover:
    backgroundColor: "{colors.success-hover}"
    textColor: "{colors.on-primary}"

  # Button — size variants
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  button-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 16px 32px

  # Card
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"

  # Input / form controls
  input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  input-focus:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
  input-disabled:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
  input-error:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
  input-success:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"

  # Alerts
  alert-info:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  alert-warning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  alert-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px
  alert-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px

  # Navigation
  nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  nav-link-hover:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
  nav-link-active:
    textColor: "{colors.accent}"

  # Badges
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-warning}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px
  badge-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.xl}"
    padding: 4px 12px

  # Code
  code-inline:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.amber}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: 2px 6px
  code-block:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.primary}"
    typography: "{typography.code-block}"
    rounded: "{rounded.md}"
    padding: 16px
---

## Overview

Void is the design system for Arcturus-JR, a technical blog. It is a **dark-mode-only** system with a high-contrast aesthetic: jet-black backgrounds, five neon brand accents, and sharp typographic hierarchy purpose-built for code-heavy long-form content.

The visual personality is developer-adjacent and deliberately dramatic. Azure (`{colors.primary}`) anchors all primary actions. The defining brand signature is a system-wide hover rule: **every interactive element pivots from its default color to rose (`{colors.accent}` #ff006e) on hover**, regardless of variant. This hot-pink-on-hover is not an accident — it is the most important rule in this system.

There is no light mode, no light-mode token ladder, and no intent for one.

**Key Characteristics:**
- Jet-black canvas (`{colors.background}` #000000) with a near-black surface layer (`{colors.surface}` #0a0a0a)
- Five vivid brand accents used with strict role assignments — azure for primary, violet for secondary, rose for hover/accent, amber for warnings and inline code, orange for danger
- Fira Sans as the sole sans-serif; JetBrains Mono for all code contexts
- Root `font-size: 15px` on `<html>` — all `rem` values in this system resolve to 15px multiples, not the browser default of 16px
- Universal hover signature: every interactive state uses rose (`#ff006e`) as the background

## Colors

The palette has three tiers: five brand primitive colors, an 11-stop near-black neutral scale, and semantic intent tokens that connect the two.

### Brand Primitives

| Token | Hex | Role |
|---|---|---|
| `{colors.azure}` | #3a86ff | Primary action, links, focus rings, code block text |
| `{colors.rose}` | #ff006e | Universal hover state, active nav links, accent callouts |
| `{colors.violet}` | #8338ec | Secondary actions, h2 border decoration |
| `{colors.amber}` | #ffbe0b | Warnings, inline code text (~10:1 contrast on dark) |
| `{colors.orange}` | #fb5607 | Danger, destructive actions, blockquote left border |

### Neutral Scale

The scale runs from `{colors.black}` (#000000, page canvas) to `{colors.white}` (#ffffff, heading text). Note the jump from gray-600 to gray-400 — there is no gray-500 in this system.

- **Page canvas**: `{colors.background}` (#000000) / `{colors.surface}` (#0a0a0a)
- **Card / container backgrounds**: `{colors.surface-muted}` (#1a1a1a, forms and inputs)
- **Borders**: `{colors.border-subtle}` (#2a2a2a) for card edges, `{colors.border-default}` (#3a3a3a) for input borders
- **Text**: `{colors.on-surface}` (#e8e8e8, body) · `{colors.on-surface-strong}` (#ffffff, headings) · `{colors.on-surface-muted}` (#a0a0a0, metadata)

### Semantic Intent Tokens

Use intent tokens in all component code. The most important aliases:

- `{colors.primary}` → azure (#3a86ff) — all primary interactive elements
- `{colors.primary-hover}` → rose (#ff006e) — hover state for ALL interactive elements
- `{colors.surface}` → #0a0a0a — elevated surfaces (cards, nav bar)
- `{colors.on-primary}` → #ffffff — text on azure or violet backgrounds

### Status Colors

`{colors.success}` (#10b981) and `{colors.success-hover}` (#059669) are not defined as CSS custom properties in the token file — they are hardcoded in component files. Reference them as hex literals when needed; they cannot be consumed via CSS variables.

### Hover Rule

Every hover state in this system uses rose (`{colors.primary-hover}` #ff006e) as the background color, including the primary button (azure → rose), secondary button (violet → rose), and danger button (orange → rose). The only exceptions are the success button (green → `{colors.success-hover}` #059669) and the outline button (transparent → azure on hover).

## Typography

Fira Sans is the primary typeface, paired with JetBrains Mono for all code contexts. These are the only two type families in the system.

The root `<html>` element is set to `font-size: 15px`. All `rem` values resolve to 15px multiples — not 16px. The px values in the tokens below are computed from this 15px root.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.headline-xl}` | 38px | 700 | 1.2 | Page and article main titles (h1) |
| `{typography.headline-lg}` | 30px | 700 | 1.2 | Major section headers (h2) |
| `{typography.headline-md}` | 23px | 700 | 1.2 | Sub-section headers (h3) |
| `{typography.headline-sm}` | 19px | 700 | 1.2 | Card titles, minor headings (h4) |
| `{typography.headline-xs}` | 17px | 700 | 1.2 | Small headings (h5) |
| `{typography.body-lg}` | 15px | 400 | 1.6 | Long-form prose, standard paragraphs |
| `{typography.body-md}` | 15px | 400 | 1.6 | Component body text (same size as body-lg) |
| `{typography.body-sm}` | 13px | 400 | 1.6 | Secondary text, captions, figcaptions |
| `{typography.label}` | 15px | 500 | 1.2 | Button labels, nav links, form labels |
| `{typography.label-strong}` | 15px | 600 | 1.2 | Table headers, emphasized labels |
| `{typography.label-sm}` | 11px | 500 | 1.6 | Badge text (+ 0.05em letter-spacing, uppercase) |
| `{typography.code}` | 13px | 400 | 1.6 | Inline code, keyboard shortcuts |
| `{typography.code-block}` | 15px | 400 | 1.6 | Code blocks, terminal output |

### Structural Typography Rules

- **Headings always carry a 1.2 line-height** and 700 weight. Never use heading tokens at weights below 700.
- **H1 has a 2px azure bottom border** (`border-bottom: 2px solid {colors.azure}`). H2 has a 1px violet bottom border. These borders are structural — include them when rendering h1 and h2 in new UI.
- **`label-sm` is always uppercase** with `letter-spacing: 0.05em`. It is the badge text style and not appropriate for paragraph text.
- **JetBrains Mono exclusively for code**. Never use Fira Sans for `<code>`, `<pre>`, or `<kbd>` content.
- The four font weights in use are: 400 (body), 500 (interactive labels), 600 (emphasized labels, table headers), 700 (headings). There is no weight 300 or 800 in this system.

## Layout

The layout uses a 12-column CSS grid with four responsive breakpoints. All containers are centered and horizontally padded.

### Spacing Scale

The scale follows an 8px-base rhythm from `{spacing.xs}` to `{spacing.4xl}`. Use small steps (xs–md) for component-internal spacing; large steps (xl–4xl) for section gaps.

| Token | Value | Use |
|---|---|---|
| `{spacing.xs}` | 4px | Tight padding, inline code padding, micro gaps |
| `{spacing.sm}` | 8px | List item gaps, small internal padding |
| `{spacing.md}` | 12px | Button vertical padding, card header separators |
| `{spacing.lg}` | 16px | Default internal padding, form group gaps |
| `{spacing.xl}` | 24px | Card padding, section component gaps |
| `{spacing.2xl}` | 32px | Section spacing, large card gaps |
| `{spacing.3xl}` | 48px | Major section separations |
| `{spacing.4xl}` | 64px | Page-level vertical rhythm |

### Grid System

| Breakpoint | Min-width | Max Columns |
|---|---|---|
| sm | 640px | 4 |
| md | 768px | 4 |
| lg | 1024px | 6 |
| xl | 1280px | 6 |

The system supports up to 12-column grids via `.grid-cols-12` but breakpoint utilities only go to 6 columns.

### Containers

| Class | Max-width | Use |
|---|---|---|
| `.container` | 1200px | Default page layout |
| `.container-sm` | 800px | Blog post reading column — always use this for article content |
| `.container-lg` | 1400px | Full-bleed feature sections |
| `.container-fluid` | 100% | Edge-to-edge full-width sections |

All containers have `{spacing.lg}` (16px) horizontal padding on each side.

## Elevation & Depth

Void communicates depth through **surface color steps and border color**, not through heavy shadows. Shadows exist but are used sparingly.

| Level | Treatment | Use |
|---|---|---|
| 0 — Canvas | `{colors.background}` (#000000), no border | Page background |
| 1 — Surface | `{colors.surface}` (#0a0a0a), 1px `{colors.border-subtle}` border | Nav bar, cards at rest |
| 2 — Surface raised | `{colors.surface-raised}` (#0f0f0f), 1px `{colors.border-subtle}` border | Code blocks, table headers |
| 3 — Surface muted | `{colors.surface-muted}` (#1a1a1a), 1px `{colors.border-default}` border | Form inputs, kbd elements |
| 4 — Hover elevation | `{colors.surface}`, 1px `{colors.border-active}` border + shadow-lg | Cards on hover |
| Focus | 2px azure outline, 2px offset | All interactive elements on focus-visible |

### Shadow Values (exact)

```
shadow-sm:  0 1px 2px 0 rgba(0,0,0,0.5)
shadow-md:  0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.3)
shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3)
glow-primary: 0 0 20px rgba(58,134,255,0.3)
glow-accent:  0 0 20px rgba(255,0,110,0.3)
```

Shadows use 0.5 black opacity because they must be visible against the near-black surfaces. When cards hover, they apply shadow-lg; buttons on hover apply shadow-md.

## Shapes

All components use the tight, code-adjacent radius scale. No component uses pill rounding except badges and tags.

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0 | Explicitly square elements |
| `{rounded.sm}` | 4px | Inline code, checkboxes, small chips |
| `{rounded.md}` | 6px | Buttons, inputs, nav links, alerts — the default interactive radius |
| `{rounded.lg}` | 8px | Cards, modals, dialogs — the default container radius |
| `{rounded.xl}` | 12px | Badges, tags, pills |
| `{rounded.full}` | 9999px | Circular avatars, toggle controls |

Border widths follow a two-value system:
- **1px**: all surface borders (cards, inputs, nav, code blocks, table rows)
- **2px**: interactive emphasis (h1 underline, active nav links, focus outlines, button-outline variant)
- **4px**: blockquote left border (orange accent)

## Components

### Button

Six variants (primary, secondary, outline, ghost, danger, success) share `{rounded.md}` and `{typography.label}` (15px/500). All variants produce the same hover behavior: the background changes to rose (`{colors.primary-hover}` #ff006e), the element lifts by 1px (`translateY(-1px)`), and shadow-md is applied.

Exceptions to the universal hover rule:
- **`button-outline`** fills to azure on hover (not rose) — background becomes `{colors.primary}`
- **`button-success`** uses `{colors.success-hover}` (#059669) on hover

The disabled state for all button variants is opacity 0.5 with `cursor: not-allowed` — no color change and no hover effect.

Focus state: 2px azure outline with 2px offset. Never remove this ring.

### Card

Cards use `{colors.surface}` (#0a0a0a) with a 1px `{colors.border-subtle}` (#2a2a2a) border and `{rounded.lg}`. On hover, the border transitions to `{colors.border-active}` (azure) with a 2px lift and shadow-lg applied.

Card text hierarchy:
- Card title: `{typography.headline-sm}` (19px/700), color `{colors.on-surface-strong}` (#ffffff)
- Card subtitle / metadata: `{typography.body-sm}` (13px/400), color `{colors.on-surface-muted}` (#a0a0a0)
- Card body: `{typography.body-md}` (15px/400), color `{colors.on-surface}` (#e8e8e8)

### Input / Form Controls

Text inputs, textareas, and selects use `{colors.surface-muted}` (#1a1a1a) background with a 1px `{colors.border-default}` (#3a3a3a) border. Focus state adds a `{colors.border-active}` (azure) border and `box-shadow: 0 0 0 3px rgba(58,134,255,0.2)` glow ring — this exact shadow value, not a solid outline. Error state replaces the border with `{colors.danger}` (orange) and `box-shadow: 0 0 0 3px rgba(251,86,7,0.2)`. Placeholder text uses `{colors.placeholder}` (#808080).

### Alert

Alerts render as `{rounded.md}` panels with a 4px left `border-left` in the accent color, a translucent 10%-opacity tinted background, and `{colors.on-surface}` (#e8e8e8) text regardless of type. Background tint values (not tokens):

| Type | Left border | Background fill |
|---|---|---|
| Info | `{colors.azure}` #3a86ff | rgba(58,134,255,0.1) |
| Warning | `{colors.amber}` #ffbe0b | rgba(255,190,11,0.1) |
| Danger | `{colors.orange}` #fb5607 | rgba(251,86,7,0.1) |
| Success | `{colors.success}` #10b981 | rgba(16,185,129,0.1) |

### Navigation

The nav bar uses `{colors.surface}` (#0a0a0a) with a 1px azure (`{colors.border-active}`) bottom border. Nav link default color is `{colors.on-surface-muted}` (#a0a0a0). Hover shifts to `{colors.primary}` (azure) text with `{colors.surface-muted}` background. The active link requires **both** rose text (`{colors.accent}`) and a 2px rose bottom border — omitting either breaks the visual contract.

### Badge

All badges use `{typography.label-sm}` (11px/500, uppercase, 0.05em letter-spacing) with `{rounded.xl}` (12px). The warning badge (`badge-warning`) uses `{colors.on-warning}` (black) for text — amber (#ffbe0b) is a light background and white text would fail WCAG AA.

### Code

**Inline code**: amber (`{colors.amber}` #ffbe0b) text on `{colors.surface-muted}` (#1a1a1a) background, `{rounded.sm}` (4px) corners. Amber-on-dark achieves approximately 10:1 contrast.

**Code blocks**: azure (`{colors.primary}` #3a86ff) text on `{colors.surface-raised}` (#0f0f0f) background with a 1px `{colors.border-subtle}` border and `{rounded.md}`. The `.code-block-copy` button is positioned absolute in the top-right corner using `{colors.surface-muted}` background, transitioning to azure on hover.

## Do's and Don'ts

- **Do** apply rose (`{colors.primary-hover}` #ff006e) as the hover background for every button variant and interactive control — this universal pivot is the system's defining signature.
- **Do** use `{colors.surface}` (#0a0a0a) for all elevated surfaces (cards, nav bar). Never use pure black (#000000) as a card background — the visual contrast between page canvas and card surface depends on this 10-unit gray step.
- **Do** include both rose text AND a 2px rose bottom border on active nav links. One without the other is incomplete.
- **Do** use amber (`{colors.amber}` #ffbe0b) for all inline code text. It achieves ~10:1 contrast on dark surfaces and is the system's defined code color.
- **Do** apply black text (`{colors.on-warning}`) to warning badges. Amber (#ffbe0b) is a light background — white text on amber yields only ~1.2:1 contrast and fails all WCAG levels.
- **Do** use `.container-sm` (800px) as the max-width for all blog post article columns. Full-width containers are for hero and full-bleed sections only.
- **Do** include the 2px azure bottom border on `<h1>` and the 1px violet bottom border on `<h2>` — these are structural typographic rules, not decorative options.
- **Don't** attempt to create a light mode variant. No light-mode token ladder exists. Generating light-mode styles will produce unpredictable results.
- **Don't** use rose (`{colors.accent}` #ff006e) as a static default color. It is reserved exclusively for hover and active states. Static use of rose breaks the interaction grammar.
- **Don't** reference `success` or `success-hover` via CSS variables — these are not defined as CSS custom properties. Use the hex values (#10b981 and #059669) directly.
- **Don't** remove focus outlines. All interactive elements have `focus-visible` rings (2px azure, 2px offset). Keyboard accessibility depends on them.
- **Don't** use `{colors.on-surface-strong}` (white) for paragraph text. White is for headings and card titles only. Body text uses `{colors.on-surface}` (#e8e8e8) to reduce eye strain on extended dark-mode reading.
- **Don't** apply `{rounded.xl}` (12px) to anything except badges and explicit pill elements. Cards use `{rounded.lg}` (8px); buttons use `{rounded.md}` (6px).
- **Don't** use white (#ffffff) text on azure (#3a86ff) backgrounds for text smaller than 19px — the contrast ratio is approximately 3.5:1, which passes WCAG AA for large text (≥24px or ≥18.67px bold) but fails for normal-sized text. For button text at 15px, acknowledge this tradeoff deliberately.
- **Don't** use a sans-serif font for code content. JetBrains Mono is the only typeface for `<code>`, `<pre>`, and `<kbd>` elements.

## Responsive Behavior

### Breakpoints

| Name | Min-width | Key Changes |
|---|---|---|
| sm | 640px | 1–4 column grids begin, flex-row/flex-col utilities active |
| md | 768px | 2–4 column grids, main layout stabilizes |
| lg | 1024px | Up to 6-column grids, full layout |
| xl | 1280px | Up to 6-column grids, comfortable margins |

### Collapsing Strategy

- **Navigation**: horizontal nav collapses to mobile layout below sm (640px); use hamburger or stacked vertical menu
- **Card grids**: 3-column → 2-column at md → single-column below sm
- **Article content**: always uses `.container-sm` (800px) — no responsive resize needed; the column is narrow enough to read on all breakpoints
- **Code blocks**: horizontal scroll on narrow viewports, never wrap — preserving code line integrity is more important than avoiding overflow
- **Typography**: headline-xl (38px) should scale down gracefully — consider headline-lg (30px) at sm breakpoint for h1 in article headers

### Touch Targets

Buttons use minimum 12px vertical padding, achieving at least 39px height at 15px body font. This is below the 44px touch target ideal — for mobile-critical interactions, prefer the `button-lg` variant (48px height) which meets the 44px minimum.

## Agent Prompt Guide

### Quick Color Reference

| Role | Token | Hex |
|---|---|---|
| Primary action | `{colors.primary}` | #3a86ff |
| Universal hover | `{colors.primary-hover}` | #ff006e |
| Page background | `{colors.background}` | #000000 |
| Card / nav surface | `{colors.surface}` | #0a0a0a |
| Form / input surface | `{colors.surface-muted}` | #1a1a1a |
| Body text | `{colors.on-surface}` | #e8e8e8 |
| Heading text | `{colors.on-surface-strong}` | #ffffff |
| Secondary text | `{colors.on-surface-muted}` | #a0a0a0 |
| Card border | `{colors.border-subtle}` | #2a2a2a |
| Input border | `{colors.border-default}` | #3a3a3a |
| Active / focus border | `{colors.border-active}` | #3a86ff |
| Inline code text | `{colors.amber}` | #ffbe0b |

### Example Prompts

**Blog post card:**
"Create a card on `{colors.surface}` (#0a0a0a) with a 1px solid `{colors.border-subtle}` (#2a2a2a) border and `{rounded.lg}` (8px) radius. Title in Fira Sans 19px/700 (#ffffff). Body text in Fira Sans 15px/400 (#e8e8e8). Metadata in 13px/400 (#a0a0a0). Add `{spacing.xl}` (24px) internal padding. On hover: border color transitions to `{colors.border-active}` (#3a86ff), card lifts 2px, and shadow `0 10px 15px -3px rgba(0,0,0,0.5)` applies."

**Primary button:**
"Create a button with `{colors.primary}` (#3a86ff) background, white text in Fira Sans 15px/500, `{rounded.md}` (6px) radius, and 12px 24px padding. On hover: background changes to `{colors.primary-hover}` (#ff006e), element lifts 1px, shadow `0 4px 6px -1px rgba(0,0,0,0.5)` applies."

**Blog post article body:**
"Render article content in `.container-sm` (max-width 800px) centered on `{colors.background}` (#000000). Body paragraphs in Fira Sans 15px/400 #e8e8e8, line-height 1.6. H1 (38px/700 #ffffff) with a 2px azure bottom border and 12px bottom padding. H2 (30px/700 #ffffff) with a 1px violet (#8338ec) bottom border. Inline code in JetBrains Mono 13px/400, amber (#ffbe0b) text on #1a1a1a background, 4px radius."

**Navigation bar:**
"Render a nav bar on `{colors.surface}` (#0a0a0a) with a 1px solid azure (`{colors.border-active}` #3a86ff) bottom border. Nav links in Fira Sans 15px/500 in `{colors.on-surface-muted}` (#a0a0a0), with `{rounded.md}` (6px) radius and 12px 16px padding. Link hover: background `{colors.surface-muted}` (#1a1a1a), text `{colors.primary}` (#3a86ff). Active link: text `{colors.accent}` (#ff006e) plus 2px solid rose bottom border."

**Badge:**
"Render a badge with `{colors.primary}` (#3a86ff) background, white text in Fira Sans 11px/500 uppercase with 0.05em letter-spacing, `{rounded.xl}` (12px) radius, and 4px 12px padding."

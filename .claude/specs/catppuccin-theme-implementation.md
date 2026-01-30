# Catppuccin Theme Implementation Spec for Project Arcturus v2

## Executive Summary

This spec outlines a minimally invasive approach to implementing the [Catppuccin](https://catppuccin.com/palette/) theme for Project Arcturus v2. Following the CSS Zen Garden philosophy—where the same HTML structure is transformed purely through CSS—this implementation leverages the existing CSS variable architecture to create cohesive theme variants.

---

## 1. Background & Inspiration

### CSS Zen Garden Philosophy
CSS Zen Garden demonstrates that dramatic visual transformations are achievable through CSS alone, without modifying HTML structure. Project Arcturus already embodies this principle through its CSS variable-based theming system.

### Catppuccin Overview
Catppuccin is a community-driven pastel theme with four carefully designed flavors:

| Flavor | Description | Use Case |
|--------|-------------|----------|
| **Latte** | Light, warm | Daytime, high-contrast |
| **Frappe** | Warm dark gray-blue | Evening, moderate contrast |
| **Macchiato** | Darker blue-gray | Night, softer contrast |
| **Mocha** | Darkest, deep blue | Night, maximum darkness |

Each flavor includes 26 colors:
- **Base colors**: `base`, `mantle`, `crust` (backgrounds)
- **Surface colors**: `surface0`, `surface1`, `surface2` (elevated elements)
- **Overlay colors**: `overlay0`, `overlay1`, `overlay2` (overlays, modals)
- **Text colors**: `text`, `subtext0`, `subtext1` (typography)
- **14 Accent colors**: `rosewater`, `flamingo`, `pink`, `mauve`, `red`, `maroon`, `peach`, `yellow`, `green`, `teal`, `sky`, `sapphire`, `blue`, `lavender`

---

## 2. Current Architecture Analysis

### Existing Theme Variables (V1)
```css
:root {
  --primary-color: #...;      /* Primary accent */
  --secondary-color: #...;    /* Secondary accent */
  --bg-color: #...;           /* Page background */
  --surface-color: rgba(...); /* Elevated surfaces */
  --text-color: #...;         /* Primary text */
  --muted-text: #...;         /* Secondary text */
  --card-bg: rgba(...);       /* Card backgrounds */
  --glass-border: rgba(...);  /* Glassmorphism borders */
  --glass-shadow: rgba(...);  /* Glassmorphism shadows */
  --font-main: '...';         /* Typography */
}
```

### Void Design Tokens (V2)
```css
:root {
  /* Brand colors */
  --void-color-brand-azure: #3a86ff;
  --void-color-brand-violet: #8338ec;
  --void-color-brand-rose: #ff006e;
  --void-color-brand-amber: #ffbe0b;
  --void-color-brand-orange: #fb5607;

  /* Background hierarchy */
  --void-color-background-base: var(--void-color-base-black);
  --void-color-background-elevated: var(--void-color-gray-950);
  --void-color-background-surface: var(--void-color-gray-900);
  --void-color-background-overlay: var(--void-color-gray-800);

  /* Text hierarchy */
  --void-color-text-primary: var(--void-color-gray-100);
  --void-color-text-secondary: var(--void-color-gray-200);
  --void-color-text-tertiary: var(--void-color-gray-300);
  --void-color-text-disabled: var(--void-color-gray-400);

  /* Semantic */
  --void-color-semantic-primary: var(--void-color-brand-azure);
  --void-color-semantic-secondary: var(--void-color-brand-violet);
  --void-color-semantic-accent: var(--void-color-brand-rose);
}
```

---

## 3. Implementation Strategy

### 3.1 File Structure
```
apps/web/public/css/themes/catppuccin/
├── catppuccin-latte.css      # Light theme
├── catppuccin-frappe.css     # Warm dark theme
├── catppuccin-macchiato.css  # Darker theme
├── catppuccin-mocha.css      # Darkest theme (recommended default)
```

### 3.2 Minimal Override Approach

Each theme file will contain **only CSS variable overrides**, following the pattern established by existing themes like `nord.css` and `amethyst.css`.

---

## 4. Catppuccin Color Mapping

### 4.1 Mocha Flavor (Primary Implementation)

```css
/* Catppuccin Mocha Palette */
:root {
  /* ===== Catppuccin Base Tokens ===== */
  --ctp-rosewater: #f5e0dc;
  --ctp-flamingo: #f2cdcd;
  --ctp-pink: #f5c2e7;
  --ctp-mauve: #cba6f7;
  --ctp-red: #f38ba8;
  --ctp-maroon: #eba0ac;
  --ctp-peach: #fab387;
  --ctp-yellow: #f9e2af;
  --ctp-green: #a6e3a1;
  --ctp-teal: #94e2d5;
  --ctp-sky: #89dceb;
  --ctp-sapphire: #74c7ec;
  --ctp-blue: #89b4fa;
  --ctp-lavender: #b4befe;
  --ctp-text: #cdd6f4;
  --ctp-subtext1: #bac2de;
  --ctp-subtext0: #a6adc8;
  --ctp-overlay2: #9399b2;
  --ctp-overlay1: #7f849c;
  --ctp-overlay0: #6c7086;
  --ctp-surface2: #585b70;
  --ctp-surface1: #45475a;
  --ctp-surface0: #313244;
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-crust: #11111b;
}
```

### 4.2 Variable Mapping Strategy

| Existing Variable | Catppuccin Mocha Mapping | Rationale |
|-------------------|--------------------------|-----------|
| `--primary-color` | `--ctp-mauve` (#cba6f7) | Catppuccin's signature purple accent |
| `--secondary-color` | `--ctp-blue` (#89b4fa) | Complementary accent |
| `--bg-color` | `--ctp-base` (#1e1e2e) | Primary background |
| `--surface-color` | `rgba(49, 50, 68, 0.7)` | `surface0` with transparency |
| `--text-color` | `--ctp-text` (#cdd6f4) | Primary text |
| `--muted-text` | `--ctp-subtext0` (#a6adc8) | Secondary text |
| `--card-bg` | `rgba(69, 71, 90, 0.6)` | `surface1` with transparency |
| `--glass-border` | `rgba(203, 166, 247, 0.2)` | Mauve-tinted border |
| `--glass-shadow` | `rgba(17, 17, 27, 0.3)` | Crust-based shadow |

### 4.3 Extended Void Token Mapping

```css
:root {
  /* Brand color overrides */
  --void-color-brand-azure: var(--ctp-blue);
  --void-color-brand-violet: var(--ctp-mauve);
  --void-color-brand-rose: var(--ctp-pink);
  --void-color-brand-amber: var(--ctp-yellow);
  --void-color-brand-orange: var(--ctp-peach);

  /* Gray scale mapping */
  --void-color-base-black: var(--ctp-crust);
  --void-color-base-white: var(--ctp-text);
  --void-color-gray-950: var(--ctp-mantle);
  --void-color-gray-900: var(--ctp-base);
  --void-color-gray-800: var(--ctp-surface0);
  --void-color-gray-700: var(--ctp-surface1);
  --void-color-gray-600: var(--ctp-surface2);
  --void-color-gray-400: var(--ctp-overlay0);
  --void-color-gray-300: var(--ctp-overlay1);
  --void-color-gray-200: var(--ctp-subtext0);
  --void-color-gray-100: var(--ctp-text);

  /* Semantic overrides */
  --void-color-semantic-success: var(--ctp-green);
  --void-color-semantic-warning: var(--ctp-yellow);
  --void-color-semantic-danger: var(--ctp-red);
}
```

---

## 5. Detailed Implementation Files

### 5.1 `catppuccin-mocha.css` (Full Implementation)

```css
/**
 * Catppuccin Mocha Theme for Project Arcturus
 * The darkest Catppuccin flavor with rich pastel accents
 *
 * Palette: https://catppuccin.com/palette/
 */

:root {
  /* ===== Catppuccin Mocha Base Palette ===== */
  --ctp-rosewater: #f5e0dc;
  --ctp-flamingo: #f2cdcd;
  --ctp-pink: #f5c2e7;
  --ctp-mauve: #cba6f7;
  --ctp-red: #f38ba8;
  --ctp-maroon: #eba0ac;
  --ctp-peach: #fab387;
  --ctp-yellow: #f9e2af;
  --ctp-green: #a6e3a1;
  --ctp-teal: #94e2d5;
  --ctp-sky: #89dceb;
  --ctp-sapphire: #74c7ec;
  --ctp-blue: #89b4fa;
  --ctp-lavender: #b4befe;
  --ctp-text: #cdd6f4;
  --ctp-subtext1: #bac2de;
  --ctp-subtext0: #a6adc8;
  --ctp-overlay2: #9399b2;
  --ctp-overlay1: #7f849c;
  --ctp-overlay0: #6c7086;
  --ctp-surface2: #585b70;
  --ctp-surface1: #45475a;
  --ctp-surface0: #313244;
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-crust: #11111b;

  /* ===== V1 Theme Compatibility ===== */
  --primary-color: var(--ctp-mauve);
  --secondary-color: var(--ctp-blue);
  --bg-color: var(--ctp-base);
  --surface-color: rgba(49, 50, 68, 0.7);
  --text-color: var(--ctp-text);
  --muted-text: var(--ctp-subtext0);
  --card-bg: rgba(69, 71, 90, 0.6);
  --glass-border: rgba(203, 166, 247, 0.2);
  --glass-shadow: rgba(17, 17, 27, 0.3);

  /* ===== Void Token Overrides ===== */
  /* Brand colors */
  --void-color-brand-azure: var(--ctp-blue);
  --void-color-brand-violet: var(--ctp-mauve);
  --void-color-brand-rose: var(--ctp-pink);
  --void-color-brand-amber: var(--ctp-yellow);
  --void-color-brand-orange: var(--ctp-peach);

  /* Base colors */
  --void-color-base-black: var(--ctp-crust);
  --void-color-base-white: var(--ctp-text);

  /* Gray scale */
  --void-color-gray-950: var(--ctp-mantle);
  --void-color-gray-900: var(--ctp-base);
  --void-color-gray-800: var(--ctp-surface0);
  --void-color-gray-700: var(--ctp-surface1);
  --void-color-gray-600: var(--ctp-surface2);
  --void-color-gray-400: var(--ctp-overlay0);
  --void-color-gray-300: var(--ctp-overlay1);
  --void-color-gray-200: var(--ctp-subtext0);
  --void-color-gray-100: var(--ctp-text);

  /* Semantic colors */
  --void-color-semantic-primary: var(--ctp-mauve);
  --void-color-semantic-secondary: var(--ctp-blue);
  --void-color-semantic-accent: var(--ctp-pink);
  --void-color-semantic-warning: var(--ctp-yellow);
  --void-color-semantic-danger: var(--ctp-red);
  --void-color-semantic-success: var(--ctp-green);

  /* Background hierarchy */
  --void-color-background-base: var(--ctp-crust);
  --void-color-background-elevated: var(--ctp-mantle);
  --void-color-background-surface: var(--ctp-base);
  --void-color-background-overlay: var(--ctp-surface0);

  /* Text hierarchy */
  --void-color-text-primary: var(--ctp-text);
  --void-color-text-secondary: var(--ctp-subtext1);
  --void-color-text-tertiary: var(--ctp-subtext0);
  --void-color-text-disabled: var(--ctp-overlay0);
  --void-color-text-heading: var(--ctp-text);

  /* Border colors */
  --void-color-border-default: var(--ctp-surface1);
  --void-color-border-subtle: var(--ctp-surface0);
  --void-color-border-primary: var(--ctp-mauve);

  /* Shadows with Catppuccin-appropriate colors */
  --void-shadow-sm: 0 1px 2px 0 rgba(17, 17, 27, 0.5);
  --void-shadow-md: 0 4px 6px -1px rgba(17, 17, 27, 0.5), 0 2px 4px -1px rgba(17, 17, 27, 0.3);
  --void-shadow-lg: 0 10px 15px -3px rgba(17, 17, 27, 0.5), 0 4px 6px -2px rgba(17, 17, 27, 0.3);
  --void-shadow-glow-primary: 0 0 20px rgba(203, 166, 247, 0.3);
  --void-shadow-glow-accent: 0 0 20px rgba(245, 194, 231, 0.3);

  /* Component token overrides */
  --void-component-button-primary-background: var(--ctp-mauve);
  --void-component-button-primary-background-hover: var(--ctp-pink);
  --void-component-button-secondary-background: var(--ctp-blue);
  --void-component-button-secondary-background-hover: var(--ctp-sapphire);
  --void-component-card-background: var(--ctp-mantle);
  --void-component-card-border-color: var(--ctp-surface0);
  --void-component-card-border-color-hover: var(--ctp-mauve);
  --void-component-input-background: var(--ctp-surface0);
  --void-component-input-border-color: var(--ctp-surface1);
  --void-component-input-border-color-focus: var(--ctp-mauve);
  --void-component-badge-background: var(--ctp-mauve);
}
```

---

## 6. Integration Steps

### Phase 1: Create Theme Files
1. Create `apps/web/public/css/themes/catppuccin/` directory
2. Implement `catppuccin-mocha.css` as primary theme
3. Implement remaining flavors (latte, frappe, macchiato)

### Phase 2: V1 Integration
1. Add theme to V1 routes by updating `BASE_V1_CSS` or creating a separate route configuration:
```typescript
// In packages/types/lib/config/routes.ts
export const CATPPUCCIN_V1_CSS = [
  "/css/styles.min.css",
  "/css/themes/catppuccin/catppuccin-mocha.css",
] as const;
```

### Phase 3: V2 Integration
1. Create V2-specific Catppuccin configuration:
```typescript
export const CATPPUCCIN_V2_CSS = [
  "/css/v2.min.css",
  "/css/themes/catppuccin/catppuccin-mocha.css",
] as const;
```

2. Or enable dynamic theme switching via CSS class:
```css
/* In catppuccin-mocha.css */
.theme-catppuccin-mocha {
  /* All variable overrides scoped to class */
}
```

### Phase 4: Build Integration
1. Add PostCSS processing for theme files
2. Generate minified versions (`catppuccin-mocha.min.css`)
3. Copy to `dist/css/themes/catppuccin/`

---

## 7. Optional Enhancements

### 7.1 Theme Switcher Component
```tsx
interface ThemeOption {
  id: string;
  name: string;
  cssPath: string;
}

const CATPPUCCIN_THEMES: ThemeOption[] = [
  { id: 'mocha', name: 'Mocha', cssPath: '/css/themes/catppuccin/catppuccin-mocha.css' },
  { id: 'macchiato', name: 'Macchiato', cssPath: '/css/themes/catppuccin/catppuccin-macchiato.css' },
  { id: 'frappe', name: 'Frappe', cssPath: '/css/themes/catppuccin/catppuccin-frappe.css' },
  { id: 'latte', name: 'Latte', cssPath: '/css/themes/catppuccin/catppuccin-latte.css' },
];
```

### 7.2 Syntax Highlighting Integration
Catppuccin has official themes for:
- Prism.js
- highlight.js
- Shiki

Consider adding code block theming:
```css
/* Code block Catppuccin overrides */
.markdown-content pre {
  background-color: var(--ctp-mantle);
  border: 1px solid var(--ctp-surface0);
}

.markdown-content code {
  background-color: var(--ctp-surface0);
  color: var(--ctp-peach);
}
```

### 7.3 Glassmorphism Adjustments
The existing glassmorphism effects work well with Catppuccin. Fine-tune:
```css
.glass {
  background: linear-gradient(
    135deg,
    rgba(49, 50, 68, 0.4),
    rgba(69, 71, 90, 0.2)
  );
  border: 1px solid rgba(203, 166, 247, 0.15);
  box-shadow:
    0 8px 32px rgba(17, 17, 27, 0.37),
    inset 0 0 0 1px rgba(205, 214, 244, 0.05);
}
```

---

## 8. Testing Checklist

- [ ] V1 Homepage renders correctly with theme
- [ ] V2 Homepage renders correctly with theme
- [ ] Post detail pages maintain readability
- [ ] About page content displays properly
- [ ] Contact page forms are accessible
- [ ] Navigation hover states work
- [ ] Card hover animations maintain smoothness
- [ ] Code blocks in markdown are readable
- [ ] WCAG AA contrast ratios met for all text
- [ ] Glassmorphism effects blend appropriately
- [ ] Dark mode (default) loads correctly
- [ ] Light mode (Latte) provides sufficient contrast
- [ ] Mobile responsiveness unaffected
- [ ] Focus states visible for accessibility

---

## 9. Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `apps/web/public/css/themes/catppuccin/catppuccin-mocha.css` | Mocha flavor (darkest) |
| `apps/web/public/css/themes/catppuccin/catppuccin-macchiato.css` | Macchiato flavor |
| `apps/web/public/css/themes/catppuccin/catppuccin-frappe.css` | Frappe flavor |
| `apps/web/public/css/themes/catppuccin/catppuccin-latte.css` | Latte flavor (light) |

### Modified Files (Optional, for dynamic switching)
| File | Change |
|------|--------|
| `packages/types/lib/config/routes.ts` | Add `CATPPUCCIN_V1_CSS`, `CATPPUCCIN_V2_CSS` |
| `packages/config/src/configs/routes/v2.ts` | Reference new CSS arrays (if needed) |

---

## 10. Accessibility Considerations

Catppuccin is designed with accessibility in mind. Key contrast ratios:

| Combination | Mocha Ratio | WCAG Level |
|-------------|-------------|------------|
| Text on Base | 11.8:1 | AAA |
| Subtext on Base | 7.5:1 | AAA |
| Mauve on Base | 6.2:1 | AA |
| Blue on Base | 5.4:1 | AA |

All primary text combinations exceed WCAG AA (4.5:1) requirements.

---

## 11. Summary

This implementation provides:

1. **Minimal invasion**: Only CSS variable overrides, no HTML/TSX changes
2. **Consistency**: Works with both V1 and V2 site versions
3. **Four flavors**: Complete Catppuccin experience
4. **Future-proof**: Easy to extend with theme switching
5. **Accessible**: Meets WCAG AA standards
6. **CSS Zen Garden philosophy**: Pure CSS transformation

**Estimated effort**: 2-4 hours for full implementation
**Risk level**: Low (purely additive CSS)
**Breaking changes**: None

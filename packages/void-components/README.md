# @arcjr/void-components

React component library for the Void design system.

## Installation

```bash
bun add @arcjr/void-components
```

## Usage

```tsx
import { Button } from '@arcjr/void-components';
import '@arcjr/void-components/styles';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Run tests
bun test

# Run Storybook
bun run storybook
```

## Components

- **Button** - Primary and secondary button variants with disabled states

## Design Tokens

This library uses design tokens from `@arcjr/void-tokens`. Import the styles to get access to CSS variables:

```tsx
import '@arcjr/void-components/styles';
```

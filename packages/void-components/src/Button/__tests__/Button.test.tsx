import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import { Button } from '../index';

describe('src/Button', () => {
  test('renders button with children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeDefined();
  });

  test('applies primary variant class by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector('.void-button--primary');
    expect(button).toBeDefined();
  });

  test('applies secondary variant class', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('.void-button--secondary');
    expect(button).toBeDefined();
  });

  test('applies disabled class when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('.void-button--disabled');
    expect(button).toBeDefined();
  });

  test('sets disabled attribute when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  test('sets aria-disabled when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
  });

  test('sets custom aria-label', () => {
    const { container } = render(<Button ariaLabel="Custom label">Button</Button>);
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Custom label');
  });

  test('sets button type', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    const button = container.querySelector('button');
    expect(button?.type).toBe('submit');
  });
});

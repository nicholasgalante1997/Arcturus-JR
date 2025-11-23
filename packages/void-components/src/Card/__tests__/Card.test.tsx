import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import { Card } from '../index';

describe('src/Card', () => {
  test('renders card with children', () => {
    const { getByText } = render(<Card>Card content</Card>);
    expect(getByText('Card content')).toBeDefined();
  });

  test('applies default variant class by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.void-card--default');
    expect(card).toBeDefined();
  });

  test('applies elevated variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.querySelector('.void-card--elevated');
    expect(card).toBeDefined();
  });

  test('applies medium padding by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('.void-card--padding-md');
    expect(card).toBeDefined();
  });

  test('applies custom padding class', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.querySelector('.void-card--padding-lg');
    expect(card).toBeDefined();
  });

  test('renders header when provided', () => {
    const { getByText } = render(<Card header={<h3>Header</h3>}>Content</Card>);
    expect(getByText('Header')).toBeDefined();
  });

  test('renders footer when provided', () => {
    const { getByText } = render(<Card footer={<button>Action</button>}>Content</Card>);
    expect(getByText('Action')).toBeDefined();
  });

  test('renders header, content, and footer together', () => {
    const { getByText } = render(
      <Card header={<h3>Header</h3>} footer={<button>Footer</button>}>
        Content
      </Card>
    );
    expect(getByText('Header')).toBeDefined();
    expect(getByText('Content')).toBeDefined();
    expect(getByText('Footer')).toBeDefined();
  });
});

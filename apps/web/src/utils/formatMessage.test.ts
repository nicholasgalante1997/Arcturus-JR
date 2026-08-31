import { describe, expect, test } from 'bun:test';

import { formatMessage } from './formatMessage';

describe('formatMessage', () => {
  test('replaces named string and number values', () => {
    expect(formatMessage('{count} posts match “{query}”.', { count: 2, query: 'rust' })).toBe(
      '2 posts match “rust”.'
    );
  });

  test('preserves unknown placeholders', () => {
    expect(formatMessage('Hello, {name}.', {})).toBe('Hello, {name}.');
  });
});

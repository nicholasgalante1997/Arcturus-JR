import { describe, expect, test } from 'bun:test';

import { formatPostCategory, formatPostDate } from './postPresentation';

describe('post presentation', () => {
  test('formats authored categories for display', () => {
    expect(formatPostCategory('SOFTWARE ENGINEERING')).toBe('Software Engineering');
  });

  test('treats a frontmatter date as a calendar date', () => {
    expect(formatPostDate('2026-01-24')).toBe('January 24, 2026');
  });
});

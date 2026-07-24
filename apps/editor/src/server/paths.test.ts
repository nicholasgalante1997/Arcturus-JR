import { describe, test, expect } from 'bun:test';

import { isValidId } from './paths';

describe('isValidId', () => {
  test('accepts simple lowercase slugs', () => {
    expect(isValidId('loclaude-1')).toBe(true);
  });

  test('accepts ids with dots (e.g. version-numbered filenames)', () => {
    expect(isValidId('ubuntu-24.04-dev-env-setup')).toBe(true);
  });

  test('rejects path traversal attempts', () => {
    expect(isValidId('../../etc/passwd')).toBe(false);
    expect(isValidId('..')).toBe(false);
  });

  test('rejects path separators', () => {
    expect(isValidId('foo/bar')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidId('')).toBe(false);
  });

  test('rejects undefined', () => {
    expect(isValidId(undefined)).toBe(false);
  });

  test('rejects ids starting with a non-alphanumeric character', () => {
    expect(isValidId('.hidden')).toBe(false);
    expect(isValidId('-leading-dash')).toBe(false);
  });
});

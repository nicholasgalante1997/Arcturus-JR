import { describe, expect, test } from 'bun:test';

import type { Rfc } from '@/types/Rfc';

import { sortRfcs } from './sortRfcs';

function rfc(code: string, updated: string): Rfc {
  return {
    id: code.toLocaleLowerCase(),
    code,
    title: code,
    version: '0.1.0',
    status: 'Draft',
    date: '2026-01-01',
    updated,
    author: 'Nick Galante',
    excerpt: `${code} abstract`,
    tags: [],
    visible: true
  };
}

describe('sortRfcs', () => {
  test('sorts by updated date descending, then code', () => {
    const input = [
      rfc('RFC-0002', '2026-01-01'),
      rfc('RFC-0003', '2026-02-01'),
      rfc('RFC-0001', '2026-01-01')
    ];

    expect(sortRfcs(input).map(({ code }) => code)).toEqual([
      'RFC-0003',
      'RFC-0001',
      'RFC-0002'
    ]);
    expect(input.map(({ code }) => code)).toEqual(['RFC-0002', 'RFC-0003', 'RFC-0001']);
  });
});

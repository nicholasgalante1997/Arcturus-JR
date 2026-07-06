import { describe, test, expect } from 'bun:test';

import { buildPostManifest, buildRfcManifest } from './manifest';
import type { Post, Rfc } from './schema';

const POST_A: Post = {
  id: 'alpha',
  title: 'Alpha',
  date: '2025-01-01',
  excerpt: 'Alpha excerpt',
  tags: ['one'],
  image: { src: '/a.jpg', alt: 'A', aspectRatio: '16 / 9' },
  category: 'GENERAL',
  subcategory: 'intro',
  slug: 'alpha',
  searchTerms: ['one'],
  readingTime: 'Under 1 minute',
  visible: true
};

const RFC_A: Rfc = {
  id: 'my-rfc',
  title: 'My RFC',
  version: '0.1.0',
  status: 'Draft',
  date: '2025-01-01',
  author: 'Nick Galante',
  excerpt: 'An RFC',
  tags: ['draft'],
  visible: true
};

describe('buildPostManifest', () => {
  test('produces stable 2-space-indented JSON with a trailing newline', () => {
    const manifest = buildPostManifest([POST_A]);
    expect(manifest.endsWith('\n')).toBe(true);
    expect(manifest).toBe(JSON.stringify([POST_A], null, 2) + '\n');
  });

  test('orders top-level keys per POST_RECORD_KEY_ORDER regardless of input key order', () => {
    const shuffled = { ...POST_A } as Record<string, unknown>;
    // Rebuild the object with keys inserted in a different order than the schema declares.
    const reordered: Record<string, unknown> = {};
    for (const key of ['visible', 'id', 'title', 'slug', 'date']) {
      reordered[key] = shuffled[key];
    }
    for (const key of Object.keys(shuffled)) {
      if (!(key in reordered)) reordered[key] = shuffled[key];
    }
    const manifest = buildPostManifest([reordered as unknown as Post]);
    const idIndex = manifest.indexOf('"id"');
    const titleIndex = manifest.indexOf('"title"');
    const visibleIndex = manifest.indexOf('"visible"');
    expect(idIndex).toBeLessThan(titleIndex);
    expect(titleIndex).toBeLessThan(visibleIndex);
  });

  test('is deterministic across calls', () => {
    expect(buildPostManifest([POST_A])).toBe(buildPostManifest([POST_A]));
  });
});

describe('buildRfcManifest', () => {
  test('produces stable 2-space-indented JSON with a trailing newline', () => {
    const manifest = buildRfcManifest([RFC_A]);
    expect(manifest.endsWith('\n')).toBe(true);
    expect(manifest).toBe(JSON.stringify([RFC_A], null, 2) + '\n');
  });
});

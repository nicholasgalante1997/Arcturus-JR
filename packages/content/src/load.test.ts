import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

import { loadPosts, loadRfcs } from './load';

describe('loadCollection', () => {
  describe('loadPosts', () => {
    let dir: string;

    beforeAll(async () => {
      dir = await mkdtemp(path.join(tmpdir(), 'arcjr-content-posts-'));
      await writeFile(
        path.join(dir, 'alpha.md'),
        `---
title: Alpha Post
date: '2025-01-01'
excerpt: The first post.
tags:
  - one
image:
  src: /assets/a.jpg
  alt: A
  aspectRatio: 16 / 9
category: GENERAL
subcategory: intro
visible: true
---

Alpha body.
`
      );
      await writeFile(
        path.join(dir, 'beta.md'),
        `---
title: Beta Post
date: '2025-06-01'
excerpt: The second post.
tags:
  - two
image:
  src: /assets/b.jpg
  alt: B
  aspectRatio: 16 / 9
category: GENERAL
subcategory: intro
slug: custom-beta-slug
visible: true
---

Beta body with several words in it to compute reading time from.
`
      );
    });

    afterAll(async () => {
      await rm(dir, { recursive: true, force: true });
    });

    test('loads and sorts by date desc', async () => {
      const entries = await loadPosts(dir);
      expect(entries.map((e) => e.id)).toEqual(['beta', 'alpha']);
    });

    test('id is the filename stem, never read from frontmatter', async () => {
      const entries = await loadPosts(dir);
      const alpha = entries.find((e) => e.id === 'alpha')!;
      expect(alpha.record.id).toBe('alpha');
    });

    test('slug defaults to id when frontmatter omits it', async () => {
      const entries = await loadPosts(dir);
      const alpha = entries.find((e) => e.id === 'alpha')!;
      expect(alpha.record.slug).toBe('alpha');
    });

    test('slug is preserved when frontmatter sets it explicitly', async () => {
      const entries = await loadPosts(dir);
      const beta = entries.find((e) => e.id === 'beta')!;
      expect(beta.record.slug).toBe('custom-beta-slug');
    });

    test('searchTerms defaults to tags when omitted', async () => {
      const entries = await loadPosts(dir);
      const alpha = entries.find((e) => e.id === 'alpha')!;
      expect(alpha.record.searchTerms).toEqual(['one']);
    });

    test('readingTime is auto-computed when omitted', async () => {
      const entries = await loadPosts(dir);
      const alpha = entries.find((e) => e.id === 'alpha')!;
      expect(typeof alpha.record.readingTime).toBe('string');
      expect(alpha.record.readingTime.length).toBeGreaterThan(0);
    });

    test('rejects a file missing a required field', async () => {
      const badDir = await mkdtemp(path.join(tmpdir(), 'arcjr-content-bad-'));
      try {
        await writeFile(
          path.join(badDir, 'missing-title.md'),
          `---
date: '2025-01-01'
excerpt: No title here.
image:
  src: /assets/a.jpg
  alt: A
  aspectRatio: 16 / 9
category: GENERAL
subcategory: intro
---

Body.
`
        );
        await expect(loadPosts(badDir)).rejects.toThrow(/Invalid frontmatter/);
      } finally {
        await rm(badDir, { recursive: true, force: true });
      }
    });

    test('rejects a file with an unknown frontmatter key (fails build, not silently stripped)', async () => {
      const badDir = await mkdtemp(path.join(tmpdir(), 'arcjr-content-unknown-key-'));
      try {
        await writeFile(
          path.join(badDir, 'stray-id.md'),
          `---
id: should-not-be-here
title: Has A Stray Key
date: '2025-01-01'
excerpt: This has a stray id key.
image:
  src: /assets/a.jpg
  alt: A
  aspectRatio: 16 / 9
category: GENERAL
subcategory: intro
---

Body.
`
        );
        await expect(loadPosts(badDir)).rejects.toThrow(/Invalid frontmatter/);
      } finally {
        await rm(badDir, { recursive: true, force: true });
      }
    });
  });

  describe('loadRfcs', () => {
    let dir: string;

    beforeAll(async () => {
      dir = await mkdtemp(path.join(tmpdir(), 'arcjr-content-rfcs-'));
      await writeFile(
        path.join(dir, 'my-rfc.txt'),
        `---
title: My RFC
version: 0.1.0
status: Draft
date: '2025-01-01'
author: Nick Galante
excerpt: An RFC.
tags:
  - draft
visible: true
---

RFC body.
`
      );
    });

    afterAll(async () => {
      await rm(dir, { recursive: true, force: true });
    });

    test('loads rfcs from .txt files with id as filename stem', async () => {
      const entries = await loadRfcs(dir);
      expect(entries).toHaveLength(1);
      expect(entries[0]!.record.id).toBe('my-rfc');
    });

    test('rfc record has no post-only fields', async () => {
      const entries = await loadRfcs(dir);
      const record = entries[0]!.record as unknown as Record<string, unknown>;
      expect(record.slug).toBeUndefined();
      expect(record.image).toBeUndefined();
      expect(record.readingTime).toBeUndefined();
    });
  });
});

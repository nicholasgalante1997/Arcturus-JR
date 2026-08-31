import { describe, test, expect } from 'bun:test';

import { parseFrontmatter } from './parse';
import { serializeFrontmatter } from './serialize';
import { POST_FRONTMATTER_KEY_ORDER, postFrontmatterSchema } from './schema';

const POST_FIXTURE = `---
title: Fun with Caesar Ciphers
date: '2025-05-08'
excerpt: A fun little article about Caesar ciphers.
tags:
  - typescript
  - encryption
image:
  src: /assets/poke-stock/surprised-viridian-forest-gang.jpg
  alt: Surprised pikachu and friends looking into a tree stump hole.
  aspectRatio: 16 / 9
category: SOFTWARE ENGINEERING
subcategory: encryption
readingTime: 8 - 10 minutes
visible: true
---

So, maybe unpopular opinion, but Julius Caesar is without a doubt my favorite Shakespearean play.

## So what is a Caesar Cipher

Let's have some fun.
`;

const RFC_FIXTURE = `---
code: BCP-0001
title: Bit Context Pack (BCP)
version: 0.1.0-draft
status: Draft
date: '2026-02-01'
author: Nick Galante
excerpt: A binary serialization format for structured LLM context.
tags:
  - llm
  - binary-format
visible: true
---

Section 1. Overview.
`;

describe('parseFrontmatter / serializeFrontmatter', () => {
  test('round-trips a post fixture byte-for-byte', () => {
    const { attributes, body } = parseFrontmatter(POST_FIXTURE);
    const result = serializeFrontmatter(
      attributes as Record<string, unknown>,
      body,
      POST_FRONTMATTER_KEY_ORDER
    );
    expect(result).toBe(POST_FIXTURE);
  });

  test('round-trips an rfc fixture byte-for-byte', () => {
    const { attributes, body } = parseFrontmatter(RFC_FIXTURE);
    const result = serializeFrontmatter(
      attributes as Record<string, unknown>,
      body,
      ['code', 'title', 'version', 'status', 'date', 'updated', 'author', 'excerpt', 'tags', 'visible']
    );
    expect(result).toBe(RFC_FIXTURE);
  });

  test('parsed post fixture attributes validate against postFrontmatterSchema', () => {
    const { attributes } = parseFrontmatter(POST_FIXTURE);
    const result = postFrontmatterSchema.safeParse(attributes);
    expect(result.success).toBe(true);
  });

  test('parseFrontmatter is a pure primitive — does not validate', () => {
    const malformed = '---\nnotAValidField: true\n---\n\nBody.\n';
    const { attributes } = parseFrontmatter(malformed);
    expect(attributes).toEqual({ notAValidField: true });
  });
});

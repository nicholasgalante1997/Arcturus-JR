import { describe, expect, test } from 'bun:test';

import type { Post } from '@/types/Post';

import { filterPosts } from './filterPosts';

function post(id: string, options: Partial<Post> = {}): Post {
  return {
    id,
    slug: id,
    title: id,
    date: '2026-01-01',
    excerpt: `${id} excerpt`,
    tags: [],
    image: { src: `/${id}.jpg`, alt: id, aspectRatio: '16 / 9' },
    category: 'GENERAL',
    subcategory: 'test',
    searchTerms: [],
    readingTime: 'Under 1 minute',
    featured: false,
    visible: true,
    ...options
  };
}

describe('filterPosts', () => {
  const posts = [
    post('alpha', { title: 'Rust without regret', tags: ['systems'] }),
    post('beta', {
      excerpt: 'A browser architecture field note',
      category: 'SOFTWARE ENGINEERING',
      searchTerms: ['javascript']
    })
  ];

  test('matches title, excerpt, category, tags, and search terms case-insensitively', () => {
    expect(filterPosts(posts, 'RUST').map(({ id }) => id)).toEqual(['alpha']);
    expect(filterPosts(posts, 'browser').map(({ id }) => id)).toEqual(['beta']);
    expect(filterPosts(posts, 'engineering').map(({ id }) => id)).toEqual(['beta']);
    expect(filterPosts(posts, 'systems').map(({ id }) => id)).toEqual(['alpha']);
    expect(filterPosts(posts, 'JavaScript').map(({ id }) => id)).toEqual(['beta']);
  });

  test('returns all posts for a blank query', () => {
    expect(filterPosts(posts, '   ')).toEqual(posts);
  });
});

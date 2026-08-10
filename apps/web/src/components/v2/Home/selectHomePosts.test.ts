import { describe, expect, test } from 'bun:test';

import type { Post } from '@/types/Post';

import { selectHomePosts } from './selectHomePosts';

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

describe('selectHomePosts', () => {
  test('selects authored feature and excludes it from four recent posts', () => {
    const posts = [
      post('newest'),
      post('chosen', { featured: true }),
      post('third'),
      post('fourth'),
      post('fifth'),
      post('sixth')
    ];

    const selection = selectHomePosts(posts);

    expect(selection.featuredPost?.id).toBe('chosen');
    expect(selection.recentPosts.map(({ id }) => id)).toEqual([
      'newest',
      'third',
      'fourth',
      'fifth'
    ]);
  });

  test('falls back to the newest visible post', () => {
    const selection = selectHomePosts([
      post('hidden', { visible: false, featured: true }),
      post('newest'),
      post('older')
    ]);

    expect(selection.featuredPost?.id).toBe('newest');
    expect(selection.recentPosts.map(({ id }) => id)).toEqual(['older']);
  });
});

import { describe, test, expect } from 'bun:test';

import { createRouter, mergeRouters } from './router';

describe('createRouter', () => {
  test('joins prefix and subpath for non-root routes', () => {
    const router = createRouter('/api/posts').get('/:id', () => new Response('ok'));
    expect(Object.keys(router.routes)).toEqual(['/api/posts/:id']);
  });

  test('root subpath maps to the bare prefix', () => {
    const router = createRouter('/api/posts').get('/', () => new Response('ok'));
    expect(Object.keys(router.routes)).toEqual(['/api/posts']);
  });

  test('accumulates multiple methods on the same path', () => {
    const router = createRouter('/api/posts')
      .get('/:id', () => new Response('get'))
      .put('/:id', () => new Response('put'))
      .delete('/:id', () => new Response('delete'));

    expect(Object.keys(router.routes['/api/posts/:id'] ?? {}).sort()).toEqual(['DELETE', 'GET', 'PUT']);
  });
});

describe('mergeRouters', () => {
  test('combines route tables from multiple routers without collision', () => {
    const posts = createRouter('/api/posts').get('/', () => new Response('posts'));
    const rfcs = createRouter('/api/rfcs').get('/', () => new Response('rfcs'));

    const merged = mergeRouters(posts, rfcs);
    expect(Object.keys(merged).sort()).toEqual(['/api/posts', '/api/rfcs']);
  });
});

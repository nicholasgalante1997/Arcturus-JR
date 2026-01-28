import type { PrefetchQueryOptions } from './prefetch-query';

/**
 * @name StaticPageObject
 * @description Object representing a static page to be prerendered.
 *
 * @example
 * {
 *  path: '/posts',
 *  queries: [
 *    {
 *      queryKey: ['posts'],
 *      queryFn: () => getPosts()
 *    }
 *  ],
 *  styles: ['/css/posts.min.css']
 *}
 */
export type StaticPageObject = {
  path: string;
  queries: PrefetchQueryOptions[];
  styles?: string[];
};

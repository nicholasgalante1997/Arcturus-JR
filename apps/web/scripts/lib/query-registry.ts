import { getCipher } from '@/hooks/useCipher';
import { getCiphers } from '@/hooks/useCiphers';
import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts, getRelatedPosts } from '@/hooks/usePosts';

import lazy from './lazy';

import type { QueryFnName, Registry } from '@arcjr/types';

type QueryFn = typeof getMarkdown | typeof getPosts | typeof getPost | typeof getCiphers | typeof getCipher | typeof getRelatedPosts;

const queries: Readonly<{ name: QueryFnName; fn: QueryFn }[]> = [
  { name: 'getMarkdown', fn: getMarkdown },
  { name: 'getPosts', fn: getPosts },
  { name: 'getPost', fn: getPost },
  { name: 'getCiphers', fn: getCiphers },
  { name: 'getCipher', fn: getCipher },
  { name: 'getRelatedPosts', fn: getRelatedPosts }
] as const;

class StaticPrerenderQueryRegistry implements Registry<QueryFnName, QueryFn> {
  private registry = new Map<QueryFnName, QueryFn>();

  constructor() {
    queries.forEach(({ name, fn }) => this.register(name, fn));
  }

  register(key: QueryFnName, queryFn: QueryFn) {
    this.registry.set(key, queryFn);
    return this;
  }
  request(key: QueryFnName): QueryFn | null {
    return this.registry.get(key) ?? null;
  }
}

export default StaticPrerenderQueryRegistry;

// eslint-disable-next-line prefer-const
let instance: StaticPrerenderQueryRegistry | null = null;

/** @LazyLoad */
export const ll_StaticPrerenderQueryRegistry = () =>
  lazy.initDynConstructor(instance, StaticPrerenderQueryRegistry);

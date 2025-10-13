import { type PrefetchQueryOptions } from './prefetch-query';

export type StaticPageObject = {
  path: string;
  queries: PrefetchQueryOptions[];
};

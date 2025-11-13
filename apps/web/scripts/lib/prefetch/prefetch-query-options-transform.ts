import { ll_StaticPrerenderQueryRegistry } from '../query-registry';

import type { PrefetchQueryOptions } from '../types/prefetch-query';
import type { QueryFnName, SerializablePrefetchQueryOptions } from '@arcjr/types';

export function mapSerializablePrefetchQueryOptionsToStaticPagePrefetchQueryOptions<
  _QueryFnName extends QueryFnName,
  QueryFnParams
>(
  { queryFnName, queryFnParams, queryKey }: SerializablePrefetchQueryOptions<_QueryFnName, QueryFnParams>,
  type: 'dynamic' | 'static',
  dynamicParams?: QueryFnParams
): PrefetchQueryOptions {
  const qkeys = [...queryKey];
  if (type === 'dynamic' && dynamicParams) {
    qkeys.push(typeof dynamicParams === 'string' ? dynamicParams : JSON.stringify(dynamicParams));
  }

  const queryFnRegistry = ll_StaticPrerenderQueryRegistry();
  const qfn = queryFnRegistry.request(queryFnName);

  if (!qfn) {
    throw new Error(`Query function ${queryFnName} not found in registry`);
  }

  if (type === 'dynamic' && !dynamicParams) {
    throw new Error(`Dynamic parameters are required for dynamic query functions`);
  }

  const qfnParams = type === 'dynamic' ? dynamicParams! : queryFnParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryFn = () => qfn(qfnParams as any);

  return {
    queryKey: qkeys,
    queryFn
  };
}

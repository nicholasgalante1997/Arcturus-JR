export type PrefetchQueryOptions<R = any> = {
  queryKey: string[];
  queryFn: () => Promise<R>;
};
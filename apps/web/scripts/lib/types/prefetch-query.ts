export type PrefetchQueryOptions<R = unknown> = {
  queryKey: string[];
  queryFn: () => Promise<R>;
};

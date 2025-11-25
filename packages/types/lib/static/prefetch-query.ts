/**
 * @name PrefetchQueryOptions
 * @template {unknown} R
 * @type {PrefetchQueryOptions<R>}
 * @description Options/Configuration for prefetching a @tanstack/react-query useQuery hook on the server,
 * used during the static prerendering process.
 *
 * @example
 * {
 *  queryKey: ['posts'],
 *  queryFn: () => getPosts()
 *}
 */
export type PrefetchQueryOptions<R = unknown> = {
  queryKey: string[];
  queryFn: () => Promise<R>;
};

export type GetMarkdownQueryFnName = "getMarkdown";
export type GetPostsQueryFnName = "getPosts";
export type GetCiphersQueryFnName = "getCiphers";
export type GetPostQueryFnName = "getPost";
export type GetCipherQueryFnName = "getCipher";

export type QueryFnName =
  | GetCipherQueryFnName
  | GetCiphersQueryFnName
  | GetMarkdownQueryFnName
  | GetPostQueryFnName
  | GetPostsQueryFnName;

export type SerializablePrefetchQueryOptions<_QueryFnName extends QueryFnName, QueryFnParams> = {
  queryKey: string[];
  queryFnName: _QueryFnName;
  queryFnParams: QueryFnParams;
};

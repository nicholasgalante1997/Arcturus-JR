import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Loader } from '@/components/Base/Loader';
import ArcSentry from '@/config/sentry/config';
import { pipeline } from '@/utils/pipeline';

import { type SEQProps } from './types';

/**
 * Suspense Enabled Query Wrapper Component
 *
 * _Concepts_
 *
 * @see https://react.dev/reference/react/Suspense
 * @see https://react.dev/reference/react/use
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/suspense
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/suspense#using-usequerypromise-and-reactuse-experimental
 * @see https://www.npmjs.com/package/react-error-boundary
 *
 * A UseQueryResult will most commonly represent the result of an asynchronous network request,
 * that provides data to a specific part of a React application.
 * In that case, there is likely a period of time in which your data is in a loading or fetching state,
 * and where dependent parts of the application are coerced into displaying a temporary rendering state.
 *
 * What this most commonly amounts to from a code maintenance perspective is the following:
 *
 * ```tsx
 * import React from 'react';
 * import { useQuery } from '@tanstack/react-query';
 *
 * import PostsModel from './models/Posts';
 *
 * ...
 *
 * const fetchPost = async (id) => {
 *     return new PostsModel().fetchPost(id);
 * }
 *
 * const usePost = (id) => useQuery({
 *     queryKey: ['post', id],
 *     queryFn: () => fetchPost(id)
 * });
 *
 * function Post({ id }) {
 *     const { data: post, isLoading, isError, error } = usePost(id);
 *     if (isLoading) return <Loader />;
 *     if (isError) return <div>Error: {error.message}</div>;
 *     return (
 *       <div>
 *         <h1>{post.title}</h1>
 *         <p>{post.body}</p>
 *       </div>
 *     );
 * }
 * ```
 *
 * And this would be considered the absolute cleanest of cases.
 *
 * In most cases, you likely are performing some side effect once you have the data loaded,
 * or some transformation or sanitization to the data prior to passing it to the UI layer.
 *
 * This concept is not novel, you have data provided from an asynchronous source,
 * and you'd like to defer rendering the application's UI until that data is available.
 *
 * What is unfortunate is how now our component becomes riddled with conditional early returns,
 * and boilerplate loading/error code.
 *
 * What we intend to do is simple,
 *
 * When our data is loading, represent a suspended loading state.
 * When our data is in error, show a fallback UI.
 * When our data is available, show the intended UI.
 *
 * All of these states have patterns within React today,
 * namely Suspense and React Error Boundaries.
 *
 * We can leverage both in conjunction with React Query to simplify our Component composition.
 *
 * The pattern can ultimately be simpler:
 *
 * Example
 * ```tsx
 * import React from 'react';
 *
 * import { SuspenseEnabledQueryProvider } from '@/components/Base/SEQ';
 * import { useMarkdown } from '@/hooks/useMarkdown';
 * import { useGetPosts } from '@/hooks/usePosts';
 * import { pipeline } from '@/utils/pipeline';
 *
 * import HomeView from './View';
 *
 * function Home() {
 *  const markdown = useMarkdown('/content/home.md');
 *  const posts = useGetPosts();
 *  return (
 *    <SuspenseEnabledQueryProvider>
 *      <HomeView queries={[markdown, posts]} />
 *    </SuspenseEnabledQueryProvider>
 *  );
 * }
 * ...
 *
 * import { UseQueryResult } from '@tanstack/react-query';
 *
 * import { MarkdownDocument, Post } from '@/types';
 *
 * type MarkdownQuery = UseQueryResult<MarkdownDocument>;
 * type PostsQuery = UseQueryResult<Post[]>;
 *
 * export interface HomeViewProps {
 *   queries: [MarkdownQuery, PostsQuery];
 * }
 *
 *
 * function HomeView({ queries }: HomeViewProps) {
 *   const [_markdown, _posts] = queries;
 *   const markdown = use(_markdown.promise);
 *   const posts = use(_posts.promise);
 *   return (
 *     <React.Fragment>
 *       <div className="markdown-content">
 *         <Markdown markdown={markdown.markdown} />
 *       </div>
 *       <h2 className="recent-posts-label">Recent Posts</h2>
 *       <PostCardsList posts={posts.slice(0, 3)} />
 *     </React.Fragment>
 *   );
 * }
 *
 * ```
 */
function SuspenseEnabledQuery({
  fallback: Fallback = DefaultFallbackErrorComponent,
  placeholder = <Loader />,
  children
}: SEQProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={ArcSentry.sentryReactDefaultErrorHandler}
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <Fallback error={error} reset={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={placeholder}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default pipeline(React.memo)(SuspenseEnabledQuery) as React.MemoExoticComponent<
  typeof SuspenseEnabledQuery
>;

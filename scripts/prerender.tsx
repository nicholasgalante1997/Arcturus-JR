/**
 * Converting this CSR App to an SSG App
 *
 * Our whole application has a single top level entrypoint: <App />
 * Which is itself, a very thin wrapper around a BrowserRouter (react-router)
 *
 * Our pages derive their content from the following pattern:
 *
 * 1. Page Mounts
 * 2. useQuery is dispatched to fetch data/markdown for the page
 * 3. The page suspends using React.Suspense in conjunction with react-query's
 *    use(useQuery(...).promise) experimental pattern
 *
 * We will also need to fetch the react-query useQueries while prerendering so
 * that our pages have meaningful content.
 *
 * Sources:
 *
 * [React-Router Static Site Gen Custom Framework docs](https://reactrouter.com/start/data/custom#server-rendering)
 * [React-Query Server Rendering and Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
 * [React prerender docs](https://react.dev/reference/react-dom/static/prerender)
 *
 * To convert this to an SSG app, we need to:
 *
 * 1.
 */
import 'dotenv/config';

import posts from '@public/content/posts.json';

import React, { StrictMode } from 'react';
import { prerender } from 'react-dom/static.edge';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { dehydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getMarkdown } from '@/hooks/useMarkdown';
import { getPost } from '@/hooks/usePost';
import { getPosts } from '@/hooks/usePosts';
import { getLazyLoadedRoutes } from '@/routes/routes';

import { createMockRequest } from './lib/request';

process.env['ARCJR_PRERENDERING'] = 'true';

/**
 * 2. Determine paths
 */
const NON_DYNAMIC_ROUTES = {
  HOME: 'https://nickgalante.tech/',
  POSTS: 'https://nickgalante.tech/posts',
  ABOUT: 'https://nickgalante.tech/about',
  CONTACT: 'https://nickgalante.tech/contact'
} as const;
const DYNAMIC_ROUTES = { POST: 'https://nickgalante.tech/post/:id' } as const;
const slugs = posts.filter(({ visible }) => visible).map((post) => post.id);

/**
 * 3. Create a static route handler for our routes
 *
 * What happens when we call `createStaticHandler`
 * @see https://github.com/remix-run/react-router/blob/d1c272a724c7bbbfb7705dd3bd0cdff156c70e17/packages/react-router/lib/router/router.ts#L3524
 *
 * TLDR -
 *
 * 1. Checks if routes is a valid Array<RouteObject>
 * 2. Creates dataRoutes using `convertRoutesToDataRoutes(routes)` @see https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/utils.ts#L788
 *    Which maps through our provided routes, and returns a AgnosticDataIndexRouteObject or a AgnosticDataNonIndexRouteObject accordingly.
 * 3. Creates a bound async `query` fn used to prefetch data loaders on the server (We dont use data loaders in this app)
 *    `query` accepts a Request as a required argument, and options as an optional second argument
 *    The `query` fn does the following:
 *      - Creates a URL from new URL(req.url)
 *      -
 *
 */

console.log('Creating the prerender [react-router] StaticHandler');
const { query, dataRoutes } = createStaticHandler(getLazyLoadedRoutes());

for (const pageObject of createStaticPageObjects()) {
  console.log(`Attempting Prerendering ${pageObject.path}`);
  try {
    console.log('Creating a query client');
    const queryClient = new QueryClient();

    console.log('Prefetching queries for page %s', pageObject.path);
    // Prefetch all queries for this page
    await Promise.all(
      pageObject.queries.map((q) =>
        queryClient.prefetchQuery({
          queryKey: q.queryKey,
          queryFn: q.queryFn
        })
      )
    );

    console.log('Finished prefetching all queries!');

    // dehydrate queryClient state to store later
    const dehydrated = dehydrate(queryClient);

    console.log('Dehydrated query client state');

    console.log('Trying to create a mock request...');
    const mockRequest = createMockRequest(pageObject.path);
    console.log('Created mock request %s', mockRequest.url);

    console.log('Querying react router static conetxt');
    const staticContext = await query(mockRequest);
    console.log('Finished querying static conetxt');

    console.log('Checking if "staticContext" is a Response');
    if (staticContext instanceof Response) throw new Error('');
    console.log('Looks like its not a Response! Nice!');

    console.log('Creating a [react-router] StaticRouter');
    const router = createStaticRouter(dataRoutes, staticContext);
    console.log('Finished creating a react-router StaticRouter');

    console.log('Prerendering the StaticRouterProvider');
    const { prelude, postponed } = await prerender(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <StaticRouterProvider router={router} context={staticContext} />
        </QueryClientProvider>
      </StrictMode>
    );

    console.log('Prerendered!');

    const mockResponse = new Response(prelude, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

    const text = await mockResponse.text();

    console.log(`Prerendered ${pageObject.path}`, text);
  } catch (e) {
    console.error(`Error prerendering ${pageObject.path}`, e);
    process.exit(1);
  }
}

/**
 * What does a page need to know for it to be prerendered?
 *
 * - It needs to know its path/url
 * - It needs to know all the queries that it needs to prefetch
 *
 * Is that it?
 */

type PrefetchQueryOptions<R = any> = {
  queryKey: string[];
  queryFn: () => Promise<R>;
};

type StaticPageObject = {
  path: string;
  queries: PrefetchQueryOptions[];
};

function createStaticPageObjects(): StaticPageObject[] {
  return [
    {
      path: NON_DYNAMIC_ROUTES.HOME,
      queries: [
        {
          queryKey: ['markdown', '/content/home.md'],
          queryFn: () => getMarkdown('/content/home.md')
        },
        {
          queryKey: ['posts'],
          queryFn: () => getPosts()
        }
      ]
    },
    {
      path: NON_DYNAMIC_ROUTES.ABOUT,
      queries: [
        {
          queryKey: ['markdown', '/content/about.md'],
          queryFn: () => getMarkdown('/content/about.md')
        }
      ]
    },
    {
      path: NON_DYNAMIC_ROUTES.CONTACT,
      queries: []
    },
    {
      path: NON_DYNAMIC_ROUTES.POSTS,
      queries: [
        {
          queryKey: ['posts'],
          queryFn: () => getPosts()
        }
      ]
    },
    ...createStaticPostPageObjects()
  ];
}

function createStaticPostPageObjects(): StaticPageObject[] {
  return slugs.map((postId) => ({
    path: DYNAMIC_ROUTES.POST.replace(':id', encodeURIComponent(postId)),
    queries: [
      {
        queryKey: ['post', postId],
        queryFn: () => getPost(postId)
      }
    ]
  }));
}

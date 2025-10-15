import 'dotenv/config';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import debug from 'debug';
import _path from 'path';
import React from 'react';
import { prerender } from 'react-dom/static.edge';
import { createStaticHandler, createStaticRouter } from 'react-router';
import { inspect } from 'util';

import App, { Document } from '@/App';
import { lazyRoutes } from '@/routes/routes';

import { getBrowserESMBundles } from './lib/browser-scripts';
import { createDehydrationWindowAssignmentScript } from './lib/dehydration';
import { getOutputFilePath } from './lib/output';
import { createStaticPageObjects } from './lib/pages';
import { createMockRequest } from './lib/request';

const namespace = 'arc:prerenderer';
const start = performance.now();
const prerenderer_logger_success = debug(namespace + ':success');

interface PrerenderMetrics {
  duration: number;
  status: PrerenderOutcome;
  error?: unknown;
}

enum PrerenderOutcome {
  SUCCESS = 'success',
  FAILED = 'failed'
}

const reportMetrics: Record<string, PrerenderMetrics> = {};

$prerender()
  .then(() => {
    const end = performance.now();
    prerenderer_logger_success(`Prerendering completed in ${(end - start).toFixed(2)}ms`);
    prerenderer_logger_success('############ Prerender Report ############');
    prerenderer_logger_success(`Built: ${getNumOfSucceededPrerenderJobs()} Artifacts`);
    prerenderer_logger_success(`Failed: ${getNumOfFailedPrerenderJobs()} Prerender Tasks`);

    const [task, duration] = getLongestPrerenderJob();
    prerenderer_logger_success(`Longest Prerender Job: ${task} ${duration.toFixed(2)}ms`);
    prerenderer_logger_success('##########################################');
  })
  .catch((e) => {
    debug(namespace + ':fatal')('Fatal error during prerender task', e);
  });

/**
 * The 'Prerender' Task
 *
 * This script iterates through a number of predefined Page DTOs
 * and prefetches all applicable network requests on the server,
 * using @tanstack/react-query's QueryClient.prefetchQuery method,
 * and dehydrates the saturated Query Client instance on the server.
 * Then, it will setup a StaticRouter using react-router's createStaticHandler,
 * and our exported lazyRoutes RouteObject array.
 *
 * Caveats: We're leveraging an experimental suspenseful pattern,
 * where instead of using useSuspenseQuery, we're using a pattern where we join
 * React 19's `use` API with the experimental @tanstack/react-query
 * UseQueryResult.promise & experimental_prefetchinrender.
 * This basically opts us into Suspenseful UseQuery fetches. It's so great.
 * However, this means we need to prefetch **all** of our queries on the server,
 * at prerender time, or the React `prerender` function will just fucking hang forever
 * on an unresolved Suspenseful promise and then we're borked.
 *
 * So again, **every useQuery call needs to be prefetched during prerender**
 * If you miss one, it's the same as missing all of them.
 *
 * We can then dehydrate the queryClient with the `dehydrate` serializing function,
 * and now we have the Server QueryClient state in a serializable format
 * that we can hydrate into our app as long as we pass it through with the prerendered markup.
 *
 * We can pass the Server queryClient instance into our App at prerender time so that
 * when our components attempt to fetch data from the result of useQuery calls,
 * they have already resolved and succeeded so we see the full painted view with all the data.
 *
 * It's really actually beautiful because it's simple.
 *
 * TODO see if you can AST parse src files and programmatically determine useQuery usage
 *
 * Continuing...
 *
 * Typically, createStaticHandler is used in Http Servers, and can convert a Request
 * to a collection of dataRoutes, and an asynchronous query callback based on configured routes.
 *
 * Since we're not working in a server, and instead are just prerendering in a server-side job/task
 * we don't have a Request.
 *
 * We can however mock requests for each page object that we're statically scaffolding.
 *
 * We can pass the then instantiated `router` and `context` into App to be passed through
 * to the IsomorphicRoutingLayer.
 */
async function $prerender() {
  /**
   * Denote in the process environment that we are in a 'prerendering' task
   */
  process.env['ARCJR_PRERENDERING'] = 'true';

  /**
   * Setup a debugger
   */
  const prerenderer_logger_debugger = debug(namespace + ':debug');

  /**
   * Creating a static route handler for our routes
   *
   * What happens when we call `createStaticHandler`
   * @see https://github.com/remix-run/react-router/blob/d1c272a724c7bbbfb7705dd3bd0cdff156c70e17/packages/react-router/lib/router/router.ts#L3524
   */
  prerenderer_logger_debugger('Creating a StaticHandler instance...');
  const { query, dataRoutes } = createStaticHandler(lazyRoutes());
  prerenderer_logger_debugger('StaticHandler created!');

  /**
   * Iterate through each Page DTO
   */
  for (const { path, queries } of createStaticPageObjects()) {
    /**
     * Metric tracking + Observability
     */
    const startTime = performance.now();

    /**
     * Create a URL object from the Page path qualifier
     */
    const url = new URL(path);
    prerenderer_logger_debugger(`Starting "prerender" task for ${url.pathname}`);

    const metricsKey = 'ARC_PRERENDER_PAGE___:' + url.pathname;

    try {
      /**
       * Create a fresh QueryClient instance
       */
      prerenderer_logger_debugger('Starting "prefetch" subtask...');
      prerenderer_logger_debugger('Creating a fresh @tanstack/react-query QueryClient instance...');
      const queryClient = new QueryClient();

      /**
       * Concurrently attempt to fetch all queries for the Page
       */
      prerenderer_logger_debugger('Prefetching queries for page %s', url.pathname);
      await Promise.all(
        queries.map((q) =>
          queryClient.prefetchQuery({
            queryKey: q.queryKey,
            queryFn: q.queryFn
          })
        )
      );
      prerenderer_logger_debugger(
        'Finished prefetching all queries! Prefetching job complete for %s',
        url.pathname
      );

      /**
       * Attempt to serialize the queryClient state
       * so it can be passed with the markup to the client
       */
      prerenderer_logger_debugger('Starting "dehydration" subtask...');
      const dehydrated = dehydrate(queryClient);
      prerenderer_logger_debugger('Finished serializing the dehydrated query client!');

      prerenderer_logger_debugger('Starting "react-router-static-context" subtasks...');

      /**
       * Create a Mock Request object to be used in the createStaticContext phase
       */
      prerenderer_logger_debugger('Trying to create a mock request for %s...', url.pathname);
      const mockRequest = createMockRequest(path);
      prerenderer_logger_debugger('Created mock request %s', mockRequest.url);

      /**
       * Create a React-Router StaticQueryProvider StaticContext
       * from the Mock Request object
       */
      prerenderer_logger_debugger('Querying react router static context');
      const staticContext = await query(mockRequest);
      prerenderer_logger_debugger('Finished querying static context');

      prerenderer_logger_debugger(
        'Checking if react-router-query returned a Response instead of a StaticContext...'
      );
      if (staticContext instanceof Response) throw new Error('');
      prerenderer_logger_debugger('Whew, it didnt.');

      /**
       * Create a StaticRouter object from dataRoutes and staticContext
       */
      prerenderer_logger_debugger('Creating a [react-router] StaticRouter');
      const router = createStaticRouter(dataRoutes, staticContext);
      prerenderer_logger_debugger('Finished creating a react-router StaticRouter');

      /**
       * Attempt to prerender the entire App inside an HTML Document
       * which we can then parse into a Mock Response,
       * and collect into a text string and write it to a local file
       * path within the ./dist folder that gets published and served
       *
       * Denote to the App (Isomorphic) that we want the `Server` Layer providers
       * Prerender the App with
       * - the prefetched QueryClient instance
       * - the StaticRouter data object
       * - the StaticRouter context object
       *
       * Then indicate to the `prerender` function that we want to bootstrap
       * - A script containing `window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydrated)};`
       * - The client hydration ESM scripts bundled by webpack (module, async)
       *
       * TODO
       *
       * We're likely losing time when we do things like
       *
       * - Take the prerender markup stream and convert it to a Response
       * - Await the response.text() promise resolution
       * - Await writing out the text result to a file
       *
       * Like we're doing a lot of converting UInt8Array streams into strings
       * then back into streams (file writing) just to await resolution again,
       * like we can probably just pipeline the whole thing. Its all just fucking streams.
       *
       * [Insert gif of guy screaming Cloth is just little hairs]
       * ![Cloth is just little hairs](https://cdn.sanity.io/images/7lpknm4h/production/b4c29868c7f32ff304d66d28b1ca834f3c801163-2650x1500.jpg?w=700)
       *
       */
      prerenderer_logger_debugger('Starting "prerender" subtask...');
      const jsr = 'server' as const;
      const { prelude } = await prerender(
        <Document>
          <App
            layers={{
              data: { javascriptRuntime: jsr, server: { client: queryClient } },
              router: { javascriptRuntime: jsr, server: { router, context: staticContext } }
            }}
          />
        </Document>,
        {
          bootstrapModules: getBrowserESMBundles(),
          bootstrapScriptContent: createDehydrationWindowAssignmentScript(dehydrated)
        }
      );
      prerenderer_logger_debugger('Finished "prerender" subtask...');

      prerenderer_logger_debugger('Starting "stream-transform" subtask...');
      const html = new Response(prelude, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });

      const text = await html.text();
      prerenderer_logger_debugger('Finished "stream-transform" subtask...');

      try {
        const outputPath = _path.resolve(process.cwd(), 'dist', getOutputFilePath(url.pathname));
        await Bun.write(outputPath, text, { createPath: true });
        prerenderer_logger_debugger('Wrote prerendered HTML to %s', outputPath);
      } catch (e) {
        prerenderer_logger_debugger.extend('error')(
          'Error writing prerendered HTML file for %s',
          url.pathname,
          e
        );
        throw e;
      }

      prerenderer_logger_debugger(`Prerendered ${url.pathname}`);
      prerenderer_logger_success(`✅ Prerendered ${url.pathname}`);

      const endTime = performance.now();
      reportMetrics[metricsKey] = {
        duration: endTime - startTime,
        status: PrerenderOutcome.SUCCESS
      };
    } catch (e) {
      const elog = debug(namespace + ':error');
      elog(`❌ Error prerendering ${path}`);
      reportMetrics[metricsKey] = {
        duration: performance.now() - startTime,
        status: PrerenderOutcome.FAILED,
        error: e
      };
      elog(inspect(reportMetrics, false, 4, true));
      process.exit(1);
    }
  }
}

function getConsolidatedReportOutcomes() {
  return Object.entries(reportMetrics).map(([k, v]) => ({ key: k, ...v }));
}

function getNumOfSucceededPrerenderJobs() {
  const outcomes = getConsolidatedReportOutcomes();
  return outcomes.filter((o) => o.status === PrerenderOutcome.SUCCESS).length;
}

function getNumOfFailedPrerenderJobs() {
  const outcomes = getConsolidatedReportOutcomes();
  return outcomes.filter((o) => o.status === PrerenderOutcome.FAILED).length;
}

function getLongestPrerenderJob(): [string, number] {
  let longest = -Infinity;
  let task = 'null';
  for (const { duration, key } of getConsolidatedReportOutcomes()) {
    if (duration > longest) {
      longest = duration;
      task = key;
    }
  }
  return [task, longest] as const;
}

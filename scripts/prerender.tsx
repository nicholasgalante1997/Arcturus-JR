import 'dotenv/config';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import debug from 'debug';
import _path from 'path';
import React, { StrictMode } from 'react';
import { prerender } from 'react-dom/static.edge';
import { createStaticHandler, createStaticRouter } from 'react-router';

import App from '@/App';
import { lazyRoutes } from '@/routes/routes';

import { getBrowserESMBundles } from './lib/browser-scripts';
import { createDehydrationWindowAssignmentScript } from './lib/dehydration';
import { getWebpackBundledHTML } from './lib/html';
import HTMLRewriterEmbedder from './lib/models/HTMLRewriter';
import { getOutputFilePath } from './lib/output';
import { createStaticPageObjects } from './lib/pages';
import { createMockRequest } from './lib/request';

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
 * typically, createStaticHandler is used in Http Servers, and can convert a Request
 * to a collection of dataRoutes, and an asynchronous query callback based on configured routes.
 * This pattern
 */
async function $prerender() {
  /**
   * Denote in the process environment that we are in a 'prerendering' task
   */
  process.env['ARCJR_PRERENDERING'] = 'true';

  /**
   * Setup a debugger
   */
  const prerenderer_logger = debug('arc:prerenderer');

  /**
   * Creating a static route handler for our routes
   *
   * What happens when we call `createStaticHandler`
   * @see https://github.com/remix-run/react-router/blob/d1c272a724c7bbbfb7705dd3bd0cdff156c70e17/packages/react-router/lib/router/router.ts#L3524
   */
  prerenderer_logger('Creating a StaticHandler instance...');
  const { query, dataRoutes } = createStaticHandler(lazyRoutes());
  prerenderer_logger('StaticHandler created!');

  for (const { path, queries } of createStaticPageObjects()) {
    const url = new URL(path);
    prerenderer_logger(`Starting "prerender" task for ${url.pathname}`);

    try {
      prerenderer_logger('Starting "prefetch" subtask...');
      prerenderer_logger('Creating a fresh @tanstack/react-query QueryClient instance...');
      const queryClient = new QueryClient();

      prerenderer_logger('Prefetching queries for page %s', url.pathname);
      await Promise.all(
        queries.map((q) =>
          queryClient.prefetchQuery({
            queryKey: q.queryKey,
            queryFn: q.queryFn
          })
        )
      );
      prerenderer_logger('Finished prefetching all queries! Prefetching job complete for %s', url.pathname);

      prerenderer_logger('Starting "dehydration" subtask...');
      const dehydrated = dehydrate(queryClient);
      prerenderer_logger('Finished serializing the dehydrated query client!');

      prerenderer_logger('Starting "react-router-static-context" subtasks...');

      prerenderer_logger('Trying to create a mock request for %s...', url.pathname);
      const mockRequest = createMockRequest(path);
      prerenderer_logger('Created mock request %s', mockRequest.url);

      prerenderer_logger('Querying react router static context');
      const staticContext = await query(mockRequest);
      prerenderer_logger('Finished querying static context');

      prerenderer_logger('Checking if react-router-query returned a Response instead of a StaticContext...');
      if (staticContext instanceof Response) throw new Error('');
      prerenderer_logger('Whew, it didnt.');

      prerenderer_logger('Creating a [react-router] StaticRouter');
      const router = createStaticRouter(dataRoutes, staticContext);
      prerenderer_logger('Finished creating a react-router StaticRouter');

      /**
       * Okay now <App /> contains the whole app, so we don't need to 
       */

      prerenderer_logger('Starting "prerender" subtask...');
      const jsr = 'server' as const;
      const { prelude } = await prerender(
        <StrictMode>
          <App
            layers={{
              data: { javascriptRuntime: jsr, server: { client: queryClient } },
              router: { javascriptRuntime: jsr, server: { router, context: staticContext } }
            }}
          />
        </StrictMode>,
        {
          bootstrapModules: getBrowserESMBundles(),
          bootstrapScriptContent: createDehydrationWindowAssignmentScript(dehydrated),

        }
      );
      prerenderer_logger('Finished "prerender" subtask...');

      /**
       * TODO Nick we might not need the below now that App is a self contained document
       */

      prerenderer_logger('Starting "stream-transform" subtask...');
      const html = new Response(prelude, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });

      const text = await html.text();
      prerenderer_logger('Finished "stream-transform" subtask...');

      // prerenderer_logger('Starting "html-embedding" subtask...');
      // const webpackHTML = await getWebpackBundledHTML();
      // const rewriter = new HTMLRewriterEmbedder({
      //   body: text,
      //   head: createDehydrationWindowAssignmentScript(dehydrated)
      // });
      // const outputHTML = rewriter.transform(webpackHTML);
      // prerenderer_logger('Finished "html-embedding" subtask!');

      try {
        const outputPath = _path.resolve(process.cwd(), 'dist', getOutputFilePath(url.pathname));
        await Bun.write(outputPath, text, { createPath: true });
        prerenderer_logger('Wrote prerendered HTML to %s', outputPath);
      } catch (e) {
        prerenderer_logger.extend('error')('Error writing prerendered HTML file for %s', url.pathname, e);
        throw e;
      }

      prerenderer_logger(`Prerendered ${url.pathname}`);
    } catch (e) {
      prerenderer_logger.extend('error')(`Error prerendering ${path}`, e);
      process.exit(1);
    }
  }
}

$prerender().then().catch();

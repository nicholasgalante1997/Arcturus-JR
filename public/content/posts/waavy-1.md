---
slug: "waavy-1"
visible: true
title: "Release Updates for June 2025, Waavy v0.1.6 (Pre-Release)"
---

I'm dropping a very quick blog post to draw some attention to some technical work that's I've conducted in late May, June. If you notice a period where technical writing lags, that's likely becuase things are actually getting done, albeit usually briefly.

## Waavy & Waavy-Rs

[Github](https://github.com/nicholasgalante1997/waavy)

### How it Works

Waavy is a tool you can use to server side render React components in non-javascript server runtimes. It's inspired by an unholy dream I had where I was SSRing React components in an Actix Web server. Well, a dream deferred is a dream denied. So here we are.

The internal composition is mostly Typescript/TSX, but it's intended to be built in a Bun javascript runtime as opposed to a standalone node.js runtime.

> As a rule of thumb, I really try not to get excited about new fads in the javascript ecosystem, but Bun is challenging that belief with a vigor.

Bun has support for what they call "Single File Executables", which is, by and by, a means of creating a standalone executable from a javascript or typescript file. Meaning you technically do not need a javascript runtime to run it. Bun can bundle everything needed to run the script into a single file executable, which makes it pretty portable, (but also recklessly large, we'll talk about this later). So this gave me the idea, could we decouple Server Side React from javascript's unholy grasp? TLDR, yeah, probably.

Let's break into a high level technical overview.

### High Level Overview

The approach is pretty simple. You should be able to provide Waavy a path to a component, and metadata, and Waavy should be able to provide you back with a stream of data that represents the rendered component markup stream, without relying on consumers being in a javascript server environment.  

#### Component Determination

Bun treats Typescript like a first class citizen, and does not require you to transpile your Typescript code. We can leverage this, in conjunction with dynamic imports to load a valid Javascript or Typescript module from an arbitrary location into the engine's evaluation scope. In supplying a path argument to `waavy`, under the hood, we'll attempt to resolve the path (if it's not absolute) relative to the process working directory, using `await import(path)` syntax. You can additionally provide an option within the metadata, `name`, which works in conjunction with this dynamic import strategy to resolve named exports. If you leave the `name` option undefined, then we'll assume that the supplied path leverages a default export, and we'll attempt to load the default module into the calling scope. If we can't resolve a valid React component from the path you've provided, the process stops here and falls back to rendering the default or provided error page to an alternate stream (typically stderr).

This approach is pretty handy, as typically within Javascript Server runtimes that are setup to serve React pages via server rendering, will require bundler configuration to work with JSX/TSX. We actually don't need to do that here or add that additional level of complexity, we treat JSX and TSX as first class citizens (Bun does on our behalf), and since this is all baked into the executable's engine, the invoking server scope can circumvent needing to load the JSX/TSX module entirely, it can just reference a location where the Component can be loaded from and the internal `waavy` tooling will resolve the Component module.

I've attached some examples from the `waavy-rs` library of what this ends up looking like from a calling scope, which you can view below:

<small style="font-size:10px;font-style:italic;">The examples below leverage the blocking `render_to_string` api, but `waavy-rs` offers a non-blocking and streaming api as well.</small>

```rs
// Simple rendering
let html = WaavyRenderer::new()
    .render_to_string("./App.tsx").await?;

// With props and caching
let html = WaavyRenderer::new()
    .props(json!({ "user": { "id": 123 } }))?
    .cache("bunfs", "secret-key")
    .render_to_string("./UserDashboard.tsx").await?;

// Full production setup
let html = WaavyRenderer::new()
    .props(user_data)?
    .cache("bunsqlite3", "prod-key")
    .bootstrap(["./hydration.js"])
    .selector("#app")
    .error_component("./ErrorPage.tsx", None)
    .request(request_context)?
    .render_to_string("./Page.tsx").await?;
```

#### Props and Prop Determination

Prop derivation was the next logical step. We have access to the Component, we've resolved it and validated it, now we need to construct the necessary props to render the component in this server environment.

We take two approaches here.

##### Props Passed From The Calling Server

Approach One, passing props directly from your invoking server. This is the pattern I personally foresee being of a high value. If your team is writing it's web server in another language, it's likely because your team's affinity and proficiency with that language has merited you to do so. So to that regard, you would likely want to perform the data loading/prop loading in that language in the server's request response handler, and then pass the loaded values to the `waavy` engine to render the loaded Component with. This is the typical pattern you'd take if you were loading data from a database from within your server, and attempting to make that data available to your Component for server render.

We make this option available if your props are serializable. We use a couple different methods to evaluate serializability, but this primarily means that your **top level React page props are not expecting functions but serializable (let's say JSON) values.**

I've got an example above of what this looks like above, but hey what the hell, I'll paste it below too. Why not.  

```rs
// With props
let html = WaavyRenderer::new()
    .props(json!({ "user": { "id": 123 } }))?
    .render_to_string("./UserDashboard.tsx").await?;
```

##### Props Derived From a Typescript/Javascript Loader

Let's say that for your circumstances, there's no way to serialize *all* of the props needed to server side render your React component from this agnostic calling environment. The `waavy` engine has a supplementary pattern in place, largely derived (you can read this as *stolen*) from the next.js framework, where if you export a named export `waavy` from the provided Component file path, the `waavy` engine will load that module alongside the Component into the calling scope, and it will attempt to call a `dataLoader` field on the module, and it will attempt to spread the data resolved from `dataLoader` into the initially dispatched props prior to rendering the Component. In practice, it ends up looking like the following function(s):

```ts
export async function getWaavyModules(
  pathToFile: string,
  options?: RenderActionOptions,
) {
  const waavyFileModules = await load(pathToFile, "waavy");
  if (waavyFileModules == null) {
    /** Not using `waavy` exports pattern */
    options?.verbose &&
      logger.extend("warn")(
        "%s is not using `waavy` exports modules.",
        pathToFile,
      );

    return null;
  }

  return waavyFileModules;
}

export async function getComponentProps<Props extends {} = {}>(
  pathToComponent: string,
  options: RenderActionOptions,
) {
  const waavyFileModules = await getWaavyModules(pathToComponent, options);

  let props = getPropsFromOptions(options); /** Initial or default props */
  const tprops =
    structuredClone(
      props,
    ); /** Backup copy in case we corrupt props in the loader phase */

  try {
    /** Try to fetch any per request props */
    props = await fetchLoaderProvProps(
      waavyFileModules,
      props,
      options.request,
    );
  } catch (e) {
    options.verbose &&
      logger.extend("error")(
        e instanceof PropDataLoaderException ? e?.message : e,
      );

    /** Reassign to safe copy */
    props = tprops;
  }

  return props as Props;
}

/**
 * Loads props from options or sets props to the default value, an empty object.
 */
export function getPropsFromOptions(
  options: RenderActionOptions,
): Record<string, unknown> {
  options.props ||= {};
  try {
    return typeof options?.props === "string"
      ? JSON.parse(options?.props)
      : options.props;
  } catch (e) {
    return {};
  }
}

export async function fetchLoaderProvProps<Props extends {} = {}>(
  waavyFileModules: any,
  props: Props,
  request: Partial<Request> = {},
) {
  if (
    waavyFileModules &&
    "dataLoader" in waavyFileModules &&
    typeof waavyFileModules?.dataLoader === "function"
  ) {
    try {
      const loader = waavyFileModules?.dataLoader as LoaderFn<typeof props>;
      const loaderResult = await Promise.resolve(
        await loader(request, getWaavyRenderContext()),
      );
      if (
        loaderResult &&
        loaderResult?.data &&
        typeof loaderResult?.data === "object"
      ) {
        props = { ...props, ...loaderResult?.data };
      }
    } catch (e) {
      throw e instanceof Error ? e : new PropDataLoaderException(String(e));
    }
  }

  return props as Props;
}
```

So if it is entirely impossible for your props to be fully serializable, you can take a hybrid approach of loading whatever props are serializable from the invoking server scope, and then creating a loader that would supplement the missing non-serializable props, since these are inevitably merged and provided to the Component in the server rendering phase.

##### Prop Synchronization

Alarms should be going off in your head right now. React Server Side Rendering/React Hydration patterns require synchronization between the props used to render the Component on the server, and what the React engine attempts to hydrate the markup with on the client. If there's a disparity, you'll see one of those super fucking annoying warning messages from React about how props/html have changed between server rendering and client side hydration, and if you're like me, you'll throw your fucking computer into a river at that point.

So how do we work around this?

Well, whatever props you provide, either via serialization and prop passing as a command line argument or via using loader patterns, `waavy` ensures that the same exact props are available in the client browser when hydration is attempted. There's a small level of coordination here between consumer and `waavy`. `waavy` isn't a framework, and it (uh metaphorically) looks down its nose at react frameworks. It doesn't want to be that, and on the day this thing starts to resemble a framework, even through squinted lenses, Im burning the whole fucking thing down. Instead, we assume the consumer can handle a modest amount of opinionated assumptions.

`waavy` will take whatever props it uses to render the component on the server and it will make them available on the `window` object of the hydrating client browser. This is the same pattern a framework like next.js uses for passing props between the client and server. Under the hood, we'll scaffold an on the fly inline javascript statement and embed it into the rendered component using ReactDOM's `renderToReadableStream` options (specifically the `bootstrapScriptContent` field). It ends up looking like the following:

```tsx
import React from "react";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import {
  DEFAULT_WAAVY_HYDRATION_SELECTOR,
  DEFAULT_WAAVY_PROPS_CACHE_KEY,
} from "@/constants";
import type { RenderActionOptions } from "@/types";
import { asOptionalNumber, getVersion, logger } from "@/utils";
import { getErrorPageMarkup } from "../errors";

type CreateRenderOptionsConfig = {
  bootstrap?: string[];
  ErrorComponent?: React.ComponentType<{ error: unknown }> | null;
  errorPage?: string;
  raOptions?: RenderActionOptions;
  signal?: AbortController["signal"];
  timeout?: NodeJS.Timeout;
  timeoutFired?: boolean;
  waavyScriptContent?: string;
};

export function createRenderOptions({
  bootstrap,
  ErrorComponent,
  errorPage,
  raOptions,
  signal,
  timeout,
  timeoutFired,
  waavyScriptContent,
}: CreateRenderOptionsConfig) {
  /**
   * 6. Create renderOptions that will be used to configure the ReactDOM render behavior
   */
  const renderOptions: RenderToReadableStreamOptions = {
    bootstrapModules: bootstrap,
    bootstrapScriptContent: waavyScriptContent,
    onError(error, errorInfo) {
      if (raOptions?.verbose) {
        logger.extend("error")(
          "An error was thrown during server side rendering",
        );
      }

      if (ErrorComponent) {
        try {
          errorPage = getErrorPageMarkup(ErrorComponent, error, errorInfo);
        } catch (e) {}
      }
    },
    progressiveChunkSize: asOptionalNumber(raOptions?.chunk),
  };

  /**
   * 7. If a user has supplied a render timeout,
   * force client side rendering after the duration has elapsed
   * using the AbortController signal pattern
   */
  const timeoutDuration = asOptionalNumber(raOptions?.maxTimeout);
  if (!!timeoutDuration) {
    const controller = new AbortController();
    /**
     * We request maxTimeout in seconds
     */
    const duration = timeoutDuration * 1000;
    timeout = setTimeout(() => {
      controller.abort();
      timeoutFired = true;
    }, duration);

    signal = controller.signal;
    renderOptions.signal = signal;
  }

  return renderOptions as RenderToReadableStreamOptions;
}

type HydraWindowAssignmentScriptOptions<Props> = {
  props: Props;
  propsCacheKey?: string;
  selector?: string;
};

export function createWindowAssignmentInlineScript<Props>(
  options: HydraWindowAssignmentScriptOptions<Props>,
) {
  return (
    "window.waavy = {};" +
    `window.waavy.version = ${getVersion()};` +
    "window.waavy.keys = {};" +
    `window.waavy.keys.pcache = "${options.propsCacheKey || DEFAULT_WAAVY_PROPS_CACHE_KEY}";` +
    `window.waavy.keys.domselector = "${options.selector || DEFAULT_WAAVY_HYDRATION_SELECTOR}";` +
    `window[window.waavy.keys.pcache] = ${JSON.stringify(options.props)};` +
    `window.waavy.__$stash__.props = ${JSON.stringify(options.props)};`
  );
}
```

The consumer can determine what field the props data is stashed onto in the window object by either providing a string as an option to `waavy` and it will use that value to assign the props to on the window. If no value is passed in, we'll use our default window props cache value, which defaults to `window._p`. A backup copy is also available at `window.waavy.__$stash__.props`. We (waavy) don't want to make decisions on your behalf regarding client side hydration, bundling, etc. We just want to work with you to put the props we used for server rendering in a deterministic location on the client so you can write your client side hydration scripts however you want, bundle it how you want, with minimal behind the scenes magic. 

#### Server Rendering

Rendering React components on the server is really much easier than framework maintainers would have you believe. In fact, their entire prolonged existence rests on the premise that you believe maintaining your own server infrastructure for a React app is hard work, and that rendering Components, or partially pre-rendering Components on the server or an isomorphic edge runtime is hard work! They think so little of you, that they think you're better off just re-using what they did [(Even though Next.js had a 9.1 CVE middleware bypass just 3 short months ago!)](https://www.neoxs.me/blog/critical-nextjs-middleware-vulnerability-cve-2025-29927-authentication-bypass).

Anyway, server rending React components is easy. ReactDOM makes _several_ APIs available for you to leverage in server or edge runtimes that afford you the ability to render a component (either synchronously, asynchronously, or as a stream), and it provides options for embedding client-side javascript for hydration rendering patterns, as well as allowing for fine tuning of progressive chunk size. Pretty much everything your framework tries to do for you.

With that in mind, I stood up a few utilities to support various server runtime actions, so we could invoke them adhoc as opposed to within a server infrastructure. We don't want to write a server in javascript, we want the flexibility to write our server in any language and invoke a tool that can render a component to a stream of data we can use in our server. Here's a snippet of some of the base utilities, which are all extremely simple.

```tsx
import React from "react";
import * as ReactDOMServer from "react-dom/server";
import type { WriteStream } from "fs";
import { Readable } from "stream";

export function transformComponentToString(
  component: React.ReactElement,
  options: ReactDOMServer.ServerOptions = {},
) {
  return ReactDOMServer.renderToString(component, options);
}

export async function transformComponentToReadableStream(
  component: React.ReactElement,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  return ReactDOMServer.renderToReadableStream(component, options);
}

export async function pipeComponent<W extends WritableStream<T>, T = any>(
  component: React.ReactElement,
  writable: W,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  const stream = await transformComponentToReadableStream(component, options);
  await stream.pipeTo(writable);
}

export async function pipeComponentToWritableCallbacks(
  component: React.ReactElement,
  cbs: ((chunk: string) => void | Promise<void>)[],
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  const stream = await transformComponentToReadableStream(component, options);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result: Bun.ReadableStreamDefaultReadResult<any> = {
    value: undefined,
    done: false,
  };
  while (!result.done) {
    result = await reader.read();
    const chunk = decoder.decode(result.value);
    for (const cb of cbs) {
      await Promise.resolve(cb(chunk));
    }
  }
}

/**
 * @deprecated
 */
export async function pipeComponentToWritableCallback(
  component: React.ReactElement,
  cb: (chunk: string) => void,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  const stream = await transformComponentToReadableStream(component, options);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result: Bun.ReadableStreamDefaultReadResult<any> = {
    value: undefined,
    done: false,
  };
  while (!result.done) {
    result = await reader.read();
    const chunk = decoder.decode(result.value);
    cb(chunk);
  }
}

export async function pipeComponentToCollectedString(
  component: React.ReactElement,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
  listeners: ((chunk: string) => void | Promise<void>)[] = [],
  init?: string,
) {
  let stream = init || "";
  await pipeComponentToWritableCallbacks(
    component,
    [
      (chunk) => {
        stream += chunk;
      },
      ...listeners,
    ],
    options,
  );
  return stream;
}

export async function pipeComponentToStdout(
  component: React.ReactElement,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
  listeners: ((chunk: string) => void | Promise<void>)[] = [],
) {
  await pipeComponentToWritableCallbacks(
    component,
    [
      (chunk) => {
        process.stdout.write(chunk);
      },
      ...listeners,
    ],
    options,
  );
}

function webStreamToNodeStream(webStream: ReadableStream): Readable {
  const reader = webStream.getReader();

  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null); // End the stream
        } else {
          this.push(Buffer.from(value)); // Convert Uint8Array to Buffer
        }
      } catch (error) {
        this.destroy(error as Error);
      }
    },
  });
}

export async function pipeComponentToNodeStream(
  component: React.ReactElement,
  nodeWriteStream: WriteStream,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  const webStream = await transformComponentToReadableStream(
    component,
    options,
  );
  const nodeReadableStream = webStreamToNodeStream(webStream);

  return new Promise<void>((resolve, reject) => {
    nodeReadableStream.pipe(nodeWriteStream);

    nodeReadableStream.on("end", () => {
      resolve();
    });

    nodeReadableStream.on("error", (error) => {
      reject(error);
    });

    nodeWriteStream.on("error", (error) => {
      reject(error);
    });
  });
}

```

#### Using the Server Renderer Utilities from Other Environments

Okay so we aren't running these functions in a server, so we need a mechanism to make these function's invokable from an exterior context. A lot of languages support ffis. That would be a neat route to explore next. For now a simple mechanism is command line invocation. We can use `commander` to create a flexible command line tool in the interim, and most programming languages support command line invocation through spawned processes, so we can using Bun's "Single File Executable" build strategy, treat our typescript command line tool like a portable executable.

So how are we getting these React components to this tool? Well you can just write normal React code in a regular old typescript or javascript file, and you can supply a path argument to the waavy executable's `render` subcommand, with some configurable arguments, and waavy will render the Component to stdout, a provided pipe, or whatever. It's just a stream of data really.

> Sidebar
>
> A long time ago, when I was younger and more venerable, I was an SWE on a research and development team under the Amazon Games umbrella, called Playmaker Labs, and I would very often be caught telling other engineers that all programming languages, and perhaps really all life itself, was simply a fancy wrapper around string manipulation. It's a belief that has taken me both very far and nowhere at all. But it holds true for waavy.

Here's the core bulk of the command line logic, which also wasn't innately complex:

> Some types that support the RenderAction through RenderActionOptions

```tsx
// lib/types/cli/render/index.ts
import type Workers from "@/workers";

export type RenderContext = {};

export type LoaderFn<Props> = (
  request: Partial<Request>,
  ctx: RenderContext,
) => Promise<{ data: Props }>;

export type RenderAction = (
  pathToComponent: string,
  options: RenderActionOptions,
  wm: Workers
) => void | Promise<void>;

export type RenderActionOptions<Props = Record<string, unknown>> = {
  /**
   * The name of the component, if left blank, it assumes a default export
   * @default "default"
   */
  name?: "default" | string;

  /**
   * The props to pass to the component.
   * @default {}
   */
  props?: string | Props;

  /**
   * If this flag is set to true,
   * Waavy renderer will spawn a secondary non-blocking Worker thread to write the result
   * of the render operation to a local file cache. This is recommended for production when it's
   * very likely your components aren't changing if props are the same,
   * and we can use a cached result of the render operation in such a case.
   */
  cache?: boolean;

  /**
   * Approach to caching
   *
   * @default "bunfs"
   */
  cacheType?: "bunfs" | "bunsqlite3";

  /**
   * A string representing a password to be used for encrypting cached files
   */
  cacheKey?: string;

  /**
   * The request object to pass to the loader function.
   */
  request?: Partial<Request>;

  /**
   * Instead of piping the rendered component to stdout, it will pipe the component to a supplied named pipe. Pretty experimental currently.
   */
  pipe?: string;

  /**
   * If true, the result of the render operation will be collected as streamed,
   * and then passed in a final state to stdout, equivocal to an all or none op.
   */
  await?: boolean;

  /**
   * Any files you want to bootstrap on the client.
   * This is typically used for client side hydration of the React app.
   * @see https://react.dev/reference/react-dom/client#bootstrap
   */
  bootstrap?: string[];

  /**
   * Write to stdout in a serialized structured format
   * Currently supports JSON
   */
  serialize?: "json";

  /**
   * A path to a fallback Error component to respond with if an Error is thrown during server side rendering.
   */
  errorComponentPath?: string;

  /**
   * The name of the error component, used in conjunction with `errorComponentPath`.
   * If left blank, will be assumed to be a default export.
   */
  errorComponentName?: string;

  /**
   * The selector that you will mount your React component node to within the browser.
   *
   * If your application uses client side hydration, this is the selector for the element that you pass to ReactDOM.hydrateRoot
   *
   * If you are using the `waavy` client side function, this property is used for client side hydration.
   *
   * If this property is left blank, it is assumed you are following the <Html /> React Page pattern,
   * and we will attempt to use "document" as the selector in this case.
   */
  selector?: string;

  /**
   * A string indicating what field you want Waavy to assign props to on the window object
   *
   * if left default, Waavy will put the props in window._p;
   *
   * @default "_p"
   */
  pcacheKey?: string;

  /**
   * Enables verbose log output
   * @default false
   */
  verbose?: boolean;

  /**
   * Number of seconds to wait before aborting server-rendering,
   * flushing the remaining markup to the client,
   * and defaulting to client side rendering
   *
   * @see https://react.dev/reference/react-dom/server/renderToReadableStream#aborting-server-rendering
   */
  maxTimeout?: number | string;

  /**
   * Progressive chunk size (In bytes)
   *
   * This value is passed directly to ReactDOMServer#renderToReadableStream progressiveChunkSize option
   *
   * @see https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225
   */
  chunk?: number | string;

  /**
   * Whether or not to render an Error page to the provided OutputStrategy if an Error occurs,
   * or to fail silently
   *
   * @default false
   */
  failSilently?: boolean;
};

```

> The `render` command implementation

```tsx
// lib/cli/RenderAction/Action.tsx
import React from "react";

import { handleError } from "@/errors";
import {
  pipeComponentToCollectedString,
  pipeComponentToStdout,
} from "@/server";
import defaultErrorPage from "@/templates/waavy-error-page";
import type { RenderAction } from "@/types";
import {
  WorkerMessageDataAction,
  type CacheRenderOutputMessagePayload,
} from "@/types/worker";
import { createWorkerMessageData } from "@/workers";

import CacheManager from "./models/CacheManager";
import {
  createRenderOptions,
  createWindowAssignmentInlineScript,
  getComponentProps,
  getErrorComponentOrNull,
  getOutputStrategy,
  loadComponent,
  pipeComponentToNamedPipe,
  OutputStrategy,
  validateComponentExtension,
} from "./utils";

const renderAction: RenderAction = async (pathToComponent, options, wm) => {
  const {
    await: _await = false,
    bootstrap,
    cache = false,
    cacheKey,
    cacheType,
    errorComponentName,
    errorComponentPath,
    pcacheKey,
    selector,
    name = "default",
    verbose = false,
  } = options;

  const strategy = getOutputStrategy(options);
  let cacheableRenderOutput: string | null = null;
  let errorPage = defaultErrorPage;
  let signal,
    timeout,
    timeoutFired = false;

  try {
    validateComponentExtension(pathToComponent);

    const props = await getComponentProps(pathToComponent, options);

    if (cache && cacheKey && cacheType) {
      const hasCached = CacheManager.isInCache(pathToComponent, name, props);

      if (hasCached) {
        const cm = new CacheManager({
          key: cacheKey,
          type: cacheType,
          component: {
            name,
            path: pathToComponent,
            props,
          },
        });
        const ce = await cm.find();
        if (ce) {
          const { cachedRenderOutput } = ce;
          switch (strategy) {
            case OutputStrategy.StdoutStream:
            case OutputStrategy.StdoutString:
              !process.stdout.write(cachedRenderOutput) &&
                process.stdout.emit("drain");
              return;
            case OutputStrategy.SerializedJson:
              !process.stdout.write(
                JSON.stringify({
                  html: cacheableRenderOutput,
                  exitCode: 0,
                  props,
                }),
              );
              return;
          }
        }
      }
    }

    const Component = await loadComponent(pathToComponent, name);
    const ErrorComponent = await getErrorComponentOrNull(
      errorComponentPath,
      errorComponentName,
      options,
    );

    const waavyScriptContent = createWindowAssignmentInlineScript({
      props,
      propsCacheKey: pcacheKey,
      selector,
    });

    const renderOptions = createRenderOptions({
      bootstrap,
      ErrorComponent,
      errorPage,
      raOptions: options,
      signal,
      timeout,
      timeoutFired,
      waavyScriptContent,
    });

    switch (strategy) {
      case OutputStrategy.SerializedJson: {
        const html = await pipeComponentToCollectedString(
          <Component {...props} />,
          renderOptions,
        );
        if (cache) {
          cacheableRenderOutput = html;
        }
        process.stdout.write(JSON.stringify({ html, exitCode: 0, props }));
        break;
      }
      case OutputStrategy.StdoutString: {
        const html = await pipeComponentToCollectedString(
          <Component {...props} />,
          renderOptions,
        );
        if (cache) {
          cacheableRenderOutput = html;
        }
        process.stdout.write(html);
        break;
      }
      case OutputStrategy.StdoutStream: {
        if (cache) {
          const updateCacheableRenderOutput = (chunk: string) => {
            if (cacheableRenderOutput == null) cacheableRenderOutput = "";
            cacheableRenderOutput += chunk;
          };
          const listeners = [updateCacheableRenderOutput];
          await pipeComponentToStdout(
            <Component {...props} />,
            renderOptions,
            listeners,
          );
        } else {
          await pipeComponentToStdout(<Component {...props} />, renderOptions);
        }
        break;
      }
      case OutputStrategy.NamedPipe: {
        await pipeComponentToNamedPipe(
          options,
          Component,
          props,
          renderOptions,
        );
        break;
      }
    }

    if (cache && cacheType && cacheKey && cacheableRenderOutput) {
      const worker = wm.createWorker();
      const message = createWorkerMessageData<CacheRenderOutputMessagePayload>(
        WorkerMessageDataAction.Cache,
        {
          cachedRenderOutput: cacheableRenderOutput,
          cacheKey,
          cacheType,
          cname: name,
          cpath: pathToComponent,
          props,
        },
      );
      worker.postMessage(message);
    }

    return;
  } catch (error) {
    handleError(error, strategy, verbose, errorPage);
  } finally {
    if (signal && !timeoutFired && typeof timeout !== "undefined") {
      try {
        clearTimeout(timeout);
      } catch (_) {}
    }

    if (strategy !== OutputStrategy.NamedPipe) {
      /**
       * Flush stdout
       */
      if (process.stdout.writableNeedDrain) {
        process.stdout.emit("drain");
      }
    }
  }
};

export default renderAction;
```

Okay so if you took the time to read all that, god bless you. Here's a TLDR:

1. You give waavy a path to a React component. Doesn't need to be bundled. Just let us know where it is and what it's name is. We'll figure it out.
2. You tell waavy what to do to get Component props, pass it props from the calling scope, or export a loader function and Waavy will use that to supply props.
3. Waavy make component stream, with no hands and no javascript.
4. Waavy give you back stream, somehow someway.

#### Caching & Encryption

I am going to need to write a separate follow up article to this one about our caching strategies, because I ultimately want to include a good amount of benchmarking to prove that caching these render operations yields performance benefits. Keep an eye out for that one.

### So does it work?

Yep! The core entrypoint for the command line tool sets up an instance of the `commander` Command class with the `render` action, and then we leverage the `Bun` runtime's build tooling to convert the entrypoint to several platform specific executables. I've included the build script below, for the interested.

```ts
// build.ts
import { program } from "commander";
import debug from "debug";
import { mkdir } from "fs/promises";
import path from "path";
import util from "util";

import config from "./config";
import Package from "./package.json";

const log = debug("waavy:build");
const outdir = path.join(process.cwd(), "out");
const external = Object.keys(Package.peerDependencies);
const sources = config.build.sources;
const targets = config.build.targets;
const defaultBuildOptions: Partial<Bun.BuildConfig> =
  config.build.defaultBuildOptions(external, outdir);

type Options = {
  js?: boolean;
  executables?: boolean;
  all?: boolean;
  target?: string;
  verbose?: boolean;
  help?: boolean;
};

program.addHelpText(
  "before",
  `
Usage: bun run build.ts [options]

Options:
  --js              Build JavaScript bundle only
  --executables     Build executables only  
  --all             Build both JavaScript and executables (default)
  --target=<name>   Build specific target (e.g. --target=linux-x64)
  --verbose, -v     Verbose logging
  --help, -h        Show this help

Available targets:
${targets.map((t) => `  ${t.name.padEnd(30)} ${t.platform}`).join("\n")}

Examples:
  bun run build.ts                    # Build everything
  bun run build.ts --js               # JS bundle only
  bun run build.ts --executables      # Executables only
  bun run build.ts --target=linux     # Linux targets only
  bun run build.ts --target=macos-arm64 --verbose  # Specific target with verbose logging
`,
);

program
  .option("--js", "Build JavaScript bundle only")
  .option("--executables", "Build executables only")
  .option("--all", "Build both JavaScript and executables (default)")
  .option("--target <name>", "Build specific target (e.g. --target=linux-x64)")
  .option("--verbose, -v", "Verbose logging")
  .option("--help, -h", "Show this help")
  .action(build);

program.parse(process.argv);

async function ensureOutDir() {
  try {
    await mkdir(outdir, { recursive: true });
    log.extend("debug")(`Created output directory: ${outdir}`);
  } catch (error) {
    log.extend("warn")(
      `Output directory already exists or couldn't be created: ${error}`,
    );
  }
}

async function buildSources(verbose = false) {
  const nodeRuntimeOutputs = [sources.exports.browser, sources.exports.server];

  let succeeded = true;

  log("Starting node runtime output generation...");
  for (const nodeOutput of nodeRuntimeOutputs) {
    const startTime = performance.now();
    try {
      const result = await Bun.build({
        ...defaultBuildOptions,
        root: "./lib/exports",
        entrypoints: [nodeOutput],
        target: nodeOutput.includes("browser") ? "browser" : "node",
        format: "esm",
      });
      handleBunBuildOutput(result, startTime, verbose);
    } catch (error) {
      log.extend("error")(`Node build failed: ${error}`);
      succeeded = false;
    }
  }

  return succeeded;
}

async function buildExecutable(
  targetConfig: (typeof targets)[0],
  verbose = false,
) {
  const startTime = performance.now();
  const outfile = path.join(outdir, targetConfig.name);

  try {
    /**
     * Currently, there is no Javascript API for Bun's "Single File Executable"
     * And so in order to build the executable, we have to use the CLI based build api
     * @see https://bun.sh/docs/bundler/executables
     */
    const buildCommand: string[] = [
      "bun",
      "build",
      "--compile",
      "--minify",
      "--sourcemap",
      `--target=${targetConfig.target}`,
      ...external.map((pkg) => `--external=${pkg}`),
      sources.cli.main,
      sources.cli.worker,
      `--outfile=${outfile}`,
    ];

    log.extend("debug")(`Running: ${buildCommand.join(" ")}`);

    const proc = Bun.spawn(buildCommand, {
      stdout: verbose ? "inherit" : "pipe",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;

    if (exitCode === 0) {
      const duration = Math.round(performance.now() - startTime);

      try {
        const stat = Bun.file(outfile).size;
        const sizeInMB = (stat / (1024 * 1024)).toFixed(1);
        log(
          `${targetConfig.platform} executable built in ${duration}ms (${sizeInMB}MB)`,
        );
      } catch {
        log(`${targetConfig.platform} executable built in ${duration}ms`);
      }
    } else {
      log.extend("error")(
        `Failed to build ${targetConfig.platform} executable (exit code: ${exitCode})`,
      );
      const stderr = await new Response(proc.stderr).text();
      if (stderr) console.error(stderr);
      return false;
    }
  } catch (error) {
    log.extend("error")(
      `Failed to build ${targetConfig.platform} executable: ${error}`,
    );
    return false;
  }

  return true;
}

async function buildExecutables(specificTarget?: string, verbose = false) {
  const matches = specificTarget
    ? targets.filter(
        (t) =>
          t.name.includes(specificTarget) || t.target.includes(specificTarget),
      )
    : targets;

  if (matches.length === 0) {
    log.extend("error")(`No targets found matching: ${specificTarget}`);
    return false;
  }

  if (specificTarget) {
    log(
      `Building specific target(s): ${targets.map((t) => t.platform).join(", ")}`,
    );
  }

  let successCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const success = await buildExecutable(matches[i], verbose);
    if (success) successCount++;
  }

  if (successCount === targets.length) {
    log(`All ${targets.length} executables built successfully!`);
    return true;
  } else {
    log.extend("error")(
      `${targets.length - successCount}/${targets.length} executable builds failed`,
    );
    return false;
  }
}

function handleBunBuildOutput(
  output: Awaited<ReturnType<typeof Bun.build>>,
  startTime?: number,
  verbose = false,
) {
  if (output.success) {
    const duration = Math.round(performance.now() - (startTime || 0));
    log(`JavaScript bundle built in ${duration}ms`);
    if (verbose) {
      output.outputs.forEach((output) => {
        log.extend("debug")(
          `Generated: ${output.path} (${Math.round(output.size / 1024)}KB)`,
        );
      });
    }
  } else {
    log.extend("error")("JavaScript build failed:");
    output.logs.forEach((buildLog) => console.error(buildLog));
    throw new Error("JavaScript build failed");
  }
}

async function build(options: Options) {
  const shouldBuildExecutables = options.executables || options.all;
  const shouldBuildJS = options.js || options.all || !options.executables;

  const verbose = options.verbose;
  const specificTarget = options.target;

  if (verbose) {
    debug.enable("waavy:*");
    log(`Verbose logging enabled!`);
    log(util.inspect(options, true, 4, true));
    log(util.inspect(targets, true, 4, true));
  }

  const buildStartTime = performance.now();
  log("🚀 Starting Waavy build process...");

  ensureOutDir();

  let allSuccessful = true;

  if (shouldBuildJS) {
    allSuccessful = (await buildSources(verbose)) && allSuccessful;
  }

  if (shouldBuildExecutables) {
    allSuccessful =
      (await buildExecutables(specificTarget, verbose)) && allSuccessful;
  }

  const totalDuration = Math.round(performance.now() - buildStartTime);

  if (allSuccessful) {
    log(`🎉 Build completed successfully in ${totalDuration}ms`);
    process.exit(0);
  } else {
    log.extend("error")(`💥 Build failed after ${totalDuration}ms`);
    process.exit(1);
  }
}
```

I mentioned earlier that the size of these platform specific executables is an issue, and it is. The linux x64 distribution is like sitting at ~93mb (Obviously bc its bundling the whole js runtime into it) which makes it a nightmare for portability. For now, to work around this, we've gzipping the platform executables in a `postbuild` job, and seeing on average a ~65%-75% reduction in size.

We also don't package any platform specific executables into the library. This one's actually clever. The only things that make it into the npm consumable library are the module exports, a thin js script wrapper around node's child process module that will forward provided arguments to a co-located platform executable, and a post-install.js script that determines the platform and architecture, and then downloads the platform specific gzipped executable and unzips it in a streamed pipeline to a local binary executable file, then updates the file permissions to make it runnable. This method has ultimately proved pretty fast, and we're seeing a noticeable reduction in download time.  

Here's our latest benchmarks for the 0.1.6 version release.

![waavy_installation_time_benchmarks](/assets/screenshots/waavy-install-benchmarks.png)
<span class="alt-label" data-for="waavy_installation_time_benchmarks">
  Undici + zlib is actually pretty fast!
<span>

### Where does this go from here?

There are improvements to be made. Some are glaringly obvious, some are not.

Prerendering is already in flight, where we expect to be able to move the work of pre-rendering computationally expensive React components to when you first run the server, and then leaning on cached build outputs to make streamed handler responses faster. That's gonna be a quick win. Caching already has been implemented and stress tested for the most part.

FFIs, again a good place to explore next, what would that look like if we could enable a foreign function interface so you can call `waavy::render` directly in your rust files or whatever.

Started pouring through the react-dom package source code to get into the inner workings of what happens when react-dom calls `renderToReadableWebStream` or `renderToString` or any of those server side render apis. If the logic isn't insane, Im sure there's jsx AST libraries in Rust, and we just might be crazy enough to do the unthinkable and port some of that to rust. <em>Please, don't hold me to that.</em>

#### S3 Integration

Does it really matter if a component is local to a filesystem? I had this thought the other day. Bun has first class support for S3 file resolution, as if they were local file system inodes. So in theory, we probably can support loading an arbitrary Component from an S3 bucket, and server rendering it in a similar fashion to how we manage server rendering today.

![kali-linux](/assets/gifs/rub-hands.webp)
<span class="alt-label" data-for="kali-linux">
  Kali linux hackers about to rename stuxnet.exe to App.tsx in S3
<span>

#### Consuming Libraries

More pressing next action items are around releasing the Rust and Java clients for the waavy command line tool, so there's a unified interface for Server Rendering across non javascript server environments. Keep an eye out for waavy-rs and waavy jar releases on the project github. If you want to get involved, drop me a note.

### Caveats

So, if you've ever written a library for React, you're aware there's some caveats around React singleton internal state management. React, and React DOM need to be kept external from the waavy executable bundle, because those libraries should not be bundled into a consumptive library. They're expected to be available at runtime, in a resolvable directory like a `node_modules` directory. We adhere to this with waavy. If you do not have local copies of React and React DOM, this won't work. Which means, we can't 100% decouple the SSR functionality we have here from the javascript ecosystem, because you still need React and React DOM to be resolveable in your module tree. This means you probably need a javascript package manager, to get them and their subdependencies into a module hierarchy that the waavy executable can resolve using Bun's module resolution algorithm. At this point, you're probably well on your way to having a js ecosystem established. That doesn't inherenty devalue what we've done here, as you can now build out your web server in whatever language your team is best equipped to do so in, and still leverage a server side rendering approach to delivering your React components. I guess this only falls short if you're that one die hard developer that wants to use React and JSX syntax without ever installing React. Not sure that person exists, but I don't want to cater to them.

### Roadmap

I'm knocking out the following in the next couple of weeks

- Prerendering
- FFIs
- Client Libs (waavy-rs, spring web client)
- waavy-stat (fast static bundler command line tool, zero config)

If you want to get involved, drop me a note.

![spiderman-meme](/assets/memes/spiderman-meme.webp)
<span class="alt-label" data-for="spiderman-meme">
  Me raising PRs from the mega-blastoise github account to review them from main account
<span>

## Nodext4 and NEDfs

[Github](https://github.com/nicholasgalante1997/nodext4)

I was going to try and sneak an update about Nodext4 into this sign of life release, but it's late and ultimately this will probably be punted to the July release.

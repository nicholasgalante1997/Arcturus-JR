---
slug: "sign-of-life-1"
visible: true
title: "June Updates"
---

I'm dropping a very quick blog post to draw some attention to some technical work that's I've conducted in late May, early June. If you notice a period where technical writing lags, that's likely becuase things are actually getting done.

## Waavy & Waavy-RS

[Github](https://github.com/nicholasgalante1997/waavy)

### How it Works

Waavy is a tool you can use to server side render React components in non-javascript server runtimes. It's inspired by an unholy dream I had where I was SSRing React components in an Actix Web server. Well, a dream deferred is a dream denied. So here we are.

The internal composition is mostly Typescript/TSX, but it's intended to be built in a Bun javascript runtime as opposed to a standalone node.js runtime.

> As a rule of thumb, I really try not to get excited about new fads in the javascript ecosystem, but Bun is challenging that belief with a vigor.

Bun has support for what they call "Single File Executables", which is by and by a means of creating a standalone executable from a javascript or typescript file. Meaning you technically do not need a javascript runtime to run it. Bun can bundle everything needed to run the script into a single file executable, which makes it pretty portable, (but also recklessly large, we'll talk about this later). So this gave me the idea, could we decouple React from javascript? TLDR, yeah, probably.

Let's break into a high level technical overview.

#### Server Rendering

Rendering React components on the server is really much easier than framework maintainers would have you believe. In fact, their entire prolonged existence rests on the premise that you believe maintaining your own server infrastructure for a React app is hard work, and that rendering Components, or partially pre-rendering Components on the server or an isomorphic edge runtime is hard work! They think so little of you, that they think you're better off just re-using what they did [(Even though Next.js had a 9.1 CVE middleware bypass just 3 short months ago!)](https://www.neoxs.me/blog/critical-nextjs-middleware-vulnerability-cve-2025-29927-authentication-bypass).

Anyway, server rending React components is easy. ReactDOM makes _several_ APIs available for you to leverage in server or edge runtimes that afford you the ability to render a component (either synchronously, asynchronously, or as a stream), and it provides options for embedding client-side javascript for hydration rendering patterns, as well as allowing for fine tuning of progressive chunk size. Pretty much everything your framework tries to do for you.

With that in mind, it wasn't super hard to build a few utilities to support various server runtime actions, so we could invoke them adhoc as opposed to within a server infrastructure. We don't want to write a server in javascript, we want the flexibility to write our server in any language and invoke a tool that can render a component to a stream of data we can use in our server. Here's a snippet of some of the base utilities, which are all extremely simple.

```tsx
import type { WriteStream } from "fs";
import React from "react";
import * as ReactDOMServer from "react-dom/server";
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
  init?: string,
) {
  let stream = init || "";
  await pipeComponentToWritableCallback(
    component,
    (chunk) => (stream += chunk),
    options,
  );
  return stream;
}

export async function pipeComponentToStdout(
  component: React.ReactElement,
  options: ReactDOMServer.RenderToReadableStreamOptions = {},
) {
  await pipeComponentToWritableCallback(
    component,
    (chunk) => process.stdout.write(chunk),
    options,
  );
}

// Convert Web ReadableStream to Node.js Readable stream
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

Okay so we aren't running these functions in a server, so we need a mechanism to make these function's invokable from an exterior context. A lot of languages support ffis. That would be a neat route to explore next. For now a simple mechanism is command line invocation. We can use `commander` to create a flexible command line tool in the interim, and most programming languages support command line invocation through spawned processes, so we can using Bun's "Single File Executable" build strategy, treat our typescript command line tool like a portable executable.

So how are we getting these React components to this tool? Well you can just write normal React code in a regular old typescript or javascript file, and you can supply a path argument to the waavy executable's `render` subcommand, with some configurable arguments, and waavy will render the Component to stdout, a provided pipe, or whatever. It's just a stream of characters really.

> Sidebar
>
> A long time ago, when I was younger and more venerable, I was an SWE on a research and development team under the Amazon Games umbrella, called Playmaker Labs, and I would very often be caught telling other engineers that all programming languages and perhaps really all life itself was simply a fancy wrapper around string manipulation. It's a belief that has taken me both very far and nowhere at all. But it holds true for waavy.

Here's the core bulk of the command line logic, which also wasn't innately complex:

```tsx
import React from "react";
import type { RenderToReadableStreamOptions } from "react-dom/server";
import type { Command } from "commander";
import path from "path";

import {
  pipeComponentToStdout,
  pipeComponentToCollectedString,
} from "@/server";
import Hydra from "@/server/models/Hydra";
import { load } from "@/utils";
import {
  getLoaderProvisionedProps,
  getPropsFromOptions,
  pipeComponentToNamedPipe,
} from "./utils";

export type RenderAction = (
  pathToComponent: string,
  options: RenderActionOptions,
) => void | Promise<void>;

export type RenderActionOptions = {
  /**
   * The name of the component, if left blank, it assumes a default export
   * @default "default"
   */
  name?: "default" | string;

  /**
   * The props to pass to the component. If used in conjunction with a loader, it provides the initial props object and the result of the loader fn is merged in after.
   * @default {}
   */
  props?: string | object;

  /**
   * The path to the file containing the loader function, See our section on using loaders.
   */
  loader?: string;

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
   * Whether to include a client side javascript bundle.
   * This calls import('react-dom/client').hydrateRoot on your component,
   * in a module javascript bundle that is embedded into our server generated markup.
   *
   * This is currently a work in progress, meaning there's been little progress and it does not work.
   *
   * 6/15/2025: Update, it might work
   */
  hydrate?: boolean;

  /**
   * Any files you want to bootstrap on the client.
   * This is typically used for client side hydration of the React app.
   */
  bootstrap?: string[];

  /**
   * Write to stdout in a serialized structured format
   * Currently supports JSON
   */
  serialize?: "json";

  /**
   * The selector to use when hydrating the component.
   * @default "document"
   */
  selector?: string;
};

const renderAction: RenderAction = async (pathToComponent, options) => {
  const Component = await load(pathToComponent, options.name);
  const props = await getLoaderProvisionedProps(
    options,
    getPropsFromOptions(options),
  );
  const extension = path.extname(pathToComponent).replace(".", "");

  if (!["js", "ts", "jsx", "tsx"].includes(extension)) {
    throw new Error(
      "[renderAction]: An Exception was thrown: Invalid file extension - " +
        extension,
    );
  }

  const renderOptions: RenderToReadableStreamOptions = {
    bootstrapModules: options?.bootstrap,
  };

  if (options?.hydrate) {
    const h = Hydra.create();
    h.setComponent(Component)
      .setPathToComponent(pathToComponent)
      .setImportNonDefaultComponent(options?.name)
      .setExtension(extension as any)
      .setProps(props)
      .setSelector(options?.selector);

    const bundle = await h.createBundle();

    if (!bundle) {
      throw new Error(
        "[waavy::renderAction] hydration bundle creation failed.",
      );
    }

    const bootstrapWaavyContent = h.createBootstrapPropsInlineScript();

    // Window assignment script runs first (inline script)
    renderOptions.bootstrapScriptContent = bootstrapWaavyContent;

    // Hydration bundle runs after as a module script
    // Can't assume the server wants to serve it as a static file
    // Can offer bundle file output option later (Already caching build output in node_modules/waavy/.cache since we need React and react-dom as peer deps.)
    const bundleDataUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(bundle)}`;
    renderOptions.bootstrapModules ||= [];
    renderOptions.bootstrapModules.push(bundleDataUrl);
  }

  if (options?.await || options?.serialize) {
    const markup = await pipeComponentToCollectedString(
      <Component {...props} />,
      renderOptions,
    );

    if (options?.serialize) {
      if (options.serialize === "json") {
        process.stdout.write(
          JSON.stringify({ html: markup, exitCode: 0, props }),
        );
        return;
      }
    }

    if (options?.await) {
      process.stdout.write(markup);
      return;
    }
  }

  if (options?.pipe) {
    return await pipeComponentToNamedPipe(
      options,
      Component,
      props,
      renderOptions,
    );
  }

  return await pipeComponentToStdout(<Component {...props} />, renderOptions);
};

export function setupRenderAction(program: Command) {
  program
    .command("render")
    .description("Render a React component into a stdout stream")
    .argument(
      "<path-to-component>",
      "The path to the file containing the component to render",
    )
    .option(
      "-p, --props <props>",
      "The props to pass to the component. If used in conjunction with a loader, it provides the initial props object and the result of the loader fn is merged in after.",
      "{}",
    )
    .option(
      "-l, --loader <path-to-loader>",
      "The path to the file containing the loader function, See our section on using loaders.",
    )
    .option(
      "-n, --name <name>",
      "The name of the component, if left blank, it assumes a default export",
      "default",
    )
    .option(
      "-h, --hydrate",
      "Whether to include a client side javascript bundle. This calls import('react-dom/client').hydrateRoot on your component in a module javascript bundle that is embedded into our server generated markup.",
      false,
    )
    .option(
      "-b, --bootstrap [files-to-bootstrap...]",
      "Any files you want to bootstrap on the client. This is typically used for client side hydration of the React app.",
      [],
    )
    .option(
      "--pipe <path-to-pipe>",
      "Instead of piping the rendered component to stdout, it will pipe the component to a supplied named pipe. Pretty experimental currently.",
    )
    .option(
      "--request <request>",
      "The request object to pass to the loader function.",
      "{}",
    )
    .option(
      "--await",
      "If true, the result of the render operation will be collected as streamed, and then passed in a final state to stdout, equivocal to an all or none op.",
      false,
    )
    .option(
      "--serialize <format>",
      "Write to stdout in a serialized structured format Currently supports JSON",
      false,
    )
    .action(renderAction);

  return program;
}
```

Okay so if you took the time to read all that, god bless you. Here's a TLDR:

1. You give me component.
2. You tell Chok (me) what to do to get Component props and if Component need hydration
3. Me make component stream.
4. Me give you back stream, somehow someway.

### So does it work?

Yep!.

### Where does this go from here?

There are improvements to be made. Some are glaringly obvious, some are not.

Prehydration is already in flight, where we expect to be able to move the work of bundling client side hydration scripts to when you first run the server, and then leaning on cached build outputs to make streamed handler responses faster. That's gonna be a quick win.

FFIs, again a good place to explore next, what would that look like if we could enable a foreign function interface so you can call `waavy::render` directly in your rust files or whatever.

Started pouring through the react-dom package source code to get into the inner workings of what happens when react-dom calls `renderToReadableWebStream` or `renderToString` or any of those server side render apis. If the logic isn't insane, Im sure there's jsx AST libraries in Rust, and we just might be crazy enough to do the unthinkable and port some of that to rust. <em>Please, for fuck's sake don't hold me to that.</em>

Partial Pre Rendering. People seem to lose their shit over this. Would be nice to support it but let's be honest, this isn't saving your app.

**This will never support React Server Components because fuck you for wanting that.**

Thought I'd leave it on that nice note. If you want to get involved in this project, you already know how to get started. Go fork that repo and start implementing things and posting PRs. Right now it's just me and my secondary github account, namde `mega-blastoise`

![spiderman-meme](/assets/memes/spiderman-meme.webp)
<span class="alt-label" data-for="spiderman-meme">
    Me working on this project.
<span>

## Nodext4 and NEDfs

[Github](https://github.com/nicholasgalante1997/nodext4)


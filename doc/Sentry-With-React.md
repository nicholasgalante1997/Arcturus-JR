# Using Sentry with React

## Resources  

* [Sentry for React](https://docs.sentry.io/platforms/javascript/guides/react)

## React | Sentry for React

## [Prerequisites](https://docs.sentry.io/platforms/javascript/guides/react.md#prerequisites)

You need:

* A Sentry [account](https://sentry.io/signup/) and [project](https://docs.sentry.io/product/projects.md)
* Your application up and running

## [Install](https://docs.sentry.io/platforms/javascript/guides/react.md#install)

Choose the features you want to configure, and this guide will show you how:

Error Monitoring\[ ]Logs\[ ]Session Replay\[ ]Tracing\[ ]User Feedback

Want to learn more about these features?

* [**Issues**](https://docs.sentry.io/product/issues.md) (always enabled): Sentry's core error monitoring product that automatically reports errors, uncaught exceptions, and unhandled rejections. If you have something that looks like an exception, Sentry can capture it.
* [**Tracing**](https://docs.sentry.io/product/tracing.md): Track software performance while seeing the impact of errors across multiple systems. For example, distributed tracing allows you to follow a request from the frontend to the backend and back.
* [**Session Replay**](https://docs.sentry.io/product/explore/session-replay/web.md): Get to the root cause of an issue faster by viewing a video-like reproduction of what was happening in the user's browser before, during, and after the problem.
* [**Logs**](https://docs.sentry.io/product/explore/logs.md): Centralize and analyze your application logs to correlate them with errors and performance issues. Search, filter, and visualize log data to understand what's happening in your applications.

### [Install the Sentry SDK](https://docs.sentry.io/platforms/javascript/guides/react.md#install-the-sentry-sdk)

Run the command for your preferred package manager to add the Sentry SDK to your application:

```bash
npm install @sentry/react --save
```

## [Configure](https://docs.sentry.io/platforms/javascript/guides/react.md#configure)

### [Initialize the Sentry SDK](https://docs.sentry.io/platforms/javascript/guides/react.md#initialize-the-sentry-sdk)

To import and initialize Sentry, create a file in your project's root directory, for example, `instrument.js`, and add the following code:

`instrument.js`

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [
    //  performance
    // If you're using react router, use the integration for your react router version instead.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.browserTracingIntegration(),
    //  performance
    //  session-replay
    Sentry.replayIntegration(),
    //  session-replay
    //  user-feedback
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
    //  user-feedback
  ],
  //  logs

  // Enable logs to be sent to Sentry
  enableLogs: true,
  //  logs
  //  performance

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  //  performance
  //  session-replay

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  //  session-replay
});
```

### [Apply Instrumentation to Your App](https://docs.sentry.io/platforms/javascript/guides/react.md#apply-instrumentation-to-your-app)

Initialize Sentry as early as possible in your application. We recommend putting the import of your initialization code as the first import in your app's entry point:

```javascript
// Sentry initialization should be imported first!
import "./instrument";
import App from "./App";
import { createRoot } from "react-dom/client";

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />);
```

## [Capture React Errors](https://docs.sentry.io/platforms/javascript/guides/react.md#capture-react-errors)

To make sure Sentry captures all your app's errors, configure error handling based on your React version.

### [Configure Error Hooks (React 19+)](https://docs.sentry.io/platforms/javascript/guides/react.md#configure-error-hooks-react-19)

The `createRoot` and `hydrateRoot` methods provide error hooks to capture errors automatically. These hooks apply to all React components mounted to the root container. Integrate Sentry with these hooks and customize error handling:

```javascript
import { createRoot } from "react-dom/client";
import * as Sentry from '@sentry/react';

const container = document.getElementById(“app”);
const root = createRoot(container, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});
root.render();
```

### [Add Error Boundary Components (React <19)](https://docs.sentry.io/platforms/javascript/guides/react.md#add-error-boundary-components-react-19)

Use the [`ErrorBoundary`](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary.md) component to automatically send errors from specific component trees to Sentry and provide a fallback UI:

```javascript
import React from "react";
import * as Sentry from "@sentry/react";

<Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
  <Example />
</Sentry.ErrorBoundary>;
```

To capture errors manually with your own error boundary, use the `captureReactException` function as described [here](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary.md#manually-capturing-errors).

## [Set Up React Router](https://docs.sentry.io/platforms/javascript/guides/react.md#set-up-react-router)

If you're using `react-router` in your application, you need to set up the Sentry integration for your specific React Router version to trace `navigation` events.\
Select your React Router version to start instrumenting your routing:

* [React Router v7 (library mode)](https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/v7.md)
* [React Router v6](https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/v6.md)
* [Older React Router versions](https://docs.sentry.io/platforms/javascript/guides/react/features/react-router.md)
* [TanStack Router](https://docs.sentry.io/platforms/javascript/guides/react/features/tanstack-router.md)

## [Capture Redux State Data (Optional)](https://docs.sentry.io/platforms/javascript/guides/react.md#capture-redux-state-data-optional)

To capture Redux state data, use `Sentry.createReduxEnhancer` when initializing your Redux store.

```javascript
import { configureStore, createStore, compose } from "redux";
import * as Sentry from "@sentry/react";

// ...

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

// If you are using the `configureStore` API, pass the enhancer as follows:
const store = configureStore({
  reducer,
  enhancers: (getDefaultEnhancers) => {
    return getDefaultEnhancers().concat(sentryReduxEnhancer);
  },
});

// If you are using the deprecated `createStore` API, pass the enhancer as follows:
const store = createStore(reducer, sentryReduxEnhancer);
```

## [Add Readable Stack Traces With Source Maps (Optional)](https://docs.sentry.io/platforms/javascript/guides/react.md#add-readable-stack-traces-with-source-maps-optional)

The stack traces in your Sentry errors probably won't look like your actual code without unminifying them. To fix this, upload your [source maps](https://docs.sentry.io/platforms/javascript/guides/react/sourcemaps.md) to Sentry. The easiest way to do this is by using the Sentry Wizard:

```bash
npx @sentry/wizard@latest -i sourcemaps
```

## [Avoid Ad Blockers With Tunneling (Optional)](https://docs.sentry.io/platforms/javascript/guides/react.md#avoid-ad-blockers-with-tunneling-optional)

You can prevent ad blockers from blocking Sentry events using tunneling. Use the `tunnel` option to add an API endpoint in your application that forwards Sentry events to Sentry servers.

To enable tunneling, update `Sentry.init` with the following option:

```javascript
Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",,

  tunnel: "/tunnel",

});
```

This will send all events to the `tunnel` endpoint. However, the events need to be parsed and redirected to Sentry, so you'll need to do additional configuration on the server. You can find a detailed explanation on how to do this on our [Troubleshooting page](https://docs.sentry.io/platforms/javascript/guides/react/troubleshooting.md#using-the-tunnel-option).

## [Verify Your Setup](https://docs.sentry.io/platforms/javascript/guides/react.md#verify-your-setup)

Let's test your setup and confirm that Sentry is working correctly and sending data to your Sentry project.

### [Issues](https://docs.sentry.io/platforms/javascript/guides/react.md#issues)

To verify that Sentry captures errors and creates issues in your Sentry project, add the following test button to one of your pages, which will trigger an error that Sentry will capture when you click it:

```javascript
<button
  type="button"
  onClick={() => {
    throw new Error("Sentry Test Error");
  }}
>
  Break the world
</button>;
```

Open the page in a browser (for most React applications, this will be at localhost) and click the button to trigger a frontend error.

##### Important

Errors triggered from within your browser's developer tools (like the browser console) are sandboxed, so they will not trigger Sentry's error monitoring.

### [Tracing](https://docs.sentry.io/platforms/javascript/guides/react.md#tracing)

To test your tracing configuration, update the previous code snippet to start a performance trace to measure the time it takes for the execution of your code:

```javascript
<button
  type="button"
  onClick={() => {
    Sentry.startSpan({ op: "test", name: "Example Frontend Span" }, () => {
      setTimeout(() => {
        throw new Error("Sentry Test Error");
      }, 99);
    });
  }}
>
  Break the world
</button>;
```

Open the page in a browser (for most React applications, this will be at localhost) and click the button to trigger a frontend error and performance trace.

### [View Captured Data in Sentry](https://docs.sentry.io/platforms/javascript/guides/react.md#view-captured-data-in-sentry)

Now, head over to your project on [Sentry.io](https://sentry.io/) to view the collected data (it takes a couple of moments for the data to appear).

Need help locating the captured errors in your Sentry project?

1. Open the [**Issues**](https://sentry.io/issues) page and select an error from the issues list to view the full details and context of this error. For more details, see this [interactive walkthrough](https://docs.sentry.io/product/sentry-basics/integrate-frontend/generate-first-error.md#ui-walkthrough).
2. Open the [**Traces**](https://sentry.io/explore/traces) page and select a trace to reveal more information about each span, its duration, and any errors. For an interactive UI walkthrough, click [here](https://docs.sentry.io/product/sentry-basics/distributed-tracing/generate-first-error.md#ui-walkthrough).
3. Open the [**Replays**](https://sentry.io/explore/replays) page and select an entry from the list to get a detailed view where you can replay the interaction and get more information to help you troubleshoot.
4. Open the [**Logs**](https://sentry.io/explore/logs) page and filter by service, environment, or search keywords to view log entries from your application. For an interactive UI walkthrough, click [here](https://docs.sentry.io/product/explore/logs.md#overview).

## [Next Steps](https://docs.sentry.io/platforms/javascript/guides/react.md#next-steps)

At this point, you should have integrated Sentry into your React application and should already be sending data to your Sentry project.

Now's a good time to customize your setup and look into more advanced topics. Our next recommended steps for you are:

* Extend Sentry to your backend using one of our [SDKs](https://docs.sentry.io/.md)
* Continue to [customize your configuration](https://docs.sentry.io/platforms/javascript/guides/react/configuration.md)
* Make use of [React-specific features](https://docs.sentry.io/platforms/javascript/guides/react/features/redux.md)
* Learn how to [manually capture errors](https://docs.sentry.io/platforms/javascript/guides/react/usage.md)
* Avoid ad-blockers with [tunneling](https://docs.sentry.io/platforms/javascript/guides/react/troubleshooting.md#using-the-tunnel-option)

Are you having problems setting up the SDK?

* [Get support](https://sentry.zendesk.com/hc/en-us/)

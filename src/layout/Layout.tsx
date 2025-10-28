import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import ArcSentry from '@/config/sentry/config';
import { pipeline } from '@/utils/pipeline';

interface DocumentProps extends React.PropsWithChildren {}

function _Document({ children }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nick G. Software Engineering Posts</title>
        <meta
          name="description"
          content="Nick Galante's technical blog website. Serious about Rust and Modern Javascript initiatives. An unserious effort to join the IndieWeb."
        />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/site.webmanifest" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
        />

        <link rel="preload" as="style" href="/css/styles.min.css" />
        <link rel="preload" as="style" href="/css/themes/sb.min.css" />
        <link rel="preload" as="style" href="/css/post.min.css" />
        <link rel="preload" as="style" href="/css/contact.min.css" />
        <link rel="preload" as="style" href="/css/error.min.css" />

        <link rel="stylesheet" href="/css/styles.min.css" />
        <link rel="stylesheet" href="/css/themes/sb.min.css" />
        <link rel="stylesheet" href="/css/post.min.css" />
        <link rel="stylesheet" href="/css/contact.min.css" />
        <link rel="stylesheet" href="/css/error.min.css" />
      </head>
      <body>
        <div id="arc_root">{children}</div>
      </body>
    </html>
  );
}

export const Document = pipeline(React.memo)(_Document) as React.MemoExoticComponent<typeof _Document>;

interface LayoutProps extends React.PropsWithChildren {}

function _Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary
      onError={ArcSentry.sentryReactDefaultErrorHandler}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <DefaultFallbackErrorComponent error={error} reset={resetErrorBoundary} />
      )}
    >
      <Header />
      <main id="app" className="container">
        {children}
      </main>
      <Footer />
    </ErrorBoundary>
  );
}

export const AppLayout = pipeline(React.memo)(_Layout) as React.MemoExoticComponent<typeof _Layout>;

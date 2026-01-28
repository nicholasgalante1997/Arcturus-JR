import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import ArcSentry from '@/config/sentry/config';
import { pipeline } from '@/utils/pipeline';

export interface LayoutProps extends React.PropsWithChildren {}

function Layout({ children }: LayoutProps) {
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

export default pipeline(React.memo)(Layout) as React.MemoExoticComponent<typeof Layout>;

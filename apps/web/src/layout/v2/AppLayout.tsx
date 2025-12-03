import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Starfield } from '@/components/Base/Starfield'
import { V2Header } from '@/components/v2/Header';
import ArcSentry from '@/config/sentry/config';
import { pipeline } from '@/utils/pipeline';

export interface LayoutProps extends React.PropsWithChildren {}

function AppLayoutV2({ children }: LayoutProps) {
  return (
    <ErrorBoundary
      onError={ArcSentry.sentryReactDefaultErrorHandler}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <DefaultFallbackErrorComponent error={error} reset={resetErrorBoundary} />
      )}
    >
      <Starfield />
      <V2Header />
      <main id="app-v2" className="container">
        {children}
      </main>
      {/* <Footer /> */}
    </ErrorBoundary>
  );
}

export default pipeline(React.memo)(AppLayoutV2) as React.MemoExoticComponent<typeof AppLayoutV2>;

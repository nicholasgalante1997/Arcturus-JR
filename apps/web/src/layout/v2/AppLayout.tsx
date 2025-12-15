import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Starfield } from '@/components/Base/Starfield';
import { V2Header } from '@/components/v2/Header';
import ArcSentry from '@/config/sentry/config';
import I18nProvider from '@/contexts/i18n/Provider';
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
      <I18nProvider locale="en_US">
        <Starfield />
        <V2Header />
        <main id="app-v2" className="container">
          {children}
        </main>
        {/* <Footer /> */}
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default pipeline(React.memo)(AppLayoutV2) as React.MemoExoticComponent<typeof AppLayoutV2>;

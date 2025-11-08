import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Ciphers } from '@/components/Ciphers';
import ArcSentry from '@/config/sentry/config';

function CiphersPage() {
  return (
    <ErrorBoundary
      onError={ArcSentry.sentryReactDefaultErrorHandler}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <DefaultFallbackErrorComponent error={error} reset={resetErrorBoundary} />
      )}
    >
      <Ciphers />
    </ErrorBoundary>
  );
}

export default React.memo(CiphersPage);

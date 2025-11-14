import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Cipher } from '@/components/Ciphers/Cipher';
import ArcSentry from '@/config/sentry/config';

function CipherPage() {
  return (
    <ErrorBoundary
      onError={ArcSentry.sentryReactDefaultErrorHandler}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <DefaultFallbackErrorComponent error={error} reset={resetErrorBoundary} />
      )}
    >
      <link rel="preload" as="style" href="/css/ciphers.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/ciphers.min.css" precedence="high" />
      <Cipher />
    </ErrorBoundary>
  );
}

export default React.memo(CipherPage);

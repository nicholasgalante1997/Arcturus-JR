import { VOID_V1_THEME_CSS } from '@arcjr/types';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DefaultFallbackErrorComponent } from '@/components/Base/Error';
import { Ciphers } from '@/components/Ciphers';
import ArcSentry from '@/config/sentry/config';
import { toLinkMarkup } from '@/utils/css';

function CiphersPage() {
  return (
    <ErrorBoundary
      onError={ArcSentry.sentryReactDefaultErrorHandler}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <DefaultFallbackErrorComponent error={error} reset={resetErrorBoundary} />
      )}
    >
      {VOID_V1_THEME_CSS.map(toLinkMarkup)}
      <link rel="preload" as="style" href="/css/ciphers.min.css" precedence="high" />
      <link rel="stylesheet" href="/css/ciphers.min.css" precedence="high" />
      <Ciphers />
    </ErrorBoundary>
  );
}

export default React.memo(CiphersPage);

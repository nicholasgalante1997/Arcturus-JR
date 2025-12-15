import React from 'react';

import type { FallbackProps } from 'react-error-boundary';

interface V2ErrorPageProps extends FallbackProps, React.PropsWithChildren {}

function V2ErrorPage({ error, resetErrorBoundary, children = null }: V2ErrorPageProps) {
  return (
    <section className="v2-error-page">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>

      {children && <div className="v2-error-page-children">{children}</div>}
    </section>
  );
}

export default V2ErrorPage;

import React from 'react';

import { type DefaultFallbackErrorComponentProps } from './types';

function DefaultFallbackErrorComponentView({ error, reset }: DefaultFallbackErrorComponentProps) {
  return (
    <div className="error-message">
      <h2>Something went wrong.</h2>
      {error instanceof Error ? (
        <>
          <p>{error.message}</p>
          <code>
            <pre>{error.stack}</pre>
          </code>
        </>
      ) : (
        <p>{String(error)}</p>
      )}

      <hr />
      <button onClick={reset}>Try again?</button>
    </div>
  );
}

export default DefaultFallbackErrorComponentView;

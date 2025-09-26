import React from 'react';

import { pipeline } from '@/utils/pipeline';

function DefaultErrorComponent({ error, reset }: { error: unknown; reset?: () => void }) {
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

export default pipeline(React.memo)(DefaultErrorComponent) as React.MemoExoticComponent<
  React.ComponentType<{ error: unknown }>
>;

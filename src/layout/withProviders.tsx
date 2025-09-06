import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function withProviders<Props extends React.PropsWithChildren<P>, P extends object>(
  Component: React.ComponentType<Props>
) {
  return React.memo(function AppWithProviders(props: Props) {
    const [client] = React.useState(() => new QueryClient());
    return (
      <QueryClientProvider client={client}>
        <Component {...props} />
      </QueryClientProvider>
    );
  });
}

export default withProviders;

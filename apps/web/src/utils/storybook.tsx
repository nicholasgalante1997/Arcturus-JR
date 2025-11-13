import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

import { createQueryClient } from '@/layout/layers/data/utils/browser';

import type { Decorator } from '@storybook/react-webpack5';

export class StorybookDecorators {
  static queryClient = createQueryClient({ env: 'development' });

  static withTanstackQuery: Decorator = (Story) => {
    return (
      <QueryClientProvider client={StorybookDecorators.queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };

  static withReactRouterDOMProvider: Decorator = (Story) => {
    return (
      <BrowserRouter basename="#storybook">
        <Story />
      </BrowserRouter>
    );
  };
}

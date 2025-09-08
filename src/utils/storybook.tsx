import type { Decorator } from '@storybook/react-webpack5';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export class StorybookDecorators {
  static queryClient = new QueryClient();
  static withTanstackQuery: Decorator = (Story) => {
    return (
      <QueryClientProvider client={StorybookDecorators.queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };
}

import ErrorBoundary from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs']
};

type Story = StoryObj<typeof ErrorBoundary>;

export const Normal: Story = {
  args: {
    hasError: false,
    children: <div>Normal content</div>
  },
  render: (args) => <ErrorBoundary {...args} />
};

export const WithError: Story = {
  args: {
    hasError: true,
    fallback: <div>Error occurred!</div>,
    children: <div>This won&apos;t show</div>
  },
  render: (args) => <ErrorBoundary {...args} />
};

export default meta;

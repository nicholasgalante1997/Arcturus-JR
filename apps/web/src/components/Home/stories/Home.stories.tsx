import { StorybookDecorators } from '@/utils/storybook';

import Home from '../Component';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Home> = {
  title: 'Components/Home',
  component: Home,
  tags: ['autodocs'],
  decorators: [StorybookDecorators.withTanstackQuery, StorybookDecorators.withReactRouterDOMProvider]
};

type Story = StoryObj<typeof Home>;

export const Primary: Story = {
  render: () => <Home />
};

export default meta;

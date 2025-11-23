import { StorybookDecorators } from '@/utils/storybook';

import About from '../Component';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof About> = {
  title: 'Components/About',
  component: About,
  tags: ['autodocs'],
  decorators: [StorybookDecorators.withTanstackQuery]
};

type Story = StoryObj<typeof About>;

export const Primary: Story = {
  render: () => <About />
};

export default meta;

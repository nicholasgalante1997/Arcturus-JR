import md from '@public/content/about.md';

import About from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof About> = {
  title: 'Components/About',
  component: About,
  tags: ['autodocs']
};

type Story = StoryObj<typeof About>;

export const Primary: Story = {
  args: {
    markdown: md as unknown as string
  },
  render: (args) => <About {...args} />
};

export default meta;

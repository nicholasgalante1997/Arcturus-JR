import Home from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Home> = {
  title: 'Components/Home',
  component: Home,
  tags: ['autodocs']
};

type Story = StoryObj<typeof Home>;

export const Primary: Story = {
  args: {
    markdown: '# Welcome Home',
    posts: []
  },
  render: (args) => <Home {...args} />
};

export default meta;

import Markdown from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Markdown> = {
  title: 'Components/Markdown',
  component: Markdown,
  tags: ['autodocs']
};

type Story = StoryObj<typeof Markdown>;

export const Primary: Story = {
  args: {
    markdown: '# Hello World\n\nThis is **bold** text.'
  },
  render: (args) => <Markdown {...args} />
};

export default meta;

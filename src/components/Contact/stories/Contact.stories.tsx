import md from '@public/content/contact.md';

import Contact from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Contact> = {
  title: 'Components/Contact',
  component: Contact,
  tags: ['autodocs']
};

type Story = StoryObj<typeof Contact>;

export const Primary: Story = {
  args: {
    markdown: md as unknown as string
  },
  render: (args) => <Contact {...args} />
};

export default meta;

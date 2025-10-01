import { StorybookDecorators } from '@/utils/storybook';

import Contact from '../Component';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Contact> = {
  title: 'Components/Contact',
  component: Contact,
  tags: ['autodocs'],
  decorators: [StorybookDecorators.withTanstackQuery]
};

type Story = StoryObj<typeof Contact>;

export const Primary: Story = {
  render: () => <Contact />
};

export default meta;

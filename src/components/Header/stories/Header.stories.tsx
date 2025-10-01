import { BrowserRouter } from 'react-router';

import Header from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
};

type Story = StoryObj<typeof Header>;

export const Primary: Story = {
  render: () => <Header />
};

export default meta;

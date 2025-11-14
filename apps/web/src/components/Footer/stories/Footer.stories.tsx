import Footer from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs']
};

type Story = StoryObj<typeof Footer>;

export const Primary: Story = {
  render: () => <Footer />
};

export default meta;

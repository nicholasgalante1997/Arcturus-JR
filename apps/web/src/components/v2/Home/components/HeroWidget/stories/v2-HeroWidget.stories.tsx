import '@public/css/v2.css';

import V2HeroWidgetView from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof V2HeroWidgetView> = {
  title: 'v2/Home/HeroWidget/View',
  component: V2HeroWidgetView,
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof V2HeroWidgetView>;

export const Default: Story = {
  args: {}
};

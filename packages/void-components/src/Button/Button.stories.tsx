import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

import './Button.css';

const meta: Meta<typeof Button> = {
  title: 'Void/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};

export const WithClick: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
    onClick: () => alert('Button clicked!')
  }
};

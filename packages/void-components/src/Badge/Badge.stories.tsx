import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

import './Badge.css';

const meta: Meta<typeof Badge> = {
  title: 'Void/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info'
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success'
  }
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning'
  }
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--void-spacing-3)', flexWrap: 'wrap' }}>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  )
};

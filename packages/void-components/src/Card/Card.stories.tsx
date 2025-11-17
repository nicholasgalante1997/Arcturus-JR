import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './index';
import { Button } from '../Button';
import { Badge } from '../Badge';
import './Card.css';
import '../Button/Button.css';
import '../Badge/Badge.css';

const meta: Meta<typeof Card> = {
  title: 'Void/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated']
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <p>This is a default card with some content inside.</p>
  }
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <p>This is an elevated card with enhanced shadow.</p>
  }
};

export const WithHeader: Story = {
  args: {
    header: <h3 style={{ margin: 0 }}>Card Title</h3>,
    children: <p>Card content goes here.</p>
  }
};

export const WithFooter: Story = {
  args: {
    children: <p>Card content with action buttons below.</p>,
    footer: (
      <div style={{ display: 'flex', gap: 'var(--void-spacing-3)' }}>
        <Button variant="primary">Confirm</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    )
  }
};

export const Complete: Story = {
  args: {
    variant: 'elevated',
    header: <h3 style={{ margin: 0 }}>Complete Card</h3>,
    children: (
      <div>
        <p>This card has a header, content, and footer.</p>
        <p>It demonstrates the full card structure.</p>
      </div>
    ),
    footer: <Button variant="primary">Take Action</Button>
  }
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <img
        src="https://via.placeholder.com/400x200"
        alt="Placeholder"
        style={{ width: '100%', display: 'block', borderRadius: 'var(--void-border-radius-lg)' }}
      />
    )
  }
};

export const AlbumCard: Story = {
  args: {
    variant: 'elevated',
    padding: 'none',
    children: (
      <div>
        <div style={{ position: 'relative' }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/f6/The_Dark_Side_of_The_Moon.jpg"
            alt="Album Cover"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1 / 1',
              display: 'block',
              borderRadius: 'var(--void-border-radius-lg) var(--void-border-radius-lg) 0 0'
            }}
          />
          <div style={{ position: 'absolute', top: 'var(--void-spacing-4)', right: 'var(--void-spacing-4)' }}>
            <Badge variant="success">New Release</Badge>
          </div>
        </div>
        <div style={{ padding: 'var(--void-spacing-6)' }}>
          <h3 style={{ margin: 0, marginBottom: 'var(--void-spacing-2)', fontSize: '1.25rem' }}>
            Dark Side of the Moon
          </h3>
          <p style={{ margin: 0, color: 'var(--void-color-gray-400)', marginBottom: 'var(--void-spacing-4)' }}>
            Pink Floyd • 1973
          </p>
          <div style={{ display: 'flex', gap: 'var(--void-spacing-3)' }}>
            <Button variant="primary">Play Now</Button>
            <Button variant="secondary">Add to Library</Button>
          </div>
        </div>
      </div>
    )
  }
};

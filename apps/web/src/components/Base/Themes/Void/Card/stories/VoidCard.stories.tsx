import '@public/css/themes/void/void.css';

import React from 'react';

import VoidCard from '../View';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

type VoidCardMeta = Meta<typeof VoidCard>;
type VoidCardStory = StoryObj<typeof VoidCard>;

const meta: VoidCardMeta = {
  title: 'Themes/Void/Card',
  component: VoidCard,
  tags: ['autodocs']
};

export default meta;

export const Primary: VoidCardStory = {
  args: {
    title: 'Void Card Example',
    subtitle: 'This is an example of a Void themed card component.',
    body: (
      <span>
        <label>Example Label</label>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      </span>
    ),
    action: {
      label: 'Learn More',
      href: 'https://example.com',
      target: '_blank',
      _preferReactRouterLink: false
    },
    badge: {
      label: 'New',
      type: 'primary'
    }
  }
};

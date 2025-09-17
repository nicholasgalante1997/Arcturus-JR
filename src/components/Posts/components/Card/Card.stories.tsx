import PostCard from './Card';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

type PostCardStoryMeta = Meta<typeof PostCard>;
type PostCardStory = StoryObj<typeof PostCard>;

const meta: PostCardStoryMeta = {
  title: 'Components/Posts/Card',
  component: PostCard,
  tags: ['autodocs'],
  args: {
    post: {
      id: '1',
      title: 'Sample Post Title',
      date: '2023-10-01T00:00:00Z',
      excerpt: 'This is a sample excerpt for the post card component.'
    }
  }
};

export default meta;
export const Default: PostCardStory = {};

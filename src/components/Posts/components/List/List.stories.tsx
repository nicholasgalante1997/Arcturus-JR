import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PostCardsList from './List';

type PostCardsListStoryMeta = Meta<typeof PostCardsList>;
type PostCardsListStory = StoryObj<typeof PostCardsList>;

const meta: PostCardsListStoryMeta = {
  title: 'Components/Posts/List',
  component: PostCardsList,
  tags: ['autodocs'],
  args: {
    posts: [
      {
        id: '1',
        title: 'Sample Post Title',
        date: '2023-10-01T00:00:00Z',
        excerpt: 'This is a sample excerpt for the post card component.'
      }
    ]
  }
};

export default meta;

export const Default: PostCardsListStory = {
  args: {
    posts: [
      {
        id: '1',
        title: 'Sample Post Title',
        date: '2023-10-01T00:00:00Z',
        excerpt: 'This is a sample excerpt for the post card component.'
      }
    ]
  }
};

export const MultiplePosts: PostCardsListStory = {
  args: {
    posts: [
      {
        id: '1',
        title: 'Sample Post Title 1',
        date: '2023-10-01T00:00:00Z',
        excerpt: 'This is a sample excerpt for the first post card component.'
      },
      {
        id: '2',
        title: 'Sample Post Title 2',
        date: '2023-10-02T00:00:00Z',
        excerpt: 'This is a sample excerpt for the second post card component.'
      },
      {
        id: '3',
        title: 'Sample Post Title 3',
        date: '2023-10-03T00:00:00Z',
        excerpt: 'This is a sample excerpt for the third post card component.'
      }
    ]
  }
};

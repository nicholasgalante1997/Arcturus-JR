import Loader from './Loader';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

type LoaderStoryMeta = Meta<typeof Loader>;
type LoaderStory = StoryObj<typeof Loader>;

const meta: LoaderStoryMeta = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs']
};

export default meta;
export const Default: LoaderStory = {};

import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  staticDirs: [
    {
      from: '../public/css',
      to: '/css'
    },
    {
      from: '../public/content',
      to: '/content'
    },
    {
      from: '../public/assets',
      to: '/assets'
    }
  ]
};
export default config;

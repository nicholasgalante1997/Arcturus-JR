import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

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
  ],
  webpackFinal(config, options) {
    config.module ||= {};
    config.module.rules ||= [];
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source'
    });
    config.resolve ||= {};
    config.resolve.alias ||= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@public': path.resolve(process.cwd(), 'public')
    };
    return config;
  }
};
export default config;

import '../public/css/styles.css';
import '../public/css/themes/sb.css';
import '../public/css/post.css';

import './global.css';

import type { Preview } from '@storybook/react-webpack5';
import theme from './theme';

const preview: Preview = {
  parameters: {
    docs: {
      theme
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#121212'
        },
        {
          name: 'surface',
          value: 'rgba(30, 30, 30, 0.7)'
        }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['dark'],
        dynamicTitle: true
      }
    }
  }
};

export default preview;

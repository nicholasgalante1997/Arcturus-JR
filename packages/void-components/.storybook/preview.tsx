import "@arcjr/void-tokens/dist/css/void-tokens.css";
import "@arcjr/void-css/css/void-base.css";
import "@arcjr/void-css/css/void-layout.css";
import '@arcjr/void-css/css/void-font.css';

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        dark: { name: 'void-dark', value: '#0e0e0e' }
      }
    },
  },
  initialGlobals: {
    backgrounds: { value: 'void-dark' } 
  }
};

export default preview;

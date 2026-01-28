import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const isProduction = true;

export default {
  plugins: [
    // Tailwind processes @tailwind directives and utility classes
    tailwindcss({
      // Content paths for tree-shaking unused utilities
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/css/**/*.css',
        // Include void-components for class extraction
        '../../packages/void-components/src/**/*.{js,jsx,ts,tsx}'
      ]
    }),
    // Add vendor prefixes
    autoprefixer({
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead']
    }),
    // Minify in production
    ...(isProduction
      ? [
          cssnano({
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true
              }
            ]
          })
        ]
      : [])
  ]
};

import { create } from 'storybook/theming';

export default create({
  base: 'dark',
  brandTitle: 'Arc Jr Components',
  brandUrl: '/',
  
  // Colors from your CSS variables
  colorPrimary: '#64ffda',
  colorSecondary: '#7986cb',
  
  // UI
  appBg: '#121212',
  appContentBg: 'rgba(30, 30, 30, 0.7)',
  appBorderColor: 'rgba(100, 255, 218, 0.2)',
  appBorderRadius: 12,
  
  // Typography
  fontBase: '"Nunito Sans", system-ui, -apple-system, sans-serif',
  fontCode: '"Courier New", monospace',
  
  // Text colors
  textColor: '#e0e0e0',
  textInverseColor: '#121212',
  textMutedColor: '#a0a0a0',
  
  // Toolbar default and active colors
  barTextColor: '#e0e0e0',
  barSelectedColor: '#64ffda',
  barBg: 'rgba(30, 30, 30, 0.7)',
  
  // Form colors
  inputBg: 'rgba(40, 40, 45, 0.6)',
  inputBorder: 'rgba(100, 255, 218, 0.2)',
  inputTextColor: '#e0e0e0',
  inputBorderRadius: 8,
});

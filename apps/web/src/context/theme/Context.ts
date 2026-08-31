import { createContext, useContext } from 'react';
import { THEME_SEQUENCE } from '@/utils/theme';
import { type ArcThemeContext as ArcThemeContextType } from './types';

const defaultArcThemeContext: ArcThemeContextType = {
  theme: 'system',
  applyTheme(theme) {
    this.theme = theme;
  },
  cycleTheme() {
    const index = THEME_SEQUENCE.indexOf(this.theme);
    if (index !== -1) {
      const nextIndex = (index + 1) % THEME_SEQUENCE.length;
      this.theme = THEME_SEQUENCE[nextIndex] || 'system';
    }
  },
  setTheme(theme) {}
};

export const ArcThemeContext = createContext<ArcThemeContextType>(defaultArcThemeContext);

export const useArcThemeContext = () => useContext(ArcThemeContext);

import React, { useCallback, useEffect, useState, } from 'react';

import { ThemePreference } from '@/types/theme';
import { THEME_SEQUENCE, THEME_STORAGE_KEY } from '@/utils/theme';

import { ArcThemeContext } from './Context';

function ArcThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>('system');

  const applyTheme = useCallback((preference: ThemePreference) => {
    document.documentElement.classList.remove('light', 'dark');

    if (preference !== 'system') {
      document.documentElement.classList.add(preference);
    }

    setTheme(preference);
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const currentIndex = THEME_SEQUENCE.indexOf(currentTheme);
      const nextTheme = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length] ?? 'system';

      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);

      return nextTheme;
    });
  }, [applyTheme]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preference = THEME_SEQUENCE.includes(storedTheme as ThemePreference)
      ? (storedTheme as ThemePreference)
      : 'system';

    applyTheme(preference);
  }, [applyTheme]);

  return (
    <ArcThemeContext.Provider value={{ theme, setTheme, applyTheme, cycleTheme }}>
      {children}
    </ArcThemeContext.Provider>
  );
}

export default ArcThemeProvider;

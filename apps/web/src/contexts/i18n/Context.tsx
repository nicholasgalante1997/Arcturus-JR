import React, { createContext, useContext } from 'react';

import { LocaleResourceKey, SupportedLocale } from './types';

/**
 * It just feels like adding react-i18n is overkill for this project
 * so we are creating a very simple i18n context to handle translations.
 * We can always replace it with a more robust solution later if needed.
 *
 * https://react.i18next.com/guides/quick-start
 */
type I18nContextType = {
  locale: SupportedLocale;
  setLocale: React.Dispatch<React.SetStateAction<SupportedLocale>>;
  t: (key: LocaleResourceKey, ...args: string[]) => string;
};

export const I18nContext = createContext<I18nContextType>({
  locale: 'en_US',
  setLocale: () => {},
  t: (key: string) => key
});

export const useI18nContext = () => useContext(I18nContext);

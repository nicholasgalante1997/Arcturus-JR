import type { SupportedLocale, LocaleJSON, LocaleResourceKey } from '../types';

export const I18nResourceVariableRegex = new RegExp(/%{1}[a-zA-Z_]+%{1}/gm);

export const t = (
  data: LocaleJSON,
  locale: SupportedLocale,
  key: LocaleResourceKey,
  ...args: string[]
): string => {
  const translation = data.resources[key];
  let formatted = translation;
  if (I18nResourceVariableRegex.test(translation)) {
    for (const matches of translation.matchAll(I18nResourceVariableRegex)) {
      for (const match of matches) {
        const replacement = args[matches.indexOf(match)] || '';
        formatted = formatted.replace(match, replacement);
      }
    }
  }

  if (I18nResourceVariableRegex.test(formatted)) {
    console.warn(
      `(i18n.t): Missing variables for translation key "${key}" in locale "${locale}". Returning unformatted string.`
    );
    return translation;
  }

  return formatted;
};

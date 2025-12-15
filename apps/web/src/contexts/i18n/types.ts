import en_us from './locales/en_US.json';

export type LocaleJSON = typeof en_us;
export type LocaleResourceKey = keyof typeof en_us.resources;
export type SupportedLocale = 'en_US';
export type LocaleResources = Record<LocaleResourceKey, string>;
export type Locale = {
  code: SupportedLocale;
  resources: LocaleResources;
};

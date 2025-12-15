import { z } from 'zod';

import type { LocaleJSON, SupportedLocale } from '../types';

const LocaleJSONSchema = z.object({
  resources: z.record(z.string(), z.string())
});

export async function fetchI18nLocaleResources(locale: SupportedLocale): Promise<LocaleJSON> {
  try {
    const locale_json = await import(
      /* webpackChunkName: "locale_copy~[request]~chunk" */
      /* webpackInclude: /\.(json)$/ */
      /* webpackMode: "lazy" */
      /* webpackExports: ["default"] */
      /* webpackFetchPriority: "high" */
      /* webpackPrefetch: true */
      /* webpackPreload: true */
      `@/contexts/i18n/locales/${locale}.json`
    );

    const validated = LocaleJSONSchema.parse(locale_json.default);
    return validated as LocaleJSON;
  } catch (e) {
    console.error(`(fetchI18nLocaleResources): Failed to load or validate locale ${locale}:`, e);
    throw e instanceof Error ? e : new Error(JSON.stringify(e));
  }
}

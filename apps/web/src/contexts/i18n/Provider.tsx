import React, { Suspense, use, useCallback, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import V2ErrorPage from '@/pages/v2_Error';

import { t } from './utils/format';
import { fetchI18nLocaleResources } from './utils/locale';
import { I18nContext } from './Context';

import type { LocaleJSON, LocaleResourceKey, SupportedLocale } from './types';

interface I18nProviderProps extends React.PropsWithChildren {
  locale: SupportedLocale;
}

interface I18nPromiseProviderProps extends I18nProviderProps {
  setLocale: React.Dispatch<React.SetStateAction<SupportedLocale>>;
}

interface I18nPromiseResolverProps extends I18nPromiseProviderProps {
  promise: Promise<LocaleJSON>;
}

function I18nPromiseProvider({ locale, children, setLocale }: I18nPromiseProviderProps) {
  const i18nPromise = React.useMemo(() => {
    return fetchI18nLocaleResources(locale);
  }, [locale]);

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <V2ErrorPage
          error={error}
          resetErrorBoundary={() => {
            resetErrorBoundary();

            /** Stable default locale */
            setLocale('en_US');
          }}
        />
      )}
    >
      <Suspense fallback={null}>
        <I18nPromiseResolver locale={locale} promise={i18nPromise} setLocale={setLocale}>
          {children}
        </I18nPromiseResolver>
      </Suspense>
    </ErrorBoundary>
  );
}

function I18nPromiseResolver({ promise, children, locale, setLocale }: I18nPromiseResolverProps) {
  const data = use(promise);
  const _t = useCallback(
    (key: LocaleResourceKey, ...args: string[]) => {
      return t(data, locale, key, ...args);
    },
    [data, locale]
  );
  return <I18nContext.Provider value={{ t: _t, locale, setLocale }}>{children}</I18nContext.Provider>;
}

function I18nProvider({ locale: p_locale, children }: I18nProviderProps) {
  const [locale, setLocale] = React.useState<SupportedLocale>(p_locale);

  useEffect(() => {
    if (locale !== p_locale) {
      setLocale(p_locale);
    }
  }, [p_locale]);

  return (
    <I18nPromiseProvider locale={locale} setLocale={setLocale}>
      {children}
    </I18nPromiseProvider>
  );
}

export default I18nProvider;

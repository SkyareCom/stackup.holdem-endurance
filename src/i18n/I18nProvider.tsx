import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, translate } from './core';
import { loadLocale, saveLocale } from './storage';
import type { I18nContextValue, Locale, TranslationKey } from './types';

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadLocale().then((stored) => {
      if (!active) return;
      setLocaleState(stored);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void saveLocale(next);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  if (!ready) return null;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

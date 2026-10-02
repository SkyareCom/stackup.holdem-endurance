export type Locale = 'pt' | 'en' | 'es';
export type TranslationKey = keyof typeof import('./translations/pt').pt;

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

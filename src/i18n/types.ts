export type Locale = 'pt' | 'en' | 'es';
export type TranslationKey = string;

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

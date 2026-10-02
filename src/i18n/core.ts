import type { Locale } from './types';

export const DEFAULT_LOCALE: Locale = 'pt';
export const SUPPORTED_LOCALES: readonly Locale[] = ['pt', 'en', 'es'] as const;

export function normalizeLocale(value: unknown): Locale {
  return value === 'pt' || value === 'en' || value === 'es' ? value : DEFAULT_LOCALE;
}

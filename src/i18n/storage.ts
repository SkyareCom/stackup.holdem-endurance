import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LOCALE, normalizeLocale } from './core';
import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = '@stackup/endurance/locale';

export async function loadLocale(): Promise<Locale> {
  try {
    const value = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    return normalizeLocale(value);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function saveLocale(locale: Locale): Promise<void> {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

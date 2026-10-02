import type { Locale } from '../types';
import { pt, type TranslationCatalog } from './pt';
import { en } from './en';
import { es } from './es';

export const translations = { pt, en, es } satisfies Record<Locale, TranslationCatalog>;
export { pt, en, es };

import type { Locale } from '../types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';

export const translations = { pt, en, es } satisfies Record<Locale, typeof pt>;
export { pt, en, es };

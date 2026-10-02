import { describe, expect, it } from 'vitest';
import { normalizeLocale } from '../core';

describe('normalizeLocale', () => {
  it('defaults missing or invalid values to Portuguese', () => {
    expect(normalizeLocale(undefined)).toBe('pt');
    expect(normalizeLocale(null)).toBe('pt');
    expect(normalizeLocale('')).toBe('pt');
    expect(normalizeLocale('fr')).toBe('pt');
  });

  it('preserves supported locale identifiers', () => {
    expect(normalizeLocale('pt')).toBe('pt');
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('es')).toBe('es');
  });
});

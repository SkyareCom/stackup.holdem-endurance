import { beforeEach, describe, expect, it, vi } from 'vitest';

const getItem = vi.fn();
const setItem = vi.fn();

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem, setItem },
}));

import { loadLocale, saveLocale, LOCALE_STORAGE_KEY } from '../storage';

describe('locale storage', () => {
  beforeEach(() => {
    getItem.mockReset();
    setItem.mockReset();
  });

  it('loads Portuguese when storage is empty or invalid', async () => {
    getItem.mockResolvedValueOnce(null);
    await expect(loadLocale()).resolves.toBe('pt');

    getItem.mockResolvedValueOnce('fr');
    await expect(loadLocale()).resolves.toBe('pt');
  });

  it('loads supported stored locales', async () => {
    getItem.mockResolvedValueOnce('en');
    await expect(loadLocale()).resolves.toBe('en');

    getItem.mockResolvedValueOnce('es');
    await expect(loadLocale()).resolves.toBe('es');
  });

  it('persists the exact supported locale', async () => {
    setItem.mockResolvedValue(undefined);
    await saveLocale('es');
    expect(setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, 'es');
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: mocks.getItem, setItem: mocks.setItem },
}));

import { loadLocale, saveLocale, LOCALE_STORAGE_KEY } from '../storage';

describe('locale storage', () => {
  beforeEach(() => {
    mocks.getItem.mockReset();
    mocks.setItem.mockReset();
  });

  it('loads Portuguese when storage is empty or invalid', async () => {
    mocks.getItem.mockResolvedValueOnce(null);
    await expect(loadLocale()).resolves.toBe('pt');

    mocks.getItem.mockResolvedValueOnce('fr');
    await expect(loadLocale()).resolves.toBe('pt');
  });

  it('loads supported stored locales', async () => {
    mocks.getItem.mockResolvedValueOnce('en');
    await expect(loadLocale()).resolves.toBe('en');

    mocks.getItem.mockResolvedValueOnce('es');
    await expect(loadLocale()).resolves.toBe('es');
  });

  it('persists the exact supported locale', async () => {
    mocks.setItem.mockResolvedValue(undefined);
    await saveLocale('es');
    expect(mocks.setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, 'es');
  });
});

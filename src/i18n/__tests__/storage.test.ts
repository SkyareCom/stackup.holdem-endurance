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

  it('serializes rapid locale writes so the last selection is persisted last', async () => {
    const resolvers: Array<() => void> = [];
    mocks.setItem.mockImplementation(() => new Promise<void>((resolve) => resolvers.push(resolve)));

    const first = saveLocale('pt');
    const second = saveLocale('en');
    const third = saveLocale('es');

    await Promise.resolve();
    expect(mocks.setItem).toHaveBeenCalledTimes(1);
    expect(mocks.setItem).toHaveBeenNthCalledWith(1, LOCALE_STORAGE_KEY, 'pt');

    resolvers.shift()?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(mocks.setItem).toHaveBeenCalledTimes(2);
    expect(mocks.setItem).toHaveBeenNthCalledWith(2, LOCALE_STORAGE_KEY, 'en');

    resolvers.shift()?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(mocks.setItem).toHaveBeenCalledTimes(3);
    expect(mocks.setItem).toHaveBeenNthCalledWith(3, LOCALE_STORAGE_KEY, 'es');

    resolvers.shift()?.();
    await Promise.all([first, second, third]);
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (relative: string) => fs.readFileSync(path.join(root, relative), 'utf8');

describe('shared language selector contract', () => {
  it('defines one shared selector with exactly PT EN ES and no local locale state', () => {
    const source = read('src/components/LanguageSelector.tsx');
    expect(source).toContain("['pt', 'en', 'es']");
    expect(source).toContain('useI18n');
    expect(source).not.toContain('useState');
  });

  it('uses the same selector on landing and Profile', () => {
    const landing = read('app/index.tsx');
    const profile = read('src/screens/ProfileScreen.tsx');

    expect(landing).toContain('LanguageSelector');
    expect(landing).toContain('variant="landing"');
    expect(profile).toContain('LanguageSelector');
    expect(profile).toContain('variant="profile"');
  });
});

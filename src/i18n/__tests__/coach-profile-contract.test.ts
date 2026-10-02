import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8');

describe('Coach and Profile localization contract', () => {
  it('renders Coach system copy from translation keys while preserving raw user text state', () => {
    const coach = read('src/screens/CoachScreen.tsx');
    expect(coach).toContain('useI18n');
    expect(coach).toContain("t('coach.activeContext')");
    expect(coach).toContain("t('coach.placeholder')");
    expect(coach).toContain('text:v');
    expect(coach).not.toContain('SEGURE PARA FALAR');
    expect(coach).not.toContain('Fale com o Coach...');
  });

  it('renders Profile through translation keys and keeps the shared language selector', () => {
    const profile = read('src/screens/ProfileScreen.tsx');
    expect(profile).toContain('useI18n');
    expect(profile).toContain("t('profile.title')");
    expect(profile).toContain("t('profile.languageBody')");
    expect(profile).toContain('<LanguageSelector variant="profile"/>');
    expect(profile).not.toContain('PROGRESSION');
    expect(profile).not.toContain('+8 this month');
  });
});

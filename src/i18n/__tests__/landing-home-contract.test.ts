import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8');

describe('landing home and shared UI localization contract', () => {
  it('renders landing and navigation from translation keys', () => {
    const source = read('app/index.tsx');
    expect(source).toContain("t('landing.division')");
    expect(source).toContain("t('landing.system')");
    expect(source).toContain("t('landing.enter')");
    expect(source).toContain("t('nav.home')");
    expect(source).not.toContain('PERFORMANCE DIVISION');
    expect(source).not.toContain('ENTER ENDURANCE');
  });

  it('renders Home and shared header copy from translation keys', () => {
    const home = read('src/screens/HomeScreen.tsx');
    const ui = read('src/ui.tsx');
    expect(home).toContain("t('home.subtitle')");
    expect(home).toContain("t('home.primaryAction')");
    expect(home).toContain("t('home.intelligence')");
    expect(ui).toContain("t('common.active')");
  });

  it('keeps module state metadata independent from translated labels', () => {
    const source = read('src/types.ts');
    expect(source).toContain('titleKey');
    expect(source).toContain('subtitleKey');
    expect(source).not.toContain("title: 'SALA DE GUERRA'");
  });
});

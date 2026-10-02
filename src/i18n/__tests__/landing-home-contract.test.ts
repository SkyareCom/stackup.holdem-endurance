import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read=(relative:string)=>fs.readFileSync(path.join(process.cwd(),relative),'utf8');

describe('landing, Home and shared UI localization contract',()=>{
  it('renders landing and navigation from translation keys',()=>{
    const source=read('app/index.tsx');
    expect(source).toContain("t('landing.division')");
    expect(source).toContain("t('landing.system')");
    expect(source).toContain("t('landing.enter')");
    expect(source).toContain("labelKey:'nav.home'");
    expect(source).toContain('t(i.labelKey)');
  });
  it('renders the action-first Home from translation keys',()=>{
    const home=read('src/screens/HomeScreen.tsx');
    expect(home).toContain("t('home.subtitle')");
    expect(home).toContain("t('home.nextAction')");
    expect(home).toContain("t('home.checkinNow')");
  });
  it('keeps module metadata independent from translated labels',()=>{
    const source=read('src/types.ts');
    expect(source).toContain('titleKey');
    expect(source).toContain('subtitleKey');
  });
});

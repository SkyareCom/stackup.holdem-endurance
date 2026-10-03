import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const privacyPath=path.join(process.cwd(),'app/privacy.tsx');
const profile=fs.readFileSync(path.join(process.cwd(),'src/screens/ProfileScreen.tsx'),'utf8');

describe('Play Store privacy policy contract',()=>{
  it('ships a browser-readable privacy route inside the app bundle',()=>{
    expect(fs.existsSync(privacyPath)).toBe(true);
    const privacy=fs.readFileSync(privacyPath,'utf8');
    expect(privacy).toContain("t('privacy.title')");
    expect(privacy).toContain("t('privacy.dataOnDevice')");
    expect(privacy).toContain("t('privacy.networkResources')");
    expect(privacy).toContain("t('privacy.retention')");
    expect(privacy).toContain("t('privacy.contact')");
    expect(privacy).toContain('<LanguageSelector');
  });

  it('links Profile privacy settings to the privacy route',()=>{
    expect(profile).toContain("router.push('/privacy')");
  });

  it('keeps current-release disclosures explicit',()=>{
    const privacy=fs.readFileSync(privacyPath,'utf8');
    expect(privacy).toContain("t('privacy.localOnlyBody')");
    expect(privacy).toContain("t('privacy.noRemoteAiBody')");
    expect(privacy).toContain("t('privacy.pexelsBody')");
    expect(privacy).toContain("t('privacy.noMicBody')");
  });
});

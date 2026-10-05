import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');
const ui=fs.readFileSync(path.join(process.cwd(),'src/ui.tsx'),'utf8');

describe('mandatory pre-session activation contract',()=>{
  it('adds activation after cognitive reframe and before session start',()=>{
    expect(session).toContain("'pregrind.activation'");
    expect(session).toContain("'pregrind.activationBody'");
    expect(session).toContain('total={8}');
    expect(session).toContain('wizardStep===7');
  });

  it('requires the player to use a preparation tool before start',()=>{
    expect(session).toContain('activationUsed');
    expect(session).toContain("t('pregrind.openAudio')");
    expect(session).toContain("t('pregrind.openBreathing')");
    expect(session).toContain("t('pregrind.activationComplete')");
    expect(session).toContain('disabled={wizardStep===7&&!activationUsed}');
  });

  it('supports disabled primary actions in shared UI',()=>{
    expect(ui).toContain('disabled?: boolean');
    expect(ui).toContain('disabled={disabled}');
  });
});

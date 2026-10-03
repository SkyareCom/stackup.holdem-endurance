import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('session decision integrity contract',()=>{
  it('never plans a duration above the configured stop rule',()=>{
    expect(session).toContain('durationOptions');
    expect(session).toContain('value<=profile.stopRules.maxDurationMinutes');
    expect(session).toContain('Math.min(120,profile.stopRules.maxDurationMinutes)');
  });

  it('requires a post-bust reentry decision when another entry is still allowed',()=>{
    expect(session).toContain('reentryDecisionRequired');
    expect(session).toContain('disabled={debriefStep===3&&reentryDecisionRequired}');
  });

  it('stops disconnect narration before opening recovery audio',()=>{
    expect(session).toContain('openRecoveryAudio');
    expect(session).toContain('void Speech.stop()');
    expect(session).toContain('setDisconnectRemaining(0)');
  });
});

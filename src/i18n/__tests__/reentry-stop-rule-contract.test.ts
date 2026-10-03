import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const store=fs.readFileSync(path.join(process.cwd(),'src/performanceStore.tsx'),'utf8');
const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('tournament reentry stop-rule contract',()=>{
  it('persists and increments reentries in the active session',()=>{
    expect(store).toContain('reentriesUsed:number');
    expect(store).toContain('incrementReentry');
    expect(store).toContain('reentriesUsed:s.activeSession.reentriesUsed+1');
  });

  it('shows used versus allowed reentries during tournament play',()=>{
    expect(session).toContain("t('session.reentriesUsed')");
    expect(session).toContain('activeSession.reentriesUsed');
    expect(session).toContain('activeSession.plan.maxReentries');
  });

  it('blocks reentry once the configured limit is reached',()=>{
    expect(session).toContain('reentryLimitReached');
    expect(session).toContain("t('debrief.reentryLimitReached')");
    expect(session).toContain('disabled={reentryLimitReached}');
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const session=fs.readFileSync(path.join(process.cwd(),'src/screens/SessionScreen.tsx'),'utf8');

describe('plan versus execution contract',()=>{
  it('shows plan and actual execution separately from financial result',()=>{
    expect(session).toContain("t('debrief.planVsExecution')");
    expect(session).toContain("t('debrief.plannedGoal')");
    expect(session).toContain("t('debrief.plannedLimit')");
    expect(session).toContain("t('debrief.actualDuration')");
    expect(session).toContain("t('session.reentriesUsed')");
  });

  it('derives actual duration from real session timestamps',()=>{
    expect(session).toContain('actualDurationMinutes');
    expect(session).toContain('Date.now()-activeSession.startedAt');
  });
});

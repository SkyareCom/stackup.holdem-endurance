import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read=(relative:string)=>fs.readFileSync(path.join(process.cwd(),relative),'utf8');

describe('Session localization and stable-state contract',()=>{
  it('defines process goals and triggers as stable ids plus translation keys',()=>{
    const content=read('src/content.ts');
    expect(content).toContain("id: 'process'");
    expect(content).toContain("labelKey: 'session.goal.process'");
    expect(content).toContain("id: 'revenge'");
    expect(content).toContain("labelKey: 'trigger.revenge'");
  });
  it('stores stable ids rather than translated labels',()=>{
    const source=read('src/screens/SessionScreen.tsx');
    expect(source).toMatch(/useState<ProcessGoalId>\('process'\)/);
    expect(source).toContain('setGoal');
    expect(source).toContain('t(x.labelKey)');
    expect(source).toContain('toggle(x.id)');
    expect(source).toContain('triggers.includes(x.id)');
  });
  it('renders sequential pre-grind, live, debrief and recovery from translation keys',()=>{
    const source=read('src/screens/SessionScreen.tsx');
    expect(source).toContain("t('pregrind.title')");
    expect(source).toContain("t('session.executionState')");
    expect(source).toContain("t('session.debrief')");
    expect(source).toContain("t('recovery.title')");
    expect(source).toContain('t(decisionCues[cue])');
  });
});

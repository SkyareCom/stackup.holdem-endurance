import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8');

describe('Session localization and stable-state contract', () => {
  it('defines process goals and war-room triggers as stable ids plus translation keys', () => {
    const content = read('src/content.ts');
    expect(content).toContain("id: 'process'");
    expect(content).toContain("labelKey: 'session.goal.process'");
    expect(content).toContain("id: 'anger'");
    expect(content).toContain("labelKey: 'trigger.anger'");
    expect(content).not.toContain("export const warRoomTriggers = ['BAD BEAT'");
  });

  it('stores goal and trigger ids instead of translated labels', () => {
    const source = read('src/screens/SessionScreen.tsx');
    expect(source).toContain("useState('process')");
    expect(source).toContain('setGoal(x.id)');
    expect(source).toContain('t(x.labelKey)');
    expect(source).toContain('toggle(x.id)');
    expect(source).toContain('triggers.includes(x.id)');
  });

  it('renders every Session phase and decision cue from translation keys', () => {
    const source = read('src/screens/SessionScreen.tsx');
    expect(source).toContain("t('session.readyCheck')");
    expect(source).toContain("t('session.executionState')");
    expect(source).toContain("t('session.debrief')");
    expect(source).toContain('t(decisionCues[cue])');
    expect(source).not.toContain('START SESSION');
    expect(source).not.toContain('CURRENT EXECUTION STATE');
  });
});

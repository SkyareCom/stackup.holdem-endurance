import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const source = fs.readFileSync(path.join(process.cwd(), 'src/screens/SessionScreen.tsx'), 'utf8');

describe('guided Session contract', () => {
  it('shows explicit progress through all three phases', () => {
    expect(source).toContain("import { FlowProgress }");
    expect(source).toContain('current={1}');
    expect(source).toContain('current={2}');
    expect(source).toContain('current={3}');
    expect(source).toContain('total={3}');
  });

  it('explains Ready Check before asking for ratings', () => {
    const what = source.indexOf("t('session.readyWhat')");
    const why = source.indexOf("t('session.readyWhy')");
    const how = source.indexOf("t('session.readyHow')");
    const scales = source.indexOf('<Scale');
    expect(what).toBeGreaterThanOrEqual(0);
    expect(why).toBeGreaterThan(what);
    expect(how).toBeGreaterThan(why);
    expect(scales).toBeGreaterThan(how);
    expect(source).toContain('descriptionKey');
  });

  it('keeps active-session priorities ordered and debrief actionable', () => {
    const clock = source.indexOf('s.clock');
    const game = source.indexOf('s.gameState');
    const cue = source.indexOf('s.cueBlock');
    const action = source.indexOf("t('session.currentPriority')");
    expect(clock).toBeGreaterThanOrEqual(0);
    expect(game).toBeGreaterThan(clock);
    expect(cue).toBeGreaterThan(game);
    expect(action).toBeGreaterThan(cue);

    expect(source).toContain("t('session.howEnded')");
    expect(source).toContain("t('session.whatLearn')");
    expect(source).toContain("t('session.nextTraining')");
  });
});

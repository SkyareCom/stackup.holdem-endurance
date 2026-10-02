import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const source = fs.readFileSync(path.join(process.cwd(), 'src/screens/HomeScreen.tsx'), 'utf8');

describe('guided Home contract', () => {
  it('renders the performance journey in the required order', () => {
    const tokens = [
      "t('home.stateToday')",
      "t('home.meaning')",
      "t('home.focusOfDay')",
      "t('home.recommendedAction')",
      "t('home.toolsForThis')",
      "t('home.decisionCue')",
    ];
    const positions = tokens.map((token) => source.indexOf(token));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('uses deterministic guidance and one primary action', () => {
    expect(source).toContain('getReadinessGuidance');
    expect(source).toContain('getHistoryGuidance');
    expect(source).toContain('<PremiumButton');
    expect((source.match(/<PremiumButton/g) ?? []).length).toBe(1);
  });

  it('does not fabricate historical guidance before persistent history exists', () => {
    expect(source).toContain('const hasHistory = false');
    expect(source).toContain('getHistoryGuidance({ hasHistory, thirdBlockDrop: false })');
    expect(source).toContain("t('common.insufficientData')");
    expect(source).not.toContain('02:55 → 03:30');
  });

  it('only exposes BREAK 4 as a Home tool when history actually supports it', () => {
    expect(source).toContain("focus.actionId==='break-4'");
  });

  it('does not keep the old isolated quick-card grid', () => {
    expect(source).not.toContain('s.quickGrid');
    expect(source).not.toContain('s.quickCard');
  });
});

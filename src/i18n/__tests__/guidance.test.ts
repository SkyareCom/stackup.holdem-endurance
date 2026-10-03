import { describe, expect, it } from 'vitest';
import { getHistoryGuidance, getReadinessGuidance } from '../../guidance';

describe('guided readiness recommendations', () => {
  it('recommends reset when focus is low', () => {
    expect(getReadinessGuidance({ energy: 4, focus: 2, tension: 2 }).actionId).toBe('reset');
  });

  it('recommends reset when tension is high', () => {
    expect(getReadinessGuidance({ energy: 4, focus: 4, tension: 4 }).actionId).toBe('reset');
  });

  it('recommends starting the session when readiness is stable', () => {
    expect(getReadinessGuidance({ energy: 4, focus: 4, tension: 2 }).actionId).toBe('start-session');
  });

  it('does not invent historical guidance without history', () => {
    expect(getHistoryGuidance({ hasHistory: false, thirdBlockDrop: true })).toBeNull();
  });

  it('recommends Break 4 for a known third-block decline', () => {
    expect(getHistoryGuidance({ hasHistory: true, thirdBlockDrop: true })?.actionId).toBe('break-4');
  });
});

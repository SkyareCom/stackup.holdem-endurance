import { describe, expect, it } from 'vitest';
import {
  calculateMentalEv,
  calculateReadiness,
  classifyTiltRisk,
  deriveMentalState,
  getBaselineConfidence,
  getRitualMinutes,
  getSessionAction,
  pearsonCorrelation,
} from '../../performanceEngine';

describe('ENDURANCE performance engine', () => {
  it('normalizes readiness to 0-100 from real check-in inputs', () => {
    expect(calculateReadiness({
      sleep: 8, personalStress: 2, financialStress: 2,
      tension: 2, fatigue: 2, energy: 8, mentalDrive: 8,
    })).toBeGreaterThanOrEqual(70);
    expect(calculateReadiness({
      sleep: 2, personalStress: 8, financialStress: 8,
      tension: 8, fatigue: 8, energy: 2, mentalDrive: 2,
    })).toBeLessThan(40);
  });

  it('calculates Mental EV on a 0-10 scale with the approved weights', () => {
    expect(calculateMentalEv({ gameQuality: 8, foldDiscipline: 6, readinessIndex: 70 })).toBeCloseTo(7.1, 5);
  });

  it('detects elevated tilt risk including euphoria / winner tilt', () => {
    expect(classifyTiltRisk({ tension: 8, fatigue: 8, impulse: 8, emotion: 'anger' })).toBe('critical');
    expect(classifyTiltRisk({ tension: 4, fatigue: 3, impulse: 8, emotion: 'euphoria' })).not.toBe('low');
  });

  it('derives state and ritual intensity without historical fixtures', () => {
    expect(deriveMentalState({ readinessIndex: 82, tiltRisk: 'low', sessionMinutes: 0 })).toBe('centered');
    expect(deriveMentalState({ readinessIndex: 55, tiltRisk: 'medium', sessionMinutes: 90 })).toBe('vulnerable');
    expect(getRitualMinutes(85, 'low')).toBe(3);
    expect(getRitualMinutes(62, 'medium')).toBe(7);
    expect(getRitualMinutes(35, 'critical')).toBe(12);
  });

  it('uses containment instead of stop-session when an MTT cannot be left', () => {
    expect(getSessionAction({ mode: 'tournament', canLeave: false, tiltRisk: 'critical', fatigue: 9 })).toBe('contain');
    expect(getSessionAction({ mode: 'cash', canLeave: true, tiltRisk: 'critical', fatigue: 9 })).toBe('stop-session');
  });

  it('grades baseline confidence by persisted sample size', () => {
    expect(getBaselineConfidence(0)).toBe('none');
    expect(getBaselineConfidence(6)).toBe('low');
    expect(getBaselineConfidence(12)).toBe('moderate');
    expect(getBaselineConfidence(24)).toBe('high');
  });

  it('computes observed short-term correlation without forcing a conclusion', () => {
    expect(pearsonCorrelation([1,2,3],[2,4,6])).toBeCloseTo(1, 5);
    expect(pearsonCorrelation([1,2],[2,1])).toBeNull();
  });
});

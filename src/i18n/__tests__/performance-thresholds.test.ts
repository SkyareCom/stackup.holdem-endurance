import { describe, expect, it } from 'vitest';
import { getSessionAction } from '../../performanceEngine';

describe('personal performance thresholds',()=>{
  it('changes the recommended intervention when focus or tension crosses configured limits',()=>{
    expect(getSessionAction({
      mode:'cash',canLeave:true,tiltRisk:'low',fatigue:3,
      focus:3,tension:4,minFocus:4,maxTension:7,
    })).toBe('break-4');
    expect(getSessionAction({
      mode:'tournament',canLeave:false,tiltRisk:'low',fatigue:3,
      focus:7,tension:8,minFocus:4,maxTension:7,
    })).toBe('contain');
  });
});

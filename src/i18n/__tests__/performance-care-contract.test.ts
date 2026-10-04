import { describe,expect,it } from 'vitest';
import { buildPerformanceCare } from '../../performanceCare';

describe('performance care',()=>{
  it('prioritizes recovery and medical safety from objective lifestyle signals',()=>{
    const actions=buildPerformanceCare({sleepHours:5.5,sleepQuality:3,hydration:3,mealQuality:3,hoursSinceMeal:6,caffeineMg:300,caffeineHoursAgo:1,movementMinutes:5,strengthDaysThisWeek:0,sittingHours:6,painOrIllness:true});
    expect(actions.map(x=>x.priority)).toEqual(expect.arrayContaining(['medical','sleep','hydration','nutrition','caffeine','movement']));
    expect(actions.find(x=>x.priority==='medical')?.severity).toBe('high');
  });
  it('does not invent problems when the daily base is favorable',()=>{
    const actions=buildPerformanceCare({sleepHours:8,sleepQuality:8,hydration:8,mealQuality:8,hoursSinceMeal:3,caffeineMg:0,caffeineHoursAgo:24,movementMinutes:45,strengthDaysThisWeek:2,sittingHours:2,painOrIllness:false});
    expect(actions).toHaveLength(1);expect(actions[0].priority).toBe('ready');
  });
});

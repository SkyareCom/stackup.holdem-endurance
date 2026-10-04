import { describe,expect,it } from 'vitest';
import { buildPerformanceCare,buildDailyCareTasks,weeklyMovementProgress } from '../../performanceCare';

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
  it('creates daily actions and evidence-based weekly movement targets',()=>{
    const input={sleepHours:6,sleepQuality:4,hydration:4,mealQuality:5,hoursSinceMeal:5,caffeineMg:100,caffeineHoursAgo:2,movementMinutes:10,strengthDaysThisWeek:1,sittingHours:4,painOrIllness:false};
    const tasks=buildDailyCareTasks(input);const weekly=weeklyMovementProgress(input);
    expect(tasks.map(x=>x.domain)).toEqual(expect.arrayContaining(['sleep','hydration','nutrition','movement']));
    expect(weekly.strengthTarget).toContain('2+');expect(weekly.aerobicTarget).toContain('150');
  });
  it('keeps health guidance non-diagnostic and non-prescriptive',()=>{const source=buildPerformanceCare({sleepHours:4,sleepQuality:2,hydration:2,mealQuality:2,hoursSinceMeal:8,caffeineMg:400,caffeineHoursAgo:1,movementMinutes:0,strengthDaysThisWeek:0,sittingHours:8,painOrIllness:true}).map(x=>x.action.toLowerCase()).join(' ');expect(source).not.toMatch(/diagnost|prescrev|dose de medicamento|suplemento obrigatório/);expect(source).toContain('avaliação profissional');});
});

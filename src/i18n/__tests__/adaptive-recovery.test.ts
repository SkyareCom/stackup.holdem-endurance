import { describe, expect, it } from 'vitest';
import { getRecoveryPlan, type SessionRecord } from '../../performanceEngine';

const base:SessionRecord={
  id:'s',startedAt:0,endedAt:60*60*1000,
  pre:{createdAt:0,sleep:7,personalStress:2,financialStress:2,tension:2,fatigue:2,energy:8,mentalDrive:8,emotion:'calm',reason:'planned',impulse:2},
  plan:{mode:'cash',canLeave:true,expectedMinutes:120,maxReentries:0,processGoal:'process'},
  checkins:[],
  debrief:{financialResult:null,resultHidden:true,gameQuality:8,foldDiscipline:8,patience:8,decisionConfidence:8,professionalConduct:8,attitude:8,resilience:8,gameUnderstanding:8,logic:8,endState:'A',triggers:[],busted:false,reentryDecision:'none'},
  readinessIndex:80,mentalEv:8,
};

describe('adaptive recovery plan',()=>{
  it('keeps a light disconnect after a stable session',()=>{
    expect(getRecoveryPlan(base)).toBe('personal');
  });
  it('prioritizes sleep/recovery when fatigue dominated the session',()=>{
    expect(getRecoveryPlan({...base,debrief:{...base.debrief,endState:'C',triggers:['fatigue']}})).toBe('sleep');
  });
  it('uses cooldown when execution ended under pressure without fatigue dominance',()=>{
    expect(getRecoveryPlan({...base,debrief:{...base.debrief,endState:'C',triggers:['anger']}})).toBe('cooldown');
  });
});

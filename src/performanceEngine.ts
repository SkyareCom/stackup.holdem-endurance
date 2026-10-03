export type Emotion = 'calm'|'fear'|'anger'|'frustration'|'greed'|'euphoria'|'anxiety';
export type PlayReason = 'planned'|'important'|'study'|'recover-loss'|'boredom'|'fomo'|'ego';
export type GameMode = 'cash'|'tournament';
export type TiltRisk = 'low'|'medium'|'critical';
export type MentalState = 'ready'|'vulnerable'|'fatigued'|'tilt-risk'|'recovery';
export type SessionAction = 'continue'|'check-in'|'break-4'|'contain'|'stop-session';
export type BaselineConfidence = 'none'|'low'|'moderate'|'high';
export type RecoveryPlan = 'cooldown'|'sleep'|'personal';
export type Temperament = 'impulsive'|'passive'|'perfectionist'|'analytical';
export type TiltTrigger =
  | 'bad-beat'|'own-error'|'anger'|'rush'|'fear'|'euphoria'|'fatigue'|'autopilot'
  | 'revenge'|'personal';

export type ReadinessInput = {
  sleep:number;
  personalStress:number;
  financialStress:number;
  tension:number;
  fatigue:number;
  energy:number;
  mentalDrive:number;
  nutrition?:number;
  hydration?:number;
  physicalActivity?:number;
};

export type PreGrindCheckin = ReadinessInput & {
  createdAt:number;
  emotion:Emotion;
  reason:PlayReason;
  impulse:number;
};

export type RuntimeCheckin = {
  createdAt:number;
  minute:number;
  focus:number;
  tension:number;
  impulse:number;
  fatigue:number;
  state:'A'|'B'|'C';
  trigger?:TiltTrigger;
};

export type SessionPlan = {
  mode:GameMode;
  canLeave:boolean;
  expectedMinutes:number;
  maxReentries:number;
  processGoal:string;
  stakesLabel?:string;
};

export type StopRules = {
  maxDurationMinutes:number;
  maxReentries:number;
  minFocus:number;
  maxTension:number;
  noStakeIncrease:boolean;
};

export type DebriefData = {
  financialResult:number|null;
  resultHidden:boolean;
  gameQuality:number;
  foldDiscipline:number;
  patience:number;
  decisionConfidence:number;
  professionalConduct:number;
  attitude:number;
  resilience:number;
  gameUnderstanding:number;
  logic:number;
  endState:'A'|'B'|'C';
  triggers:TiltTrigger[];
  busted:boolean;
  reentryDecision:'none'|'stop'|'reenter';
};

export type SessionRecord = {
  id:string;
  startedAt:number;
  endedAt:number;
  pre:PreGrindCheckin;
  plan:SessionPlan;
  checkins:RuntimeCheckin[];
  reentriesUsed?:number;
  debrief:DebriefData;
  readinessIndex:number;
  mentalEv:number;
};

export type SOSProtocol = {
  id:'reanchor'|'ego-reset'|'sit-out'|'containment'|'slow-down'|'personal-reset';
  seconds:45|60;
};

const clamp=(n:number,min=0,max=10)=>Math.max(min,Math.min(max,n));
const inverse=(n:number)=>10-clamp(n);

export function calculateReadiness(input: ReadinessInput): number {
  const weighted =
    clamp(input.sleep)*1.25 +
    inverse(input.personalStress)*0.9 +
    inverse(input.financialStress)*0.7 +
    inverse(input.tension)*1.25 +
    inverse(input.fatigue)*1.25 +
    clamp(input.energy)*1.4 +
    clamp(input.mentalDrive)*1.5 +
    clamp(input.nutrition??5)*0.55 +
    clamp(input.hydration??5)*0.55 +
    clamp(input.physicalActivity??5)*0.65;
  return Math.round(Math.max(0,Math.min(100,weighted)));
}

export function calculateMentalEv(input:{gameQuality:number;foldDiscipline:number;readinessIndex:number}):number {
  const value=clamp(input.gameQuality)*0.4+clamp(input.foldDiscipline)*0.3+(Math.max(0,Math.min(100,input.readinessIndex))/10)*0.3;
  return Math.round(value*100)/100;
}

export function classifyTiltRisk(input:{tension:number;fatigue:number;impulse:number;emotion:Emotion}):TiltRisk {
  const emotional =
    input.emotion==='anger'||input.emotion==='frustration'?2:
    input.emotion==='euphoria'||input.emotion==='greed'?1.5:
    input.emotion==='fear'||input.emotion==='anxiety'?1:0;
  const score=clamp(input.tension)*0.3+clamp(input.fatigue)*0.25+clamp(input.impulse)*0.3+emotional;
  if(score>=7) return 'critical';
  if(score>=4.25) return 'medium';
  return 'low';
}

export function deriveMentalState(input:{readinessIndex:number;tiltRisk:TiltRisk;sessionMinutes:number}):MentalState {
  if(input.tiltRisk==='critical') return 'tilt-risk';
  if(input.sessionMinutes>=180 || input.readinessIndex<45) return 'fatigued';
  if(input.tiltRisk==='medium' || input.readinessIndex<70) return 'vulnerable';
  return 'ready';
}

export function getRitualMinutes(readinessIndex:number,tiltRisk:TiltRisk):3|7|12 {
  if(tiltRisk==='critical'||readinessIndex<45) return 12;
  if(tiltRisk==='medium'||readinessIndex<75) return 7;
  return 3;
}


export function getRecoveryPlan(session:SessionRecord|null):RecoveryPlan {
  if(!session) return 'personal';
  const durationMinutes=Math.max(0,(session.endedAt-session.startedAt)/60000);
  const fatigueDominant=session.debrief.triggers.includes('fatigue');
  if(fatigueDominant) return 'sleep';
  if(session.debrief.endState==='C'||durationMinutes>=180||session.mentalEv<5) return 'cooldown';
  return 'personal';
}

export function getSessionAction(input:{
  mode:GameMode;
  canLeave:boolean;
  tiltRisk:TiltRisk;
  fatigue:number;
  focus?:number;
  tension?:number;
  minFocus?:number;
  maxTension?:number;
}):SessionAction {
  if(input.tiltRisk==='critical'||input.fatigue>=9) {
    if(input.mode==='tournament'&&!input.canLeave) return 'contain';
    return 'stop-session';
  }
  const lowFocus=input.focus!==undefined&&input.minFocus!==undefined&&input.focus<input.minFocus;
  const highTension=input.tension!==undefined&&input.maxTension!==undefined&&input.tension>input.maxTension;
  if(highTension&&input.mode==='tournament'&&!input.canLeave) return 'contain';
  if(lowFocus||highTension||input.fatigue>=7) return 'break-4';
  if(input.tiltRisk==='medium') return 'check-in';
  return 'continue';
}

export function getBaselineConfidence(count:number):BaselineConfidence {
  if(count<minimumBaselineSessions) return 'none';
  if(count<10) return 'low';
  if(count<20) return 'moderate';
  return 'high';
}

export function pearsonCorrelation(xs:number[],ys:number[]):number|null {
  if(xs.length!==ys.length||xs.length<3) return null;
  const n=xs.length;
  const mx=xs.reduce((a,b)=>a+b,0)/n;
  const my=ys.reduce((a,b)=>a+b,0)/n;
  let num=0,dx=0,dy=0;
  for(let i=0;i<n;i++){
    const a=xs[i]-mx,b=ys[i]-my;
    num+=a*b;dx+=a*a;dy+=b*b;
  }
  const den=Math.sqrt(dx*dy);
  if(!den) return null;
  return Math.round((num/den)*1000)/1000;
}

export function getSOSProtocol(trigger:TiltTrigger,mode:GameMode):SOSProtocol {
  if(trigger==='revenge'||trigger==='anger') return {id:'ego-reset',seconds:60};
  if(trigger==='fatigue') return mode==='tournament'?{id:'containment',seconds:60}:{id:'sit-out',seconds:60};
  if(trigger==='rush'||trigger==='autopilot') return {id:'slow-down',seconds:45};
  if(trigger==='personal') return {id:'personal-reset',seconds:60};
  return {id:'reanchor',seconds:60};
}

export function dominantTrigger(sessions:SessionRecord[]):TiltTrigger|null {
  const counts=new Map<TiltTrigger,number>();
  for(const session of sessions){
    const all=[...session.debrief.triggers,...session.checkins.map(c=>c.trigger).filter(Boolean) as TiltTrigger[]];
    for(const trigger of all) counts.set(trigger,(counts.get(trigger)??0)+1);
  }
  let winner:TiltTrigger|null=null,max=0;
  for(const [trigger,count] of counts) if(count>max){winner=trigger;max=count;}
  return winner;
}

export function buildBaseline(sessions:SessionRecord[]) {
  const count=sessions.length;
  const avg=(values:number[])=>values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
  const financial=sessions.filter(s=>!s.debrief.resultHidden&&s.debrief.financialResult!==null);
  return {
    count,
    confidence:getBaselineConfidence(count),
    averageReadiness:Math.round(avg(sessions.map(s=>s.readinessIndex))),
    averageMentalEv:Math.round(avg(sessions.map(s=>s.mentalEv))*100)/100,
    averageDurationMinutes:Math.round(avg(sessions.map(s=>(s.endedAt-s.startedAt)/60000))),
    topTrigger:dominantTrigger(sessions),
    resultCorrelation:pearsonCorrelation(
      financial.map(s=>s.debrief.financialResult as number),
      financial.map(s=>s.mentalEv)
    ),
    sleepToMentalEvCorrelation:pearsonCorrelation(sessions.map(s=>s.pre.sleep),sessions.map(s=>s.mentalEv)),
    stressToMentalEvCorrelation:pearsonCorrelation(
      sessions.map(s=>(s.pre.personalStress+s.pre.financialStress)/2),
      sessions.map(s=>s.mentalEv)
    ),
    readinessToMentalEvCorrelation:pearsonCorrelation(sessions.map(s=>s.readinessIndex),sessions.map(s=>s.mentalEv)),
  };
}

export function buildTiltProfile(sessions:SessionRecord[]) {
  const counts=new Map<TiltTrigger,number>();
  for(const session of sessions){
    for(const trigger of session.debrief.triggers) counts.set(trigger,(counts.get(trigger)??0)+1);
    for(const checkin of session.checkins) if(checkin.trigger) counts.set(checkin.trigger,(counts.get(checkin.trigger)??0)+1);
  }
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([trigger,count])=>({trigger,count}));
}

export function mentalEvComponents(input:{gameQuality:number;foldDiscipline:number;readinessIndex:number;attitude:number;logic:number;patience:number}) {
  return {
    readiness:Math.round((input.readinessIndex/10)*10)/10,
    execution:Math.round(clamp(input.gameQuality)*10)/10,
    discipline:Math.round(clamp(input.foldDiscipline)*10)/10,
    emotionalControl:Math.round(((clamp(input.attitude)+clamp(input.logic)+clamp(input.patience))/3)*10)/10,
  };
}

export function buildDevelopmentSnapshot(sessions:SessionRecord[]) {
  const avg=(values:number[])=>values.length?Math.round((values.reduce((a,b)=>a+b,0)/values.length)*10)/10:0;
  const consistency=(values:number[])=>{
    if(values.length<3) return 0;
    const mean=values.reduce((a,b)=>a+b,0)/values.length;
    const sd=Math.sqrt(values.reduce((sum,value)=>sum+Math.pow(value-mean,2),0)/values.length);
    return Math.round(clamp(10-sd)*10)/10;
  };
  return {
    discipline:avg(sessions.map(s=>s.debrief.foldDiscipline)),
    focus:avg(sessions.map(s=>s.pre.mentalDrive)),
    consistency:consistency(sessions.map(s=>s.debrief.gameQuality)),
    resilience:avg(sessions.map(s=>s.debrief.resilience??0)),
    attitude:avg(sessions.map(s=>s.debrief.attitude)),
    decisionConfidence:avg(sessions.map(s=>s.debrief.decisionConfidence)),
    patience:avg(sessions.map(s=>s.debrief.patience)),
    gameUnderstanding:avg(sessions.map(s=>s.debrief.gameUnderstanding)),
    cordiality:avg(sessions.map(s=>s.debrief.professionalConduct)),
    logic:avg(sessions.map(s=>s.debrief.logic)),
    lifestyle:avg(sessions.map(s=>(
      (s.pre.sleep+(s.pre.nutrition??5)+(s.pre.hydration??5)+(s.pre.physicalActivity??5))/4
    ))),
  };
}


export type HeatmapIntensity='low'|'moderate'|'high'|'critical';
export type HeatmapWindowId='0-45'|'45-90'|'90-135'|'135-180'|'180-plus';

export function buildHeatmap(sessions:SessionRecord[]) {
  const windows:{id:HeatmapWindowId;from:number;to:number}[]=[
    {id:'0-45',from:0,to:45},{id:'45-90',from:45,to:90},{id:'90-135',from:90,to:135},
    {id:'135-180',from:135,to:180},{id:'180-plus',from:180,to:Number.POSITIVE_INFINITY},
  ];
  const checkins=sessions.flatMap(s=>s.checkins);
  return windows.map(window=>{
    const items=checkins.filter(x=>x.minute>=window.from&&x.minute<window.to);
    const severity=items.length?items.reduce((sum,x)=>sum+((10-x.focus)+x.tension+x.impulse+x.fatigue)/4,0)/items.length:0;
    const intensity:HeatmapIntensity=severity>=7.5?'critical':severity>=5.5?'high':severity>=3.5?'moderate':'low';
    const counts=new Map<TiltTrigger,number>();
    for(const item of items) if(item.trigger) counts.set(item.trigger,(counts.get(item.trigger)??0)+1);
    const triggers=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,2).map(([trigger])=>trigger);
    return {id:window.id,count:items.length,intensity,triggers};
  });
}


export const HUMAN_PILLARS=['temperament','extraGrind','sensations','feeling','emotion','reasoning','behavior'] as const;
export type TiltPattern='loss-tilt'|'winner-tilt'|'fatigue-tilt'|'ego-tilt';
export const minimumBaselineSessions=5;
export function getEvidenceState(sessionCount:number){
  const confidence=getBaselineConfidence(sessionCount);
  return {confidence,status:sessionCount<minimumBaselineSessions?'insufficient' as const:'usable' as const};
}

import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { decisionCues, processGoals, warRoomTriggers, type ProcessGoalId, type WarRoomTriggerId } from '../content';
import { AppText, AppTextInput, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { FlowProgress } from '../components/FlowProgress';
import {
  calculateMentalEv,
  calculateReadiness,
  classifyTiltRisk,
  deriveMentalState,
  deriveExecutionQuality,
  compareEventsWithPhysiology,
  getRitualMinutes,
  getSessionAction,
  getRecoveryPlan,
  mentalEvComponents,
  type Emotion,
  type ExecutionQuality,
  type GameMode,
  type PlayReason,
  type PreGrindCheckin,
  type RecoveryPlan,
  type SessionAction,
  type TiltRisk,
  type LiveEventType,
} from '../performanceEngine';
import { usePerformance } from '../performanceStore';
import { buildPerformanceCare } from '../performanceCare';
import { s } from '../styles';
import { Module, Phase } from '../types';
import { useI18n, type Locale, type TranslationKey } from '../i18n';

const scoreValues=[0,1,2,3,4,5,6,7,8,9,10];
const scoreValuesOne=[1,2,3,4,5,6,7,8,9,10];
const emotions:{id:Emotion;key:TranslationKey}[]=[
  {id:'calm',key:'emotion.calm'},{id:'fear',key:'emotion.fear'},{id:'anger',key:'emotion.anger'},
  {id:'frustration',key:'emotion.frustration'},{id:'greed',key:'emotion.greed'},
  {id:'euphoria',key:'emotion.euphoria'},{id:'anxiety',key:'emotion.anxiety'},
];
const reasons:{id:PlayReason;key:TranslationKey}[]=[
  {id:'planned',key:'reason.planned'},{id:'important',key:'reason.important'},{id:'study',key:'reason.study'},
  {id:'recover-loss',key:'reason.recover-loss'},{id:'boredom',key:'reason.boredom'},
  {id:'fomo',key:'reason.fomo'},{id:'ego',key:'reason.ego'},
];
const reframeKey:Record<Emotion,TranslationKey>={
  calm:'pregrind.reframe.calm',fear:'pregrind.reframe.fear',anger:'pregrind.reframe.anger',
  frustration:'pregrind.reframe.frustration',greed:'pregrind.reframe.greed',
  euphoria:'pregrind.reframe.euphoria',anxiety:'pregrind.reframe.anxiety',
};
const riskKey:Record<TiltRisk,TranslationKey>={low:'risk.low',medium:'risk.medium',critical:'risk.critical'};
const actionKey:Record<SessionAction,TranslationKey>={
  continue:'action.continue','check-in':'action.check-in','break-4':'action.break-4',
  contain:'action.contain','stop-session':'action.stop-session',
};

const recoverySpeechLanguage:Record<Locale,string>={
  pt:'pt-BR',
  en:'en-US',
  es:'es-ES',
};

function Score10({label,value,setValue,oneToTen=false}:{label:string;value:number;setValue:(v:number)=>void;oneToTen?:boolean}) {
  const values=oneToTen?scoreValuesOne:scoreValues;
  return <View style={s.scaleBlock}>
    <View style={s.rowBetween}><Label>{label}</Label><AppText style={s.goldText}>{value}/10</AppText></View>
    <View style={s.scoreGrid}>{values.map(n=><TouchableOpacity key={n} onPress={()=>setValue(n)} style={[s.scoreCell,value===n&&s.chipActive]}>
      <AppText style={[s.chipText,value===n&&s.chipTextActive]}>{n}</AppText>
    </TouchableOpacity>)}</View>
  </View>;
}

function ChoiceGrid<T extends string>({items,value,onChange}:{items:{id:T;label:string}[];value:T;onChange:(v:T)=>void}) {
  return <View style={s.processGrid}>{items.map(item=><TouchableOpacity key={item.id} onPress={()=>onChange(item.id)} style={[s.processChip,value===item.id&&s.chipActive]}>
    <AppText style={[s.chipText,value===item.id&&s.chipTextActive]}>{item.label}</AppText>
  </TouchableOpacity>)}</View>;
}

function Ready({ onStart,openAudio,openReset }: { onStart:()=>void;openAudio:()=>void;openReset:()=>void }) {
  const { t } = useI18n();
  const { profile,startSession,updateExtraGrind,updateLifestyle,dailyWellbeing,updateDailyWellbeing }=usePerformance();
  const [wizardStep,setWizardStep]=useState(0);
  const [tension,setTension]=useState(3);
  const [fatigue,setFatigue]=useState(3);
  const [sleep,setSleep]=useState(profile.extraGrind.sleep);
  const [nutrition,setNutrition]=useState(profile.extraGrind.nutrition);
  const [hydration,setHydration]=useState(profile.extraGrind.hydration);
  const [physicalActivity,setPhysicalActivity]=useState(profile.extraGrind.physicalActivity);
  const [energy,setEnergy]=useState(6);
  const [mentalDrive,setMentalDrive]=useState(6);
  const [emotion,setEmotion]=useState<Emotion>('calm');
  const [reason,setReason]=useState<PlayReason>('planned');
  const [mode,setMode]=useState<GameMode>('tournament');
  const [goal,setGoal]=useState<ProcessGoalId>('process');
  const [expectedMinutes,setExpectedMinutes]=useState(Math.min(120,profile.stopRules.maxDurationMinutes));
  const [stakesLabel,setStakesLabel]=useState('');
  const [planExpanded,setPlanExpanded]=useState(false);
  const [activationUsed,setActivationUsed]=useState(false);
  const today=new Date().toISOString().slice(0,10);
  const wellbeing=dailyWellbeing.find(x=>x.date===today);
  const [personalContext,setPersonalContext]=useState(wellbeing?.personalImpact??'');
  const [professionalContext,setProfessionalContext]=useState(wellbeing?.professionalImpact??'');
  const [feelingContext,setFeelingContext]=useState(wellbeing?.feeling??'');

  const impulse=reason==='recover-loss'||reason==='ego'||reason==='fomo'?8:emotion==='anger'||emotion==='euphoria'?7:3;
  const pre:PreGrindCheckin={
    createdAt:Date.now(),
    sleep,personalStress:profile.extraGrind.personalStress,financialStress:profile.extraGrind.financialStress,
    tension,fatigue,energy,mentalDrive,nutrition,hydration,physicalActivity,emotion,reason,impulse,
  };
  const readinessIndex=calculateReadiness(pre);
  const tiltRisk=classifyTiltRisk(pre);
  const ritual=getRitualMinutes(readinessIndex,tiltRisk);
  const canLeave=mode==='cash';
  const durationOptions=[60,90,120,180].filter(value=>value<=profile.stopRules.maxDurationMinutes);

  const next=()=>{if(wizardStep===0)updateDailyWellbeing({feeling:feelingContext,personalImpact:personalContext,professionalImpact:professionalContext});setWizardStep(v=>Math.min(7,v+1));};
  const back=()=>setWizardStep(v=>Math.max(0,v-1));
  const begin=()=>{
    updateDailyWellbeing({feeling:feelingContext,personalImpact:personalContext,professionalImpact:professionalContext});
    updateExtraGrind({sleep,nutrition,hydration,physicalActivity});
    updateLifestyle({sleepQuality:sleep,hydration,mealQuality:nutrition,movementMinutes:Math.max(profile.lifestyle.movementMinutes,physicalActivity*6)});
    startSession(pre,{
      mode,canLeave,expectedMinutes,
      maxReentries:profile.stopRules.maxReentries,processGoal:goal,stakesLabel:stakesLabel.trim()||undefined,
    });
    onStart();
  };

  const titles:TranslationKey[]=[
    'care.human.title','pregrind.sensations','pregrind.lifestyle','pregrind.feeling','pregrind.emotion','pregrind.reason','pregrind.reframe','pregrind.activation',
  ];
  const bodies:TranslationKey[]=[
    'care.human.response','pregrind.sensationsBody','pregrind.lifestyleBody','pregrind.feelingBody','pregrind.emotionBody','pregrind.reasonBody','pregrind.reframeBody','pregrind.activationBody',
  ];

  return <ScrollView contentContainerStyle={s.scroll}>
    <FlowProgress current={wizardStep+1} total={8} label={t('pregrind.title')}/>
    <View style={s.lead}><Label>{t('pregrind.title')}</Label><Serif style={s.leadTitle}>{t(titles[wizardStep]).toUpperCase()}</Serif><AppText style={s.body}>{t(bodies[wizardStep])}</AppText></View>

    {wizardStep===0?<View style={s.panel}><Serif style={s.actionTitle}>{t('care.human.feeling')}</Serif><AppTextInput value={feelingContext} onChangeText={setFeelingContext} multiline placeholder={t('care.human.feelingPlaceholder')} placeholderTextColor={C.dim} style={s.diaryInput}/><Serif style={s.actionTitle}>{t('care.human.personal')}</Serif><AppTextInput value={personalContext} onChangeText={setPersonalContext} multiline placeholder={t('care.human.personalPlaceholder')} placeholderTextColor={C.dim} style={s.diaryInput}/><Serif style={s.actionTitle}>{t('care.human.professional')}</Serif><AppTextInput value={professionalContext} onChangeText={setProfessionalContext} multiline placeholder={t('care.human.professionalPlaceholder')} placeholderTextColor={C.dim} style={s.diaryInput}/><AppText style={s.body}>{t('care.human.response')}</AppText></View>:null}

    {wizardStep===1?<View style={s.panel}>
      <Score10 label={t('pregrind.tension')} value={tension} setValue={setTension}/>
      <Score10 label={t('pregrind.fatigue')} value={fatigue} setValue={setFatigue}/>
    </View>:null}

    {wizardStep===2?<View style={s.panel}>
      <Score10 label={t('pregrind.sleep')} value={sleep} setValue={setSleep}/>
      <Score10 label={t('pregrind.nutrition')} value={nutrition} setValue={setNutrition}/>
      <Score10 label={t('pregrind.hydration')} value={hydration} setValue={setHydration}/>
      <Score10 label={t('pregrind.activity')} value={physicalActivity} setValue={setPhysicalActivity}/>
      <View style={s.guidedBlock}><Label>{t('care.title')}</Label><AppText style={s.body}>{t('care.body')}</AppText></View>
      <View style={s.guidedBlock}><Label>{t('evidence.title')}</Label><AppText style={s.body}>{t('evidence.body')}</AppText></View>
    </View>:null}

    {wizardStep===3?<View style={s.panel}>
      <Score10 label={t('pregrind.energy')} value={energy} setValue={setEnergy}/>
      <Score10 label={t('pregrind.mentalDrive')} value={mentalDrive} setValue={setMentalDrive}/>
    </View>:null}

    {wizardStep===4?<View style={s.panel}>
      <ChoiceGrid items={emotions.map(x=>({id:x.id,label:t(x.key)}))} value={emotion} onChange={setEmotion}/>
    </View>:null}

    {wizardStep===5?<>
      <View style={s.panel}>
        <Label>{t('pregrind.reason')}</Label>
        <ChoiceGrid items={reasons.map(x=>({id:x.id,label:t(x.key)}))} value={reason} onChange={setReason}/>
      </View>
      <View style={s.panel}>
        <Label>{t('pregrind.mode')}</Label>
        <ChoiceGrid items={[{id:'cash' as GameMode,label:t('mode.cash')},{id:'tournament' as GameMode,label:t('mode.tournament')}]} value={mode} onChange={setMode}/>
        <AppText style={s.body}>{t(mode==='cash'?'pregrind.cashRule':'pregrind.tournamentRule')}</AppText>
      </View>
    </>:null}

    {wizardStep===6?<>
      <View style={s.readingCard}>
        <Label>{t('pregrind.readiness')}</Label><Serif style={s.heroNumber}>{readinessIndex}</Serif>
        <View style={s.rowBetween}><Label>{t('pregrind.tiltRisk')}</Label><AppText style={s.goldText}>{t(riskKey[tiltRisk])}</AppText></View>
        <View style={s.rule}/>
        <Label>{t('pregrind.ritual')}</Label>
        <Serif style={s.actionTitle}>{t(ritual===3?'pregrind.ritual3':ritual===7?'pregrind.ritual7':'pregrind.ritual12')}</Serif>
        <AppText style={s.body}>{t(reframeKey[emotion])}</AppText>
      </View>
      <View style={s.panel}>
        <Label>{t('session.processGoal')}</Label>
        <ChoiceGrid items={processGoals.map(x=>({id:x.id,label:t(x.labelKey)}))} value={goal} onChange={setGoal}/>
        <Label>{t('pregrind.sessionLimits')}</Label>
        <AppText style={s.body}>{t('pregrind.sessionLimitsBody')}</AppText>
        <View style={s.rowBetween}>
          <View><Label>{t('profile.maxDuration')}</Label><AppText style={s.body}>{profile.stopRules.maxDurationMinutes}</AppText></View>
          <View><Label>{t('profile.maxReentries')}</Label><AppText style={s.body}>{profile.stopRules.maxReentries}</AppText></View>
        </View>
        <AppText style={s.body}>{t('pregrind.sessionLimitsConsequence')}</AppText>
        <TouchableOpacity style={s.coachContextToggle} onPress={()=>setPlanExpanded(v=>!v)}>
          <AppText style={s.coachContextToggleText}>{t(planExpanded?'pregrind.hidePlanDetails':'pregrind.planDetails')}</AppText>
          <Ionicons name={planExpanded?'chevron-up':'chevron-down'} size={18} color={C.goldLight}/>
        </TouchableOpacity>
        {planExpanded?<View style={s.contextList}>
          <Label>{t('pregrind.expectedDurationQuestion')}</Label>
          <AppText style={s.body}>{t('pregrind.expectedDurationHelp')}</AppText>
          <ChoiceGrid items={durationOptions.map(value=>({id:String(value),label:String(value)}))} value={String(expectedMinutes)} onChange={value=>setExpectedMinutes(Number(value))}/>
          <Label>{t('pregrind.stakes')}</Label>
          <AppTextInput
            value={stakesLabel}
            onChangeText={setStakesLabel}
            placeholder={t('pregrind.stakesPlaceholder')}
            placeholderTextColor={C.dim}
            style={s.planInput}
          />
        </View>:null}
      </View>
    </>:null}

    {wizardStep===7?<View style={s.panel}>
      <Label>{t('pregrind.ritual')}</Label>
      <Serif style={s.actionTitle}>{t(ritual===3?'pregrind.ritual3':ritual===7?'pregrind.ritual7':'pregrind.ritual12')}</Serif>
      <AppText style={s.body}>{t('pregrind.activationBody')}</AppText>
      <PremiumButton label={t('pregrind.openAudio')} secondary icon="headset-outline" onPress={()=>{setActivationUsed(true);openAudio();}}/>
      <PremiumButton label={t('pregrind.openBreathing')} secondary icon="pulse-outline" onPress={()=>{setActivationUsed(true);openReset();}}/>
    </View>:null}

    <View style={s.wizardActions}>
      {wizardStep>0?<PremiumButton label={t('pregrind.back')} secondary onPress={back}/>:<View style={s.flex}/>}
      <PremiumButton
        label={wizardStep===7?t('pregrind.activationComplete'):t('pregrind.next')}
        disabled={wizardStep===7&&!activationUsed}
        onPress={wizardStep===7?begin:next}
      />
    </View>
  </ScrollView>;
}

function formatElapsed(ms:number){
  const total=Math.max(0,Math.floor(ms/1000));
  const h=Math.floor(total/3600).toString().padStart(2,'0');
  const m=Math.floor((total%3600)/60).toString().padStart(2,'0');
  const s=(total%60).toString().padStart(2,'0');
  return h+':'+m+':'+s;
}

function Active({ endSession, openAudio, openBreak, openCheckin }: { endSession:()=>void; openAudio:()=>void; openBreak:()=>void; openCheckin:()=>void }) {
  const { t } = useI18n();
  const { activeSession,profile,addLiveEvent,addPhysiologySample }=usePerformance();
  const [journalOpen,setJournalOpen]=useState(false);
  const [eventAmount,setEventAmount]=useState('');
  const [eventNote,setEventNote]=useState('');
  const [heartRate,setHeartRate]=useState('');
  const [systolic,setSystolic]=useState('');
  const [diastolic,setDiastolic]=useState('');
  const [cue,setCue]=useState(0);
  const [now,setNow]=useState(Date.now());

  useEffect(()=>{
    const id=setInterval(()=>setNow(Date.now()),1000);
    return()=>clearInterval(id);
  },[]);

  if(!activeSession)return <ScrollView contentContainerStyle={s.scroll}><PremiumButton label={t('home.checkinNow')} onPress={endSession}/></ScrollView>;

  const last=activeSession.checkins[activeSession.checkins.length-1];
  const focus=last?.focus??activeSession.pre.mentalDrive;
  const tension=last?.tension??activeSession.pre.tension;
  const impulse=last?.impulse??activeSession.pre.impulse;
  const fatigue=last?.fatigue??activeSession.pre.fatigue;
  const tiltRisk=classifyTiltRisk({tension,fatigue,impulse,emotion:activeSession.pre.emotion});
  const minutes=Math.floor((now-activeSession.startedAt)/60000);
  const durationExceeded=minutes>=profile.stopRules.maxDurationMinutes;
  let action=getSessionAction({
    mode:activeSession.plan.mode,canLeave:activeSession.plan.canLeave,tiltRisk,fatigue,
    focus,tension,minFocus:profile.stopRules.minFocus,maxTension:profile.stopRules.maxTension,
  });
  if(durationExceeded) action=activeSession.plan.mode==='tournament'&&!activeSession.plan.canLeave?'contain':'stop-session';
  const decisionLock=action==='contain'||action==='stop-session';
  const reentryLimitReached=activeSession.reentriesUsed>=activeSession.plan.maxReentries;
  const readiness=calculateReadiness(activeSession.pre);
  const mentalState=deriveMentalState({readinessIndex:readiness,tiltRisk,sessionMinutes:minutes,focus,tension,impulse,fatigue});
  const executionQuality=deriveExecutionQuality({focus,tension,impulse,fatigue});
  const sessionCare=buildPerformanceCare({...profile.lifestyle,sittingHours:profile.lifestyle.sittingHours+minutes/60});
  const carePriority=sessionCare.find(item=>item.priority!=='ready')??sessionCare[0];
  const eventPhysiology=compareEventsWithPhysiology(activeSession.liveEvents,activeSession.physiology);

  return <ScrollView contentContainerStyle={s.scroll}>
    <FlowProgress current={2} total={4} label={t('session.activeStage')}/>
    <View style={s.sessionFocusCard}>
      <View style={s.rowBetween}><Label>{t('session.elapsed')}</Label><Label>{t(activeSession.plan.mode==='cash'?'mode.cash':'mode.tournament')}</Label></View>
      <Serif style={s.clock}>{formatElapsed(now-activeSession.startedAt)}</Serif>
      <View style={s.rowBetween}><Label>{t('home.mentalState')}</Label><AppText style={s.goldText}>{t(({
        centered:'mentalState.centered',alert:'mentalState.alert',vulnerable:'mentalState.vulnerable',dysregulated:'mentalState.dysregulated',tilt:'mentalState.tilt',
      } as const)[mentalState])}</AppText></View>
    </View>

    {!decisionLock?<><View style={s.panel}><Label>{t('session.executionQuality')}</Label><Serif style={s.gameState}>{t(({'strong':'execution.strong','stable':'execution.stable','oscillating':'execution.oscillating','compromised':'execution.compromised'} as const)[executionQuality])}</Serif><AppText style={s.body}>{t('session.executionQualityBody')}</AppText></View>

    <TouchableOpacity style={s.cueBlock} onPress={()=>setCue((cue+1)%decisionCues.length)}><Label>{t('session.tapCue')}</Label><Serif style={s.cueText}>“{t(decisionCues[cue])}”</Serif></TouchableOpacity></>:null}

    {decisionLock?<View style={s.guidedBlock}>
      <Label>{t('coachJourney.interrupt')}</Label>
      <Serif style={s.actionTitle}>{t('coachJourney.eventPassed')}</Serif>
      <AppText style={s.body}>{t('coachJourney.eventPassedBody')}</AppText>
      <View style={s.rule}/>
      <Label>{t('coachJourney.anchor')}</Label>
      <AppText style={s.body}>{t('coachJourney.noRecoveryBody')}</AppText>
    </View>:null}

    <View style={s.readingCard}>
      <Label>{t('session.currentAction')}</Label>
      <Serif style={s.actionTitle}>{t(actionKey[action])}</Serif>
      <AppText style={s.body}>{t('session.protectTempoBody')}</AppText>
    </View>

    <View style={s.panel}>
      <Label>{t('care.title')}</Label>
      <Serif style={s.actionTitle}>{t(`care.action.${carePriority.priority}.title` as TranslationKey)}</Serif>
      <AppText style={s.body}>{t(`care.action.${carePriority.priority}.body` as TranslationKey)}</AppText>
      {minutes>=60?<PremiumButton label={t('session.break4')} secondary onPress={openBreak} icon="walk-outline"/>:null}
    </View>

    <View style={s.panel}>
      <View style={s.rowBetween}><View style={s.flex}><Label>{t('liveJournal.title')}</Label><AppText style={s.body}>{t('liveJournal.body')}</AppText></View><AppText style={s.goldText}>{activeSession.liveEvents.length}</AppText></View>
      <PremiumButton label={journalOpen?t('common.close'):t('liveJournal.open')} secondary onPress={()=>setJournalOpen(v=>!v)} icon="flash-outline"/>
      {journalOpen?<View style={s.guidedBlock}>
        <View style={s.processGrid}>{([
          'rebuy','lost-hand','bad-beat','mistake-loss','fear-fold','good-fold','good-decision-loss','impulsive-play','distraction','fatigue','other'
        ] as LiveEventType[]).map(type=><TouchableOpacity key={type} style={s.processChip} onPress={()=>{addLiveEvent(type,type==='rebuy'?(Number(eventAmount.replace(',','.'))||undefined):undefined,eventNote);setEventAmount('');setEventNote('');}}><AppText style={s.chipText}>{t(`liveJournal.${type}` as TranslationKey)}</AppText></TouchableOpacity>)}</View>
        <AppTextInput value={eventAmount} onChangeText={setEventAmount} keyboardType="numeric" placeholder={t('liveJournal.amountOptional')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={eventNote} onChangeText={setEventNote} placeholder={t('liveJournal.noteOptional')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppText style={s.body}>{t('liveJournal.tapHelp')}</AppText>
      </View>:null}
      {activeSession.plan.mode==='tournament'?<>
        <View style={s.rowBetween}><Label>{t('session.reentriesUsed')}</Label><AppText style={s.goldText}>{activeSession.reentriesUsed} / {activeSession.plan.maxReentries}</AppText></View>
        <PremiumButton label={reentryLimitReached?t('debrief.reentryLimitReached'):t('session.registerReentry')} secondary disabled={reentryLimitReached} onPress={()=>addLiveEvent('rebuy',Number(eventAmount.replace(',','.'))||undefined,eventNote)}/>
      </>:null}
    </View>

    <View style={s.panel}>
      <Label>{t('physiology.title')}</Label>
      <AppText style={s.body}>{t('physiology.notConnected')}</AppText>
      <View style={s.rowBetween}><AppText style={s.body}>{t('physiology.samples')}</AppText><AppText style={s.goldText}>{activeSession.physiology.length}</AppText></View>
      <View style={s.processGrid}>
        <AppTextInput value={heartRate} onChangeText={setHeartRate} keyboardType="numeric" placeholder={t('physiology.heartRate')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={systolic} onChangeText={setSystolic} keyboardType="numeric" placeholder={t('physiology.systolic')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={diastolic} onChangeText={setDiastolic} keyboardType="numeric" placeholder={t('physiology.diastolic')} placeholderTextColor={C.dim} style={s.diaryInput}/>
      </View>
      <PremiumButton label={t('physiology.record')} secondary onPress={()=>{addPhysiologySample('during',Number(heartRate)||undefined,Number(systolic)||undefined,Number(diastolic)||undefined);setHeartRate('');setSystolic('');setDiastolic('');}}/>
      <AppText style={s.body}>{t('physiology.boundary')}</AppText>
      {eventPhysiology.slice(-3).reverse().map(x=><View key={x.event.id} style={s.guidedBlock}><Label>{t(`liveJournal.${x.event.type}` as TranslationKey)} · {x.event.minute} {t('common.minutesShort')}</Label><AppText style={s.body}>{x.beforeHeartRate===null||x.peakAfterHeartRate===null?t('physiology.awaitingSamples'):`${t('physiology.before')} ${x.beforeHeartRate} bpm · ${t('physiology.peakAfter')} ${x.peakAfterHeartRate} bpm · Δ ${x.deltaHeartRate??0} bpm`}</AppText></View>)}
    </View>

    <View style={s.twoCols}>
      <PremiumButton label={t('session.realCheckin')} secondary onPress={openCheckin} icon="pulse-outline"/>
      <PremiumButton label={t('session.break4')} secondary onPress={openBreak} icon="pause-outline"/>
    </View>
    {!decisionLock?<TouchableOpacity style={s.audioBar} onPress={openAudio}><View style={s.flex}><Label>{t('session.mentalPlaylist')}</Label><AppText style={s.body}>{t('session.noAudioProgress')}</AppText></View></TouchableOpacity>:null}
    <PremiumButton label={t('session.end')} secondary onPress={endSession} icon="stop-circle-outline"/>
  </ScrollView>;
}

function Debrief({ save }: { save:()=>void }) {
  const { t } = useI18n();
  const { activeSession,finishSession }=usePerformance();
  const [debriefStep,setDebriefStep]=useState(0);
  const [buyIns,setBuyIns]=useState('');
  const [reentriesCost,setReentriesCost]=useState('');
  const [otherCosts,setOtherCosts]=useState('');
  const [received,setReceived]=useState('');
  const [resultHidden,setResultHidden]=useState(false);
  const [gameQuality,setGameQuality]=useState(6);
  const [foldDiscipline,setFoldDiscipline]=useState(6);
  const [patience,setPatience]=useState(6);
  const [decisionConfidence,setDecisionConfidence]=useState(6);
  const [professionalConduct,setProfessionalConduct]=useState(7);
  const [attitude,setAttitude]=useState(6);
  const [resilience,setResilience]=useState(6);
  const [gameUnderstanding,setGameUnderstanding]=useState(6);
  const [logic,setLogic]=useState(6);
  const [executionQuality,setExecutionQuality]=useState<ExecutionQuality>('stable');
  const [triggers,setTriggers]=useState<WarRoomTriggerId[]>([]);
  const [busted,setBusted]=useState(false);
  const [reentryDecision,setReentryDecision]=useState<'none'|'stop'|'reenter'>('none');

  const readinessIndex=activeSession?calculateReadiness(activeSession.pre):0;
  const reentryLimitReached=activeSession?activeSession.reentriesUsed>=activeSession.plan.maxReentries:true;
  const reentryDecisionRequired=Boolean(activeSession?.plan.mode==='tournament'&&busted&&!reentryLimitReached&&reentryDecision==='none');
  const actualDurationMinutes=activeSession?Math.max(0,Math.floor((Date.now()-activeSession.startedAt)/60000)):0;
  const plannedGoal=processGoals.find(item=>item.id===activeSession?.plan.processGoal);
  const mentalEv=calculateMentalEv({gameQuality,foldDiscipline,readinessIndex});
  const evComponents=mentalEvComponents({gameQuality,foldDiscipline,readinessIndex,attitude,logic,patience});
  const toggle=(id:WarRoomTriggerId)=>setTriggers(v=>v.includes(id)?v.filter(t=>t!==id):[...v,id]);

  const money=(value:string)=>Number(value.replace(',','.'))||0;
  const netResult=money(received)-money(buyIns)-money(reentriesCost)-money(otherCosts);
  const persist=()=>{
    finishSession({
      financialResult:resultHidden?null:netResult,
      finance:resultHidden?undefined:{currency:'BRL',buyIns:money(buyIns),reentriesCost:money(reentriesCost),otherCosts:money(otherCosts),received:money(received),netResult},
      resultHidden,gameQuality,foldDiscipline,patience,decisionConfidence,professionalConduct,
      attitude,resilience,gameUnderstanding,logic,endMentalState:activeSession?.checkins[activeSession.checkins.length-1]?.mentalState??'centered',endExecutionQuality:executionQuality,triggers,busted,
      reentryDecision:busted&&reentryLimitReached?'stop':reentryDecision,
    });
    save();
  };

  const next=()=>setDebriefStep(v=>Math.min(4,v+1));
  const back=()=>setDebriefStep(v=>Math.max(0,v-1));

  return <ScrollView contentContainerStyle={s.scroll}>
    <FlowProgress current={debriefStep+1} total={5} label={t('session.postSession')}/>
    {debriefStep===0?<View style={s.guidedBlock}>
      <Label>{t('coachJourney.accept')}</Label>
      <Serif style={s.actionTitle}>{t('coachJourney.sessionClose')}</Serif>
      <AppText style={s.body}>{t('coachJourney.sessionCloseBody')}</AppText>
    </View>:null}

    {debriefStep===0?<View style={s.panel}>
      <Label>{t('debrief.financial')}</Label>
      <AppText style={s.body}>{t('debrief.resultBody')}</AppText>
      <TouchableOpacity style={[s.option,resultHidden&&s.optionActive]} onPress={()=>setResultHidden(v=>!v)}><AppText style={[s.optionText,resultHidden&&s.optionTextActive]}>{t('debrief.hideResult')}</AppText></TouchableOpacity>
      {!resultHidden?<View style={s.guidedBlock}>
        <AppTextInput value={buyIns} onChangeText={setBuyIns} keyboardType="numeric" placeholder={t('debrief.buyIns')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={reentriesCost} onChangeText={setReentriesCost} keyboardType="numeric" placeholder={t('debrief.reentriesCost')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={otherCosts} onChangeText={setOtherCosts} keyboardType="numeric" placeholder={t('debrief.otherCosts')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <AppTextInput value={received} onChangeText={setReceived} keyboardType="numeric" placeholder={t('debrief.received')} placeholderTextColor={C.dim} style={s.diaryInput}/>
        <View style={s.rowBetween}><Label>{t('debrief.netResult')}</Label><AppText style={s.goldText}>{t('finance.currency')} {netResult.toFixed(2)}</AppText></View>
        <AppText style={s.body}>{t('debrief.resultSeparation')}</AppText>
      </View>:null}
    </View>:null}

    {debriefStep===1?<View style={s.panel}>
      <Label>{t('debrief.execution')}</Label>
      <Score10 oneToTen label={t('debrief.gameQuality')} value={gameQuality} setValue={setGameQuality}/>
      <Score10 oneToTen label={t('debrief.foldDiscipline')} value={foldDiscipline} setValue={setFoldDiscipline}/>
      <Score10 oneToTen label={t('debrief.patience')} value={patience} setValue={setPatience}/>
      <View style={s.guidedBlock}><Label>{t('session.howEnded')}</Label><AppText style={s.body}>{t('session.executionReflection')}</AppText><ChoiceGrid items={(['strong','stable','oscillating','compromised'] as ExecutionQuality[]).map(id=>({id,label:t(({'strong':'execution.strong','stable':'execution.stable','oscillating':'execution.oscillating','compromised':'execution.compromised'} as const)[id])}))} value={executionQuality} onChange={setExecutionQuality}/></View>
    </View>:null}

    {debriefStep===2?<View style={s.panel}>
      <Label>{t('profile.development')}</Label>
      <Score10 oneToTen label={t('debrief.decisionConfidence')} value={decisionConfidence} setValue={setDecisionConfidence}/>
      <Score10 oneToTen label={t('debrief.professionalConduct')} value={professionalConduct} setValue={setProfessionalConduct}/>
      <Score10 oneToTen label={t('debrief.attitude')} value={attitude} setValue={setAttitude}/>
      <Score10 oneToTen label={t('debrief.resilience')} value={resilience} setValue={setResilience}/>
      <Score10 oneToTen label={t('debrief.gameUnderstanding')} value={gameUnderstanding} setValue={setGameUnderstanding}/>
      <Score10 oneToTen label={t('debrief.logic')} value={logic} setValue={setLogic}/>
    </View>:null}

    {debriefStep===3?<>
      <View style={s.panel}><Label>{t('session.triggers')}</Label><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity key={x.id} onPress={()=>toggle(x.id)} style={[s.chip,triggers.includes(x.id)&&s.chipActive]}><AppText style={[s.chipText,triggers.includes(x.id)&&s.chipTextActive]}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View></View>
      {activeSession?.plan.mode==='tournament'?<View style={s.panel}>
        <TouchableOpacity style={[s.option,busted&&s.optionActive]} onPress={()=>setBusted(v=>!v)}><AppText style={[s.optionText,busted&&s.optionTextActive]}>{t('debrief.busted')}</AppText></TouchableOpacity>
        {busted?<View style={s.guidedBlock}>
          <Label>{t('debrief.reentry')}</Label>
          {reentryLimitReached?<AppText style={s.body}>{t('debrief.reentryLimitBody')}</AppText>:null}
          <View style={s.twoCols}>
            <PremiumButton label={t('debrief.stop')} secondary onPress={()=>setReentryDecision('stop')}/>
            <PremiumButton label={t('debrief.reenter')} secondary disabled={reentryLimitReached} onPress={()=>setReentryDecision('reenter')}/>
          </View>
        </View>:null}
      </View>:null}
    </>:null}

    {debriefStep===4?<>
      <View style={s.readingCard}><Label>{t('debrief.mentalEv')}</Label><Serif style={s.heroNumber}>{mentalEv.toFixed(1)}</Serif><AppText style={s.body}>{t('debrief.mentalEvBody')}</AppText></View>
      <View style={s.panel}>
        <View style={s.rowBetween}><Label>{t('debrief.readinessComponent')}</Label><AppText style={s.goldText}>{evComponents.readiness.toFixed(1)}</AppText></View>
        <View style={s.rowBetween}><Label>{t('debrief.executionComponent')}</Label><AppText style={s.goldText}>{evComponents.execution.toFixed(1)}</AppText></View>
        <View style={s.rowBetween}><Label>{t('debrief.disciplineComponent')}</Label><AppText style={s.goldText}>{evComponents.discipline.toFixed(1)}</AppText></View>
        <View style={s.rowBetween}><Label>{t('debrief.emotionalComponent')}</Label><AppText style={s.goldText}>{evComponents.emotionalControl.toFixed(1)}</AppText></View>
      </View>
      {activeSession?<View style={s.panel}>
        <Label>{t('debrief.planVsExecution')}</Label>
        <View style={s.rowBetween}><AppText style={s.body}>{t('debrief.plannedGoal')}</AppText><AppText style={s.goldText}>{plannedGoal?t(plannedGoal.labelKey):'—'}</AppText></View>
        <View style={s.rowBetween}><AppText style={s.body}>{t('debrief.plannedLimit')}</AppText><AppText style={s.goldText}>{activeSession.plan.expectedMinutes}</AppText></View>
        <View style={s.rowBetween}><AppText style={s.body}>{t('debrief.actualDuration')}</AppText><AppText style={s.goldText}>{actualDurationMinutes}</AppText></View>
        {activeSession.plan.stakesLabel?<View style={s.rowBetween}><AppText style={s.body}>{t('debrief.plannedStakes')}</AppText><AppText style={s.goldText}>{activeSession.plan.stakesLabel}</AppText></View>:null}
        {activeSession.plan.mode==='tournament'?<View style={s.rowBetween}><AppText style={s.body}>{t('session.reentriesUsed')}</AppText><AppText style={s.goldText}>{activeSession.reentriesUsed} / {activeSession.plan.maxReentries}</AppText></View>:null}
      </View>:null}
      <View style={s.panel}><Label>{t('debrief.resultVsExecution')}</Label><AppText style={s.body}>{t('debrief.resultBody')}</AppText></View>
    </>:null}

    <View style={s.wizardActions}>
      {debriefStep>0?<PremiumButton label={t('pregrind.back')} secondary onPress={back}/>:<View style={s.flex}/>}
      <PremiumButton
        label={debriefStep===4?t('debrief.disconnect'):t('pregrind.next')}
        disabled={debriefStep===3&&reentryDecisionRequired}
        onPress={debriefStep===4?persist:next}
      />
    </View>
  </ScrollView>;
}

function Recovery({ finish,openAudio }: { finish:()=>void;openAudio:()=>void }) {
  const { t,locale }=useI18n();
  const { sessions,profile }=usePerformance();
  const recoveryCare=buildPerformanceCare(profile.lifestyle)[0];
  const [disconnectRemaining,setDisconnectRemaining]=useState(120);
  const plan=getRecoveryPlan(sessions[0]??null);
  const titleKey:Record<RecoveryPlan,TranslationKey>={
    cooldown:'recovery.cooldown',
    sleep:'recovery.sleep',
    personal:'recovery.personal',
  };
  const bodyKey:Record<RecoveryPlan,TranslationKey>={
    cooldown:'recovery.plan.cooldown',
    sleep:'recovery.plan.sleep',
    personal:'recovery.plan.personal',
  };

  useEffect(()=>{
    setDisconnectRemaining(120);
    void Speech.stop();
    Speech.speak(t('recovery.disconnectScript'),{
      language:recoverySpeechLanguage[locale],
      rate:0.78,
      pitch:1,
      volume:0.9,
    });
    const id=setInterval(()=>setDisconnectRemaining(v=>Math.max(0,v-1)),1000);
    return()=>{
      clearInterval(id);
      void Speech.stop();
    };
  },[locale,t]);

  const openRecoveryAudio=()=>{
    void Speech.stop();
    setDisconnectRemaining(0);
    openAudio();
  };

  return <ScrollView contentContainerStyle={s.scroll}>
    <FlowProgress current={4} total={4} label={t('recovery.subtitle')}/>
    <View style={s.lead}><Label>{t('recovery.subtitle')}</Label><Serif style={s.leadTitle}>{t('recovery.title')}</Serif><AppText style={s.body}>{t('recovery.body')}</AppText></View>

    <View style={s.readingCard}>
      <Label>{t(disconnectRemaining>0?'recovery.disconnectRunning':'recovery.disconnectComplete')}</Label>
      <Serif style={s.heroNumber}>{disconnectRemaining}</Serif>
      <AppText style={s.body}>{t('recovery.disconnectBody')}</AppText>
    </View>

    <View style={s.panel}>
      <Label>{t('care.title')}</Label>
      <Serif style={s.actionTitle}>{t(`care.action.${recoveryCare.priority}.title` as TranslationKey)}</Serif>
      <AppText style={s.body}>{t(`care.action.${recoveryCare.priority}.body` as TranslationKey)}</AppText>
    </View>

    <View style={s.readingCard}>
      <Label>{t('recovery.recommended')}</Label>
      <Serif style={s.actionTitle}>{t(titleKey[plan])}</Serif>
      <AppText style={s.body}>{t(bodyKey[plan])}</AppText>
    </View>
    {plan==='personal'
      ?<PremiumButton label={t('recovery.finish')} onPress={finish}/>
      :<>
        <PremiumButton label={t(titleKey[plan])} onPress={openRecoveryAudio} icon="headset-outline"/>
        <PremiumButton label={t('recovery.finish')} secondary onPress={finish}/>
      </>
    }
  </ScrollView>;
}

export function SessionScreen({ phase,setPhase,openModule,openBreak,openCheckin }: { phase:Phase; setPhase:(p:Phase)=>void; openModule:(m:Module)=>void; openBreak:()=>void; openCheckin:()=>void }) {
  const { t } = useI18n();
  const subtitle=phase==='ready'?t('session.preparation'):phase==='active'?t('session.livePerformance'):phase==='debrief'?t('session.postSession'):t('recovery.subtitle');
  return <Backdrop uri={PHOTO.session} blur={7} overlay={0.8}><SafeAreaView style={s.flex}>
    <Header title={t('session.title')} subtitle={subtitle}/>
    {phase==='ready'?<Ready onStart={()=>setPhase('active')} openAudio={()=>openModule('audio')} openReset={openBreak}/>:
      phase==='active'?<Active endSession={()=>setPhase('debrief')} openAudio={()=>openModule('audio')} openBreak={openBreak} openCheckin={openCheckin}/>:
      phase==='debrief'?<Debrief save={()=>setPhase('recovery')}/>:
      <Recovery finish={()=>setPhase('ready')} openAudio={()=>openModule('audio')}/>}
  </SafeAreaView></Backdrop>;
}

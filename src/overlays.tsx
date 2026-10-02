import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { diaryQuestions, heatmapIntensityLegend, lifestyleSections, mentalPlaylists, moduleIntroById, stoicPrinciples, tellLessons, warRoomTriggers, type WarRoomTriggerId } from './content';
import { AppText, AppTextInput, Label, PremiumButton, Serif } from './ui';
import { TestIntro } from './components/TestIntro';
import { s } from './styles';
import { ExercisePhase, GameState, Module, moduleMeta } from './types';
import { useI18n, type TranslationKey } from './i18n';
import { buildHeatmap, getSOSProtocol, type HeatmapIntensity, type HeatmapWindowId, type TiltTrigger } from './performanceEngine';
import { usePerformance } from './performanceStore';

const vaccineAnswers = [
  { id:'answer1', key:'overlay.vaccineAnswer1' },
  { id:'answer2', key:'overlay.vaccineAnswer2' },
  { id:'answer3', key:'overlay.vaccineAnswer3' },
  { id:'answer4', key:'overlay.vaccineAnswer4' },
] as const satisfies readonly { id:string; key:TranslationKey }[];

export function ModuleOverlay({ module, close }: { module:Module; close:()=>void }) {
  const { t } = useI18n();
  const [moduleStarted,setModuleStarted]=useState(false);
  const [playlist,setPlaylist]=useState('a-game');
  const [exercisePhase,setExercisePhase]=useState<ExercisePhase>('intro');
  const [reactionResult,setReactionResult]=useState<number|null>(null);
  const [diaryIndex,setDiaryIndex]=useState(0);
  const [diaryText,setDiaryText]=useState('');
  const [vaccine,setVaccine]=useState('');
  const [reactionReady,setReactionReady]=useState(false);
  const [reactionArmedAt,setReactionArmedAt]=useState<number|null>(null);
  const reactionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{ if(reactionTimer.current) clearTimeout(reactionTimer.current); },[]);
  const startReactionTest=()=>{
    setReactionResult(null);
    setReactionReady(false);
    setReactionArmedAt(null);
    setExercisePhase('running');
    const delay=1200+Math.floor(Math.random()*1800);
    reactionTimer.current=setTimeout(()=>{
      setReactionArmedAt(Date.now());
      setReactionReady(true);
    },delay);
  };
  const tapReactionTest=()=>{
    if(!reactionReady||reactionArmedAt===null)return;
    setReactionResult(Date.now()-reactionArmedAt);
    setReactionReady(false);
    setExercisePhase('result');
  };
  const meta=moduleMeta[module];
  const intro=moduleIntroById[module];
  const { sessions }=usePerformance();
  const heatmap=buildHeatmap(sessions);
  const heatmapHasHistory=heatmap.some(bucket=>bucket.count>0);
  const heatmapWindowKey:Record<HeatmapWindowId,TranslationKey>={
    '0-45':'heatmap.window.0_45','45-90':'heatmap.window.45_90','90-135':'heatmap.window.90_135',
    '135-180':'heatmap.window.135_180','180-plus':'heatmap.window.180_plus',
  };
  const heatmapIntensityKey:Record<HeatmapIntensity,TranslationKey>={
    low:'heatmap.intensity.low',moderate:'heatmap.intensity.moderate',high:'heatmap.intensity.high',critical:'heatmap.intensity.critical',
  };
  const heatTriggerKey:Record<TiltTrigger,TranslationKey>={
    'bad-beat':'trigger.badBeat','own-error':'trigger.ownError',anger:'trigger.anger',rush:'trigger.rush',
    fear:'trigger.fear',euphoria:'trigger.euphoria',fatigue:'trigger.fatigue',autopilot:'trigger.autopilot',
    revenge:'trigger.revenge',personal:'trigger.personal',
  };

  let body:React.ReactNode;

  if(module==='war') {
    body=<View style={s.moduleContent}>
      <View style={s.guidedSection}>
        <View style={s.guidedBlock}><Label>{t('common.whatItIs')}</Label><AppText style={s.body}>{t('overlay.warRoomWhat')}</AppText></View>
        <View style={s.guidedBlock}><Label>{t('common.whenToUse')}</Label><AppText style={s.body}>{t('overlay.warRoomWhen')}</AppText></View>
      </View>
      <View style={s.panel}>
        <Label>{t('overlay.heatmap')}</Label>
        <Serif style={s.overlayHeadline}>{t('overlay.whereCGameStarts')}</Serif>
        <AppText style={s.body}>{t('overlay.heatmapExplanation')}</AppText>
        {heatmapHasHistory?<>
          <View style={s.heatLegend}>{heatmapIntensityLegend.map(item=><View key={item.id} style={s.heatLegendItem}><Label>{t(item.labelKey)}</Label></View>)}</View>
          <View style={s.heatmap}>{heatmap.filter(bucket=>bucket.count>0).map(bucket=><View key={bucket.id} style={s.heatBucket}>
            <View style={s.rowBetween}><AppText style={s.goldText}>{t(heatmapWindowKey[bucket.id])}</AppText><Label>{t(heatmapIntensityKey[bucket.intensity])}</Label></View>
            {bucket.triggers.length?<AppText style={s.heatTriggers}>{bucket.triggers.map(key=>t(heatTriggerKey[key])).join(' + ')}</AppText>:null}
          </View>)}</View>
          <View style={s.guidedBlock}><Label>{t('common.yourReading')}</Label><AppText style={s.body}>{t('profile.correlationBody')}</AppText></View>
          <View style={s.guidedBlock}>
            <Label>{t('common.nextAction')}</Label>
            <AppText style={s.heatAction}>{t('overlay.heatmapActionSlow')}</AppText>
            <AppText style={s.heatAction}>{t('overlay.heatmapActionCheckin')}</AppText>
          </View>
        </>:<View style={s.guidedBlock}>
          <AppText style={s.body}>{t('overlay.heatmapInsufficient')}</AppText>
          <AppText style={s.body}>{t('overlay.heatmapCollect')}</AppText>
        </View>}
      </View>
      <View style={s.moduleAction}><View><Label>{t('overlay.battleDiary')}</Label><Serif style={s.actionTitle}>{t('overlay.auditExecution')}</Serif></View><Ionicons name="chevron-forward" size={18} color={C.goldLight}/></View>
      <View style={s.moduleAction}><View><Label>{t('overlay.psychVaccines')}</Label><Serif style={s.actionTitle}>{t('overlay.desensitizeVariance')}</Serif></View><Ionicons name="chevron-forward" size={18} color={C.goldLight}/></View>
      <View style={s.moduleAction}><View><Label>{t('overlay.sosTilt')}</Label><Serif style={s.actionTitle}>{t('overlay.sosTiltBody')}</Serif></View><Ionicons name="chevron-forward" size={18} color={C.goldLight}/></View>
    </View>;
  } else if(module==='behavior') {
    body=<View style={s.moduleContent}>
      <View style={s.panel}><Label>{t('overlay.editorialRule')}</Label><Serif style={s.overlayHeadline}>{t('overlay.baselineFirst')}</Serif><AppText style={s.body}>{t('overlay.tellsBody')}</AppText></View>
      {tellLessons.map((x,i)=><View key={x.id} style={s.lesson}><AppText style={s.moduleN}>0{i+1}</AppText><View style={s.flex}><Label>{t(x.titleKey)}</Label><AppText style={s.lessonBody}>{t(x.bodyKey)}</AppText></View></View>)}
    </View>;
  } else if(module==='gym') {
    body=<View style={s.moduleContent}>
      {exercisePhase==='intro'?<TestIntro
        title={t('overlay.reactionTest')}
        measures={t('overlay.reactionMeasures')}
        importance={t('overlay.reactionImportance')}
        instructions={t('overlay.reactionInstructions')}
        duration={t('overlay.reactionDuration')}
        startLabel={t('overlay.reactionStart')}
        onStart={startReactionTest}
      />:null}

      {exercisePhase==='running'?<TouchableOpacity style={s.reaction} onPress={tapReactionTest}>
        <Label>{t('overlay.reactionTest')}</Label>
        <Serif style={s.reactionValue}>{t(reactionReady?'overlay.ready':'overlay.wait')}</Serif>
        <AppText style={s.body}>{t(reactionReady?'overlay.tapToStart':'overlay.waitBody')}</AppText>
      </TouchableOpacity>:null}

      {exercisePhase==='result'?<View style={s.reactionResultPanel}>
        <Label>{t('overlay.reactionResult')}</Label>
        <Serif style={s.reactionValue}>{reactionResult} {t('common.milliseconds')}</Serif>
        <AppText style={s.body}>{t('overlay.reactionInterpretation')}</AppText>
        <AppText style={s.body}>{t('overlay.reactionConsistency')}</AppText>
        <PremiumButton label={t('overlay.reactionNext')} onPress={()=>setExercisePhase('next')}/>
      </View>:null}

      {exercisePhase==='next'?<View style={s.panel}>
        <Label>{t('common.nextAction')}</Label>
        <Serif style={s.actionTitle}>{t('overlay.reactionNextTitle')}</Serif>
        <AppText style={s.body}>{t('overlay.reactionNextBody')}</AppText>
        <PremiumButton label={t('overlay.reactionRepeat')} secondary onPress={()=>{setReactionResult(null);setExercisePhase('intro')}}/>
      </View>:null}

      <View style={s.moduleAction}><View><Label>{t('overlay.rangeMemory')}</Label><Serif style={s.actionTitle}>{t('overlay.rangeMemoryBody')}</Serif></View><Ionicons name="chevron-forward" size={18} color={C.goldLight}/></View>
      <View style={s.moduleAction}><View><Label>{t('overlay.attentionShift')}</Label><Serif style={s.actionTitle}>{t('overlay.attentionShiftBody')}</Serif></View><Ionicons name="chevron-forward" size={18} color={C.goldLight}/></View>
    </View>;
  } else if(module==='lifestyle') {
    body=<View style={s.moduleContent}>{lifestyleSections.map(x=><View key={x.id} style={s.lifestyle}><Label>{t(x.titleKey)}</Label><Serif style={s.actionTitle}>{t(x.subtitleKey)}</Serif><AppText style={s.lessonBody}>{t(x.bodyKey)}</AppText></View>)}</View>;
  } else if(module==='audio') {
    body=<View style={s.moduleContent}>{mentalPlaylists.map(p=><TouchableOpacity key={p.id} onPress={()=>setPlaylist(p.id)} style={[s.playlist,playlist===p.id&&s.playlistActive]}>
      <View style={[s.playCircle,playlist===p.id&&s.playCircleActive]}><Ionicons name={playlist===p.id?'pause':'play'} size={17} color={playlist===p.id?C.ink:C.goldLight}/></View>
      <View style={s.flex}>
        <View style={s.rowBetween}><Serif style={s.playlistTitle}>{t(p.titleKey)}</Serif><Label>{t(p.modeKey)}</Label></View>
        <View style={s.playlistDetail}><Label>{t('overlay.audioObjective')}</Label><AppText style={s.playlistBody}>{t(p.objectiveKey)}</AppText></View>
        <View style={s.playlistDetail}><Label>{t('overlay.audioBestMoment')}</Label><AppText style={s.playlistBody}>{t(p.bestMomentKey)}</AppText></View>
        <View style={s.rowBetween}><Label>{t('overlay.audioDuration')}</Label><AppText style={s.goldText}>{p.duration}</AppText></View>
        <View style={s.playlistDetail}><Label>{t('overlay.audioExpectedEffect')}</Label><AppText style={s.playlistBody}>{t(p.descriptionKey)}</AppText></View>
        <View style={s.playlistDetail}><Label>{t('overlay.audioCue')}</Label><Serif style={s.nowCue}>“{t(p.cueKey)}”</Serif></View>
      </View>
    </TouchableOpacity>)}</View>;
  } else if(module==='diary') {
    const question=diaryQuestions[diaryIndex];
    body=<View style={s.moduleContent}><View style={s.panel}>
      <Label>{t('overlay.question')} {diaryIndex+1} / {diaryQuestions.length}</Label>
      <Serif style={s.diaryQuestion}>{t(question.textKey)}</Serif>
      <AppTextInput value={diaryText} onChangeText={setDiaryText} multiline placeholder={t('overlay.diaryPlaceholder')} placeholderTextColor={C.dim} style={s.diaryInput}/>
      <View style={s.diaryNav}><PremiumButton label="←" secondary onPress={()=>setDiaryIndex(i=>Math.max(0,i-1))}/><PremiumButton label="→" secondary onPress={()=>setDiaryIndex(i=>Math.min(diaryQuestions.length-1,i+1))}/></View>
    </View></View>;
  } else if(module==='vaccines') {
    body=<View style={s.moduleContent}>
      <View style={s.panel}>
        <Label>{t('overlay.badBeatVaccine')}</Label>
        <Serif style={s.overlayHeadline}>{t('overlay.vaccineScenario')}</Serif>
        <AppText style={s.dangerText}>{t('overlay.vaccineRiver')}</AppText>
        <AppText style={s.body}>{t('overlay.vaccineBody')}</AppText>
      </View>
      {vaccineAnswers.map(x=><TouchableOpacity key={x.id} onPress={()=>setVaccine(x.id)} style={[s.option,vaccine===x.id&&s.optionActive]}><AppText style={[s.optionText,vaccine===x.id&&s.optionTextActive]}>{t(x.key)}</AppText></TouchableOpacity>)}
    </View>;
  } else {
    body=<View style={s.moduleContent}>{stoicPrinciples.map(x=><View key={x.id} style={s.stoic}><Label>{t(x.titleKey)}</Label><Serif style={s.stoicText}>{t(x.bodyKey)}</Serif></View>)}</View>;
  }

  const moduleIntro=<View style={s.moduleIntro}>
    <Label>{t('moduleIntro.whatTrain')}</Label>
    <AppText style={s.body}>{t(intro.whatKey)}</AppText>
    <View style={s.moduleIntroMeta}>
      <View style={s.flex}><Label>{t('moduleIntro.whenUse')}</Label><AppText style={s.body}>{t(intro.whenKey)}</AppText></View>
      <View style={s.flex}><Label>{t('moduleIntro.estimatedTime')}</Label><AppText style={s.goldText}>{t(intro.durationKey)}</AppText></View>
    </View>
    <PremiumButton label={t('moduleIntro.start')} onPress={()=>setModuleStarted(true)}/>
  </View>;

  return <View style={s.overlay}><SafeAreaView style={s.flex}>
    <View style={s.overlayHeader}><View><Label>{t(meta.subtitleKey).toUpperCase()}</Label><Serif style={s.overlayTitle}>{t(meta.titleKey).toUpperCase()}</Serif></View><TouchableOpacity onPress={close} style={s.close}><Ionicons name="close" size={25} color={C.ivory}/></TouchableOpacity></View>
    <ScrollView contentContainerStyle={s.overlayScroll}>{moduleStarted?body:moduleIntro}</ScrollView>
  </SafeAreaView></View>;
}

export function BreakOverlay({ close }: { close:()=>void }) {
  const { t } = useI18n();
  const [step,setStep]=useState(0);
  const steps = [
    { time:'01:00', titleKey:'break.step1.title', bodyKey:'break.step1.body' },
    { time:'02:00', titleKey:'break.step2.title', bodyKey:'break.step2.body' },
    { time:'03:00', titleKey:'break.step3.title', bodyKey:'break.step3.body' },
    { time:'04:00', titleKey:'break.step4.title', bodyKey:'break.step4.body' },
  ] as const satisfies readonly { time:string; titleKey:TranslationKey; bodyKey:TranslationKey }[];
  const current=steps[step];

  return <View style={s.overlay}><SafeAreaView style={s.breakSafe}>
    <View style={s.rowBetween}><Label>{t('break.label')}</Label><TouchableOpacity onPress={close} style={s.close}><Ionicons name="close" size={25} color={C.ivory}/></TouchableOpacity></View>
    <View style={s.breakCenter}>
      <View style={s.breathe}><View style={s.breatheInner}/></View>
      <AppText style={s.goldText}>{current.time}</AppText>
      <Serif style={s.breakTitle}>{t(current.titleKey)}</Serif>
      <AppText style={s.breakCopy}>{t(current.bodyKey)}</AppText>
      <View style={s.breakDots}>{steps.map((_,i)=><View key={i} style={[s.breakDot,i===step&&s.breakDotActive]}/>)}</View>
    </View>
    <PremiumButton label={step===3?t('break.return'):t('break.nextMinute')} onPress={()=>step===3?close():setStep(step+1)}/>
  </SafeAreaView></View>;
}

function QuickScore({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}) {
  return <View style={s.scaleBlock}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.goldText}>{value}/10</AppText></View>
    <View style={s.scoreGrid}>{[0,2,4,6,8,10].map(n=><TouchableOpacity key={n} onPress={()=>onChange(n)} style={[s.scoreCell,value===n&&s.chipActive]}><AppText style={[s.chipText,value===n&&s.chipTextActive]}>{n}</AppText></TouchableOpacity>)}</View>
  </View>;
}

export function CheckinOverlay({ close }: { close:()=>void }) {
  const { t } = useI18n();
  const { addRuntimeCheckin,activeSession }=usePerformance();
  const [state,setState]=useState<GameState>('B');
  const [focus,setFocus]=useState(activeSession?.pre.mentalDrive??6);
  const [tension,setTension]=useState(activeSession?.pre.tension??4);
  const [impulse,setImpulse]=useState(activeSession?.pre.impulse??3);
  const [fatigue,setFatigue]=useState(activeSession?.pre.fatigue??4);
  const [trigger,setTrigger]=useState<TiltTrigger|''>('');

  const save=()=>{
    addRuntimeCheckin({focus,tension,impulse,fatigue,state,trigger:trigger||undefined});
    close();
  };

  return <View style={s.overlay}><SafeAreaView style={s.checkinSafe}>
    <View style={s.rowBetween}><View><Label>{t('checkin.label')}</Label><Serif style={s.overlayTitle}>{t('session.realCheckin')}</Serif></View><TouchableOpacity onPress={close} style={s.close}><Ionicons name="close" size={25} color={C.ivory}/></TouchableOpacity></View>
    <AppText style={s.body}>{t('checkin.quickBody')}</AppText>
    <ScrollView contentContainerStyle={s.moduleContent}>
      <View style={s.panel}>
        <QuickScore label={t('checkin.focus')} value={focus} onChange={setFocus}/>
        <QuickScore label={t('checkin.tension')} value={tension} onChange={setTension}/>
        <QuickScore label={t('checkin.impulse')} value={impulse} onChange={setImpulse}/>
        <QuickScore label={t('checkin.fatigue')} value={fatigue} onChange={setFatigue}/>
      </View>
      <View style={s.panel}><Label>{t('checkin.game')}</Label><View style={s.stateRow}>{(['A','B','C'] as GameState[]).map(x=><TouchableOpacity key={x} onPress={()=>setState(x)} style={[s.stateButton,state===x&&s.stateButtonActive]}><AppText style={[s.stateText,state===x&&s.stateTextActive]}>{x}</AppText></TouchableOpacity>)}</View></View>
      <View style={s.panel}><Label>{t('checkin.triggerState')}</Label><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity key={x.id} onPress={()=>setTrigger(x.id as TiltTrigger)} style={[s.chip,trigger===x.id&&s.chipActive]}><AppText style={[s.chipText,trigger===x.id&&s.chipTextActive]}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View></View>
    </ScrollView>
    <PremiumButton label={t('checkin.save')} onPress={save}/>
  </SafeAreaView></View>;
}

const protocolTitleKey={
  reanchor:'sos.protocol.reanchor.title',
  'ego-reset':'sos.protocol.ego-reset.title',
  'sit-out':'sos.protocol.sit-out.title',
  containment:'sos.protocol.containment.title',
  'slow-down':'sos.protocol.slow-down.title',
  'personal-reset':'sos.protocol.personal-reset.title',
} as const satisfies Record<ReturnType<typeof getSOSProtocol>['id'],TranslationKey>;

const protocolBodyKey={
  reanchor:'sos.protocol.reanchor.body',
  'ego-reset':'sos.protocol.ego-reset.body',
  'sit-out':'sos.protocol.sit-out.body',
  containment:'sos.protocol.containment.body',
  'slow-down':'sos.protocol.slow-down.body',
  'personal-reset':'sos.protocol.personal-reset.body',
} as const satisfies Record<ReturnType<typeof getSOSProtocol>['id'],TranslationKey>;

export function SOSOverlay({ close, goCoach }: { close:()=>void; goCoach:()=>void }) {
  const { t } = useI18n();
  const { activeSession,recordSOS }=usePerformance();
  const [trigger,setTrigger]=useState<TiltTrigger|''>('');
  const protocol=trigger?getSOSProtocol(trigger,activeSession?.plan.mode??'cash'):null;

  const choose=(next:TiltTrigger)=>{
    setTrigger(next);
    recordSOS(next);
  };

  return <View style={s.sos}><SafeAreaView style={s.sosSafe}>
    <View style={s.rowBetween}><Label>{t('sos.label')}</Label><TouchableOpacity onPress={close} style={s.close}><Ionicons name="close" size={25} color={C.ivory}/></TouchableOpacity></View>
    {!protocol?<View style={s.sosCenter}>
      <Label>{t('sos.symptom')}</Label>
      <Serif style={s.sosTitle}>{t('sos.whatHappened')}</Serif>
      <AppText style={s.sosCopy}>{t('sos.selectSymptom')}</AppText>
      <View style={s.sosTriggerWrap}><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity key={x.id} onPress={()=>choose(x.id as TiltTrigger)} style={s.chip}><AppText style={s.chipText}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View></View>
    </View>:<View style={s.sosCenter}>
      <Label>{t('sos.protocol')}</Label>
      <View style={s.breathe}><View style={s.breatheInner}/></View>
      <Serif style={s.sosTitle}>{t(protocolTitleKey[protocol.id])}</Serif>
      <AppText style={s.sosCopy}>{t(protocolBodyKey[protocol.id])}</AppText>
      <AppText style={s.sosTimer}>{protocol.seconds}</AppText>
    </View>}
    <View style={s.sosActions}>
      {protocol?<PremiumButton label={t('sos.return')} onPress={close}/>:null}
      <PremiumButton label={t('sos.talkCoach')} secondary icon="chatbubble-outline" onPress={goCoach}/>
    </View>
  </SafeAreaView></View>;
}

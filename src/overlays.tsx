import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { C } from './theme';
import { diaryQuestions, heatmapIntensityLegend, lifestyleSections, microAudios, mindfulnessTechniques, moduleIntroById, stoicPrinciples, tellLessons, warRoomTriggers, type WarRoomTriggerId } from './content';
import { AppText, AppTextInput, Label, PremiumButton, Serif } from './ui';
import { TestIntro } from './components/TestIntro';
import { s } from './styles';
import { ExercisePhase, Module, moduleMeta } from './types';
import { useI18n, type Locale, type TranslationKey } from './i18n';
import { buildHeatmap, deriveExecutionQuality, deriveMentalState, getSOSProtocol, type ExecutionQuality, type HeatmapIntensity, type HeatmapWindowId, type MentalState, type TiltTrigger } from './performanceEngine';
import { usePerformance } from './performanceStore';
import { buildPerformanceCare,buildDailyCareTasks } from './performanceCare';

type FrequencyPresetId='delta'|'alpha'|'beta'|'gamma';
const frequencyPresets=[
  {id:'delta' as const,hz:4,source:require('../assets/audio/binaural-delta-4.wav'),labelKey:'overlay.audioBand.delta' as TranslationKey,useKey:'overlay.audioBand.deltaUse' as TranslationKey},
  {id:'alpha' as const,hz:10,source:require('../assets/audio/binaural-alpha-10.wav'),labelKey:'overlay.audioBand.alpha' as TranslationKey,useKey:'overlay.audioBand.alphaUse' as TranslationKey},
  {id:'beta' as const,hz:20,source:require('../assets/audio/binaural-beta-20.wav'),labelKey:'overlay.audioBand.beta' as TranslationKey,useKey:'overlay.audioBand.betaUse' as TranslationKey},
  {id:'gamma' as const,hz:30,source:require('../assets/audio/binaural-gamma-30.wav'),labelKey:'overlay.audioBand.gamma' as TranslationKey,useKey:'overlay.audioBand.gammaUse' as TranslationKey},
];

const speechLanguage:Record<Locale,string>={
  pt:'pt-BR',
  en:'en-US',
  es:'es-ES',
};

const vaccineAnswers = [
  { id:'answer1', key:'overlay.vaccineAnswer1' },
  { id:'answer2', key:'overlay.vaccineAnswer2' },
  { id:'answer3', key:'overlay.vaccineAnswer3' },
  { id:'answer4', key:'overlay.vaccineAnswer4' },
] as const satisfies readonly { id:string; key:TranslationKey }[];

export function ModuleOverlay({ module, close }: { module:Module; close:()=>void }) {
  const { t,locale } = useI18n();
  const [moduleStarted,setModuleStarted]=useState(false);
  const [loadedFrequency,setLoadedFrequency]=useState<FrequencyPresetId|null>(null);
  const [audioIntent,setAudioIntent]=useState<'play'|'pause'>('pause');
  const [audioReloadToken,setAudioReloadToken]=useState(0);
  const [frequencyPreset,setFrequencyPreset]=useState<FrequencyPresetId>('alpha');
  const audioPlayer=useAudioPlayer(null,{updateInterval:250});
  const audioStatus=useAudioPlayerStatus(audioPlayer);
  const [exercisePhase,setExercisePhase]=useState<ExercisePhase>('intro');
  const [reactionResult,setReactionResult]=useState<number|null>(null);
  const [diaryIndex,setDiaryIndex]=useState(0);
  const [diaryText,setDiaryText]=useState('');
  const [vaccine,setVaccine]=useState('');
  const [mindsetIndex,setMindsetIndex]=useState(0);
  const [microAudioIndex,setMicroAudioIndex]=useState(0);
  const [speakingMicroAudio,setSpeakingMicroAudio]=useState(false);
  const [reactionReady,setReactionReady]=useState(false);
  const [reactionArmedAt,setReactionArmedAt]=useState<number|null>(null);
  const reactionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{ if(reactionTimer.current) clearTimeout(reactionTimer.current); },[]);

  useEffect(()=>()=>{ void Speech.stop(); audioPlayer.pause(); },[audioPlayer]);
  useEffect(()=>{
    if(!loadedFrequency||audioIntent!=='play'||!audioStatus.isLoaded)return;
    audioPlayer.play();
  },[audioIntent,audioReloadToken,audioStatus.isLoaded,loadedFrequency,audioPlayer]);
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
  const currentFrequency=frequencyPresets.find(item=>item.id===frequencyPreset)??frequencyPresets[1];
  const toggleFrequencyAudio=(next:FrequencyPresetId)=>{
    const preset=frequencyPresets.find(item=>item.id===next)??frequencyPresets[1];
    const sameSource=loadedFrequency===next;
    setFrequencyPreset(next);
    if(sameSource){
      if(audioStatus.playing||audioIntent==='play'){
        setAudioIntent('pause');
        audioPlayer.pause();
      } else {
        setAudioIntent('play');
        if(audioStatus.isLoaded) audioPlayer.play();
      }
      return;
    }
    setAudioIntent('play');
    setLoadedFrequency(next);
    audioPlayer.pause();
    audioPlayer.replace(preset.source);
    audioPlayer.loop=true;
    audioPlayer.shouldCorrectPitch=false;
    audioPlayer.playbackRate=1;
    audioPlayer.volume=0.18;
    setAudioReloadToken(token=>token+1);
  };
  const stopFrequencyAudio=()=>{
    setAudioIntent('pause');
    audioPlayer.pause();
  };


  const playMicroAudio=()=>{
    const script=microAudios[microAudioIndex];
    setAudioIntent('pause');
    audioPlayer.pause();
    void Speech.stop();
    setSpeakingMicroAudio(true);
    Speech.speak(t(script.scriptKey),{
      language:speechLanguage[locale],
      rate:0.72,
      pitch:1,
      volume:0.9,
      onDone:()=>setSpeakingMicroAudio(false),
      onStopped:()=>setSpeakingMicroAudio(false),
      onError:()=>setSpeakingMicroAudio(false),
    });
  };
  const stopMicroAudio=()=>{
    void Speech.stop();
    setSpeakingMicroAudio(false);
  };

  const meta=moduleMeta[module];
  const intro=moduleIntroById[module];
  const { sessions,profile }=usePerformance();
  const careActions=buildPerformanceCare(profile.lifestyle);
  const careTasks=buildDailyCareTasks(profile.lifestyle);
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
    body=<View style={s.moduleContent}><View style={s.panel}><Label>{t('care.dailyPlan')}</Label>{careActions.slice(0,3).map(item=><View key={item.priority} style={s.guidedBlock}><Serif style={s.actionTitle}>{t(`care.action.${item.priority}.title` as TranslationKey)}</Serif><AppText style={s.body}>{t(`care.action.${item.priority}.body` as TranslationKey)}</AppText></View>)}{careTasks.slice(0,3).map(task=><View key={task.id} style={s.guidedBlock}><Label>{t(`care.task.${task.id}.title` as TranslationKey)}</Label><AppText style={s.body}>{t(`care.task.${task.id}.body` as TranslationKey)}</AppText></View>)}</View>{lifestyleSections.map(x=><View key={x.id} style={s.lifestyle}><Label>{t(x.titleKey)}</Label><Serif style={s.actionTitle}>{t(x.subtitleKey)}</Serif><AppText style={s.lessonBody}>{t(x.bodyKey)}</AppText></View>)}</View>;
  } else if(module==='audio') {
    body=<View style={s.moduleContent}>
      <View style={s.panel}>
        <Label>{t('overlay.audioBand')}</Label>
        <AppText style={s.body}>{t('overlay.audioFrequencyNote')}</AppText>
      </View>
      {frequencyPresets.map(preset=>{
        const selected=frequencyPreset===preset.id;
        const playing=loadedFrequency===preset.id&&audioStatus.playing;
        return <TouchableOpacity key={preset.id} onPress={()=>toggleFrequencyAudio(preset.id)} style={[s.playlist,selected&&s.playlistActive]}>
          <View style={[s.playCircle,playing&&s.playCircleActive]}><Ionicons name={playing?'pause':'play'} size={17} color={playing?C.ink:C.goldLight}/></View>
          <View style={s.flex}>
            <View style={s.rowBetween}><Serif style={s.playlistTitle}>{t(preset.labelKey)}</Serif><Label>{preset.hz} {t('overlay.audioHertz')}</Label></View>
            <View style={s.playlistDetail}><Label>{t('overlay.audioBandUse')}</Label><AppText style={s.playlistBody}>{t(preset.useKey)}</AppText></View>
          </View>
        </TouchableOpacity>;
      })}
      {loadedFrequency?<PremiumButton label={t('micro.stop')} secondary icon="stop-circle-outline" onPress={stopFrequencyAudio}/>:null}
    </View>;
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
  } else if(module==='mindset') {
    const technique=mindfulnessTechniques[mindsetIndex];
    const microAudio=microAudios[microAudioIndex];
    body=<View style={s.moduleContent}>
      <View style={s.panel}>
        <View style={s.rowBetween}>
          <TouchableOpacity style={s.close} onPress={()=>setMindsetIndex(i=>(i-1+mindfulnessTechniques.length)%mindfulnessTechniques.length)}><Ionicons name="chevron-back" size={22} color={C.goldLight}/></TouchableOpacity>
          <AppText style={s.goldText}>{mindsetIndex+1} / {mindfulnessTechniques.length}</AppText>
          <TouchableOpacity style={s.close} onPress={()=>setMindsetIndex(i=>(i+1)%mindfulnessTechniques.length)}><Ionicons name="chevron-forward" size={22} color={C.goldLight}/></TouchableOpacity>
        </View>
        <Label>{t(technique.titleKey)}</Label>
        <AppText style={s.body}>{t(technique.whenKey)}</AppText>
        <View style={s.rule}/>
        <Serif style={s.stoicText}>{t(technique.bodyKey)}</Serif>
      </View>

      <View style={s.panel}>
        <Label>{t('micro.section')}</Label>
        <View style={s.rowBetween}>
          <TouchableOpacity style={s.close} onPress={()=>{stopMicroAudio();setMicroAudioIndex(i=>(i-1+microAudios.length)%microAudios.length);}}><Ionicons name="chevron-back" size={22} color={C.goldLight}/></TouchableOpacity>
          <AppText style={s.goldText}>{microAudioIndex+1} / {microAudios.length}</AppText>
          <TouchableOpacity style={s.close} onPress={()=>{stopMicroAudio();setMicroAudioIndex(i=>(i+1)%microAudios.length);}}><Ionicons name="chevron-forward" size={22} color={C.goldLight}/></TouchableOpacity>
        </View>
        <Serif style={s.actionTitle}>{t(microAudio.titleKey)}</Serif>
        <Label>{t(microAudio.durationKey)}</Label>
        <AppText style={s.body}>{t(microAudio.summaryKey)}</AppText>
        <PremiumButton
          label={t(speakingMicroAudio?'micro.stop':'micro.play')}
          secondary={speakingMicroAudio}
          icon={speakingMicroAudio?'stop-circle-outline':'volume-high-outline'}
          onPress={speakingMicroAudio?stopMicroAudio:playMicroAudio}
        />
      </View>

      <View style={s.guidedBlock}>
        <Label>{t('evidence.title')}</Label>
        <AppText style={s.body}>{t('evidence.body')}</AppText>
      </View>
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
  const initialMentalState=deriveMentalState({readinessIndex:50,tiltRisk:'medium',sessionMinutes:0,focus:activeSession?.pre.mentalDrive??6,tension:activeSession?.pre.tension??4,impulse:activeSession?.pre.impulse??3,fatigue:activeSession?.pre.fatigue??4});
  const [mentalState,setMentalState]=useState<MentalState>(initialMentalState);
  const [focus,setFocus]=useState(activeSession?.pre.mentalDrive??6);
  const [tension,setTension]=useState(activeSession?.pre.tension??4);
  const [impulse,setImpulse]=useState(activeSession?.pre.impulse??3);
  const [fatigue,setFatigue]=useState(activeSession?.pre.fatigue??4);
  const [trigger,setTrigger]=useState<TiltTrigger|''>('');

  const save=()=>{
    const executionQuality=deriveExecutionQuality({focus,tension,impulse,fatigue});
    const nextMentalState=deriveMentalState({readinessIndex:50,tiltRisk:impulse>=9||tension>=9?'critical':impulse>=6||tension>=7?'medium':'low',sessionMinutes:0,focus,tension,impulse,fatigue});
    setMentalState(nextMentalState);
    addRuntimeCheckin({focus,tension,impulse,fatigue,mentalState:nextMentalState,executionQuality,trigger:trigger||undefined});
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
      <View style={s.panel}><Label>{t('checkin.mentalState')}</Label><Serif style={s.actionTitle}>{t(({'centered':'mentalState.centered','alert':'mentalState.alert','vulnerable':'mentalState.vulnerable','dysregulated':'mentalState.dysregulated','tilt':'mentalState.tilt'} as const)[mentalState])}</Serif><AppText style={s.body}>{t('checkin.mentalStateBody')}</AppText></View>
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

const sosBreathPhaseKey={
  inhale1:'sos.breathe.inhale1',
  inhale2:'sos.breathe.inhale2',
  exhale:'sos.breathe.exhale',
} as const satisfies Record<'inhale1'|'inhale2'|'exhale',TranslationKey>;

export function SOSOverlay({ close, goCoach }: { close:()=>void; goCoach:()=>void }) {
  const { t } = useI18n();
  const { activeSession,recordSOS }=usePerformance();
  const [trigger,setTrigger]=useState<TiltTrigger|''>('');
  const [sosRemaining,setSosRemaining]=useState(0);
  const [sosBreathPhase,setSosBreathPhase]=useState<'inhale1'|'inhale2'|'exhale'>('inhale1');
  const protocol=trigger?getSOSProtocol(trigger,activeSession?.plan.mode??'cash'):null;

  useEffect(()=>{
    if(!protocol){
      setSosRemaining(0);
      setSosBreathPhase('inhale1');
      return;
    }
    setSosRemaining(protocol.seconds);
    setSosBreathPhase('inhale1');
    const id=setInterval(()=>{
      setSosRemaining(previous=>{
        if(previous<=1){
          clearInterval(id);
          return 0;
        }
        const next=previous-1;
        const elapsed=protocol.seconds-next;
        const cycle=elapsed%7;
        setSosBreathPhase(cycle<2?'inhale1':cycle<3?'inhale2':'exhale');
        return next;
      });
    },1000);
    return()=>clearInterval(id);
  },[protocol?.id,protocol?.seconds]);

  const choose=(next:TiltTrigger)=>{
    setTrigger(next);
    recordSOS(next);
  };

  return <View style={s.sos}><SafeAreaView style={s.sosSafe}>
    <View style={s.rowBetween}><Label>{t('sos.label')}</Label>{!protocol||sosRemaining===0?<TouchableOpacity onPress={close} style={s.close}><Ionicons name="close" size={25} color={C.ivory}/></TouchableOpacity>:<View style={s.close}><Ionicons name="lock-closed-outline" size={20} color={C.dim}/></View>}</View>
    {!protocol?<View style={s.sosCenter}>
      <Label>{t('sos.symptom')}</Label>
      <Serif style={s.sosTitle}>{t('sos.whatHappened')}</Serif>
      <AppText style={s.sosCopy}>{t('sos.selectSymptom')}</AppText>
      <View style={s.sosTriggerWrap}><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity key={x.id} onPress={()=>choose(x.id as TiltTrigger)} style={s.chip}><AppText style={s.chipText}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View></View>
    </View>:<View style={s.sosCenter}>
      <Label>{t('coachJourney.interrupt')}</Label>
      <Serif style={s.sosTitle}>{t('coachJourney.eventPassed')}</Serif>
      <AppText style={s.sosCopy}>{t('coachJourney.eventPassedBody')}</AppText>
      <View style={s.rule}/>
      <Label>{t('sos.protocol')}</Label>
      <View style={s.breathe}><View style={s.breatheInner}/></View>
      <AppText style={s.goldText}>{t(sosRemaining>0?sosBreathPhaseKey[sosBreathPhase]:'sos.breathe.complete')}</AppText>
      <Serif style={s.sosTitle}>{t(protocolTitleKey[protocol.id])}</Serif>
      <AppText style={s.sosCopy}>{t(protocolBodyKey[protocol.id])}</AppText>
      <AppText style={s.sosTimer}>{sosRemaining}</AppText>
      {sosRemaining===0?<View style={s.guidedBlock}>
        <Label>{t('coachJourney.anchor')}</Label>
        <Serif style={s.actionTitle}>{t('coachJourney.nextDecision')}</Serif>
        <AppText style={s.body}>{t('coachJourney.noRecoveryBody')}</AppText>
      </View>:null}
    </View>}
    <View style={s.sosActions}>
      {protocol?<PremiumButton label={sosRemaining>0?t('sos.continue'):t('sos.return')} disabled={sosRemaining>0} onPress={close}/>:null}
      <PremiumButton label={t('sos.talkCoach')} secondary icon="chatbubble-outline" onPress={goCoach}/>
    </View>
  </SafeAreaView></View>;
}

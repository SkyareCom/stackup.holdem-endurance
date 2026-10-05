import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { decisionCues, processGoals, warRoomTriggers, type ProcessGoalId, type WarRoomTriggerId } from '../content';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { GameState, Module, Phase } from '../types';
import { useI18n } from '../i18n';

function Scale({ label, value, setValue }: { label:string; value:number; setValue:(n:number)=>void }) {
  return <View style={s.scaleBlock}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.metricValue}>{value}/5</AppText></View><View style={s.scaleRow}>{[1,2,3,4,5].map(n=><TouchableOpacity activeOpacity={0.68} accessibilityRole="button" accessibilityState={{selected:value===n}} key={n} onPress={()=>setValue(n)} style={[s.scaleDot,value===n&&s.scaleDotActive]}><AppText style={[s.scaleText,value===n&&s.scaleTextActive]}>{n}</AppText></TouchableOpacity>)}</View></View>;
}

function Ready({ onStart }: { onStart:()=>void }) {
  const { t } = useI18n();
  const [energy,setEnergy]=useState(4), [focus,setFocus]=useState(3), [stress,setStress]=useState(2);
  const [goal,setGoal]=useState<ProcessGoalId>('process');
  const selectedGoal=processGoals.find((x)=>x.id===goal) ?? processGoals[0];

  return <ScrollView contentContainerStyle={s.scroll}>
    <View style={s.lead}><Label>{t('session.readyCheck')}</Label><Serif style={s.leadTitle}>{t('session.readyTitle')}</Serif><AppText style={s.body}>{t('session.readyBody')}</AppText></View>
    <View style={s.panel}><Scale label={t('home.energy')} value={energy} setValue={setEnergy}/><Scale label={t('home.focus')} value={focus} setValue={setFocus}/><Scale label={t('session.stress')} value={stress} setValue={setStress}/></View>
    <View style={s.panel}>
      <Label>{t('session.processGoal')}</Label>
      <View style={s.chips}>{processGoals.map(x=><TouchableOpacity activeOpacity={0.68} accessibilityRole="button" accessibilityState={{selected:goal===x.id}} key={x.id} onPress={()=>setGoal(x.id)} style={[s.chip,goal===x.id&&s.chipActive]}><AppText style={[s.chipText,goal===x.id&&s.chipTextActive]}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View>
      <AppText style={s.body}>{t('session.currentIntention')} <AppText style={s.goldText}>{t(selectedGoal.labelKey)}</AppText>. {t('session.intentionHelp')}</AppText>
    </View>
    <PremiumButton label={t('session.start')} onPress={onStart}/>
  </ScrollView>;
}

function Active({ endSession, openAudio, openBreak, openCheckin }: { endSession:()=>void; openAudio:()=>void; openBreak:()=>void; openCheckin:()=>void }) {
  const { t } = useI18n();
  const [state,setState]=useState<GameState>('B'); const [cue,setCue]=useState(0);

  return <ScrollView contentContainerStyle={s.scroll}>
    <ImageBackground source={{uri:PHOTO.session}} blurRadius={3} style={s.sessionHero} imageStyle={s.sessionHeroImage}>
      <LinearGradient colors={['rgba(8,6,4,.10)','rgba(14,10,6,.35)','rgba(7,6,5,.94)']} style={StyleSheet.absoluteFill}/>
      <View style={s.sessionHeroContent}><View style={s.rowBetween}><Label>{t('session.liveMtt')}</Label><AppText style={s.live}>{t('session.live')}</AppText></View><Serif style={s.clock}>02:47:18</Serif><AppText style={s.body}>{t('session.presenceFirst')}</AppText></View>
    </ImageBackground>
    <View style={s.panel}><Label>{t('session.executionState')}</Label><Serif style={s.gameState}>{state}-GAME</Serif><View style={s.stateRow}>{(['A','B','C'] as GameState[]).map(x=><TouchableOpacity activeOpacity={0.68} accessibilityRole="button" accessibilityState={{selected:state===x}} key={x} onPress={()=>setState(x)} style={[s.stateButton,state===x&&s.stateButtonActive]}><AppText style={[s.stateText,state===x&&s.stateTextActive]}>{x}</AppText></TouchableOpacity>)}</View></View>
    <TouchableOpacity activeOpacity={0.72} style={[s.cueBlock,s.interactiveRow]} onPress={()=>setCue((cue+1)%decisionCues.length)}><Label>{t('session.tapCue')}</Label><Serif style={s.cueText}>“{t(decisionCues[cue])}”</Serif></TouchableOpacity>
    <TouchableOpacity activeOpacity={0.72} style={s.audioBar} onPress={openAudio}><View style={s.play}><Ionicons name="play" size={18} color={C.ink}/></View><View style={s.flex}><Label>{t('session.mentalPlaylist')}</Label><AppText style={s.audioTitle}>{t('session.deepFocus')}</AppText><View style={s.track}><View style={[s.fill,{width:'43%'}]}/></View></View><AppText style={s.audioTime}>18:42 / 45:00</AppText></TouchableOpacity>
    <View style={s.twoCols}><PremiumButton label={t('session.checkin')} secondary onPress={openCheckin} icon="pulse-outline"/><PremiumButton label={t('session.break4')} secondary onPress={openBreak} icon="pause-outline"/></View>
    <PremiumButton label={t('session.end')} secondary onPress={endSession} icon="stop-circle-outline"/>
  </ScrollView>;
}

function Debrief({ save, openDiary }: { save:()=>void; openDiary:()=>void }) {
  const { t } = useI18n();
  const [state,setState]=useState<GameState>('B');
  const [triggers,setTriggers]=useState<WarRoomTriggerId[]>([]);
  const toggle=(id:WarRoomTriggerId)=>setTriggers(v=>v.includes(id)?v.filter(t=>t!==id):[...v,id]);

  return <ScrollView contentContainerStyle={s.scroll}>
    <View style={s.lead}><Label>{t('session.debrief')}</Label><Serif style={s.leadTitle}>{t('session.debriefTitle')}</Serif><AppText style={s.body}>{t('session.debriefBody')}</AppText></View>
    <View style={s.panel}><Label>{t('session.predominantState')}</Label><View style={s.stateRow}>{(['A','B','C'] as GameState[]).map(x=><TouchableOpacity activeOpacity={0.68} accessibilityRole="button" accessibilityState={{selected:state===x}} key={x} onPress={()=>setState(x)} style={[s.stateButton,state===x&&s.stateButtonActive]}><AppText style={[s.stateText,state===x&&s.stateTextActive]}>{x}</AppText></TouchableOpacity>)}</View></View>
    <View style={s.panel}><Label>{t('session.whatChanged')}</Label><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity activeOpacity={0.68} accessibilityRole="button" accessibilityState={{selected:triggers.includes(x.id)}} key={x.id} onPress={()=>toggle(x.id)} style={[s.chip,triggers.includes(x.id)&&s.chipActive]}><AppText style={[s.chipText,triggers.includes(x.id)&&s.chipTextActive]}>{t(x.labelKey)}</AppText></TouchableOpacity>)}</View></View>
    <PremiumButton label={t('session.openDiary')} secondary onPress={openDiary} icon="mic-outline"/>
    <PremiumButton label={t('session.save')} onPress={save}/>
  </ScrollView>;
}

export function SessionScreen({ phase,setPhase,openModule,openBreak,openCheckin }: { phase:Phase; setPhase:(p:Phase)=>void; openModule:(m:Module)=>void; openBreak:()=>void; openCheckin:()=>void }) {
  const { t } = useI18n();
  const subtitle=phase==='ready'?t('session.preparation'):phase==='active'?t('session.livePerformance'):t('session.postSession');
  return <Backdrop uri={PHOTO.session} blur={7} overlay={0.8}><SafeAreaView style={s.flex}><Header title={t('session.title')} subtitle={subtitle}/>{phase==='ready'?<Ready onStart={()=>setPhase('active')}/>:phase==='active'?<Active endSession={()=>setPhase('debrief')} openAudio={()=>openModule('audio')} openBreak={openBreak} openCheckin={openCheckin}/>:<Debrief save={()=>setPhase('ready')} openDiary={()=>openModule('diary')}/>}</SafeAreaView></Backdrop>;
}

import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { decisionCues, warRoomTriggers } from '../content';
import { Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { GameState, Module, Phase } from '../types';

function Scale({ label, value, setValue }: { label:string; value:number; setValue:(n:number)=>void }) {
  return <View style={s.scaleBlock}><View style={s.rowBetween}><Label>{label}</Label><Text style={s.metricValue}>{value}/5</Text></View><View style={s.scaleRow}>{[1,2,3,4,5].map(n=><TouchableOpacity key={n} onPress={()=>setValue(n)} style={[s.scaleDot,value===n&&s.scaleDotActive]}><Text style={[s.scaleText,value===n&&s.scaleTextActive]}>{n}</Text></TouchableOpacity>)}</View></View>;
}

function Ready({ onStart }: { onStart:()=>void }) {
  const [energy,setEnergy]=useState(4), [focus,setFocus]=useState(3), [stress,setStress]=useState(2), [goal,setGoal]=useState('PROCESSO');
  return <ScrollView contentContainerStyle={s.scroll}><View style={s.lead}><Label>PRE-SESSION / READY CHECK</Label><Serif style={s.leadTitle}>Entre no jogo antes de abrir a primeira mão.</Serif><Text style={s.body}>Sessenta segundos para medir estado, definir intenção e reduzir decisões contaminadas pela pressa.</Text></View><View style={s.panel}><Scale label="ENERGIA" value={energy} setValue={setEnergy}/><Scale label="FOCO" value={focus} setValue={setFocus}/><Scale label="ESTRESSE" value={stress} setValue={setStress}/></View><View style={s.panel}><Label>OBJETIVO DE PROCESSO</Label><View style={s.chips}>{['PROCESSO','PACIÊNCIA','TEMPO','RANGES','PAUSAS','DISCIPLINA'].map(x=><TouchableOpacity key={x} onPress={()=>setGoal(x)} style={[s.chip,goal===x&&s.chipActive]}><Text style={[s.chipText,goal===x&&s.chipTextActive]}>{x}</Text></TouchableOpacity>)}</View><Text style={s.body}>Intenção atual: <Text style={s.goldText}>{goal}</Text>. Se perceber urgência, desacelere antes da próxima decisão relevante.</Text></View><PremiumButton label="START SESSION" onPress={onStart}/></ScrollView>;
}

function Active({ endSession, openAudio, openBreak, openCheckin }: { endSession:()=>void; openAudio:()=>void; openBreak:()=>void; openCheckin:()=>void }) {
  const [state,setState]=useState<GameState>('B'); const [cue,setCue]=useState(0);
  return <ScrollView contentContainerStyle={s.scroll}>
    <ImageBackground source={{uri:PHOTO.session}} blurRadius={3} style={s.sessionHero} imageStyle={s.sessionHeroImage}><LinearGradient colors={['rgba(8,6,4,.10)','rgba(14,10,6,.35)','rgba(7,6,5,.94)']} style={StyleSheet.absoluteFillObject}/><View style={s.sessionHeroContent}><View style={s.rowBetween}><Label>LIVE SESSION / MTT ONLINE</Label><Text style={s.live}>● LIVE</Text></View><Serif style={s.clock}>02:47:18</Serif><Text style={s.body}>Presença primeiro. Estratégia depois.</Text></View></ImageBackground>
    <View style={s.panel}><Label>CURRENT EXECUTION STATE</Label><Serif style={s.gameState}>{state}-GAME</Serif><View style={s.stateRow}>{(['A','B','C'] as GameState[]).map(x=><TouchableOpacity key={x} onPress={()=>setState(x)} style={[s.stateButton,state===x&&s.stateButtonActive]}><Text style={[s.stateText,state===x&&s.stateTextActive]}>{x}</Text></TouchableOpacity>)}</View></View>
    <TouchableOpacity style={s.cueBlock} onPress={()=>setCue((cue+1)%decisionCues.length)}><Label>DECISION CUE / TAP TO ROTATE</Label><Serif style={s.cueText}>“{decisionCues[cue]}”</Serif></TouchableOpacity>
    <TouchableOpacity style={s.audioBar} onPress={openAudio}><View style={s.play}><Ionicons name="play" size={18} color={C.ink}/></View><View style={s.flex}><Label>MENTAL PLAYLIST</Label><Text style={s.audioTitle}>A-GAME · DEEP FOCUS</Text><View style={s.track}><View style={[s.fill,{width:'43%'}]}/></View></View><Text style={s.audioTime}>18:42 / 45:00</Text></TouchableOpacity>
    <View style={s.twoCols}><PremiumButton label="CHECK-IN" secondary onPress={openCheckin} icon="pulse-outline"/><PremiumButton label="BREAK 4'" secondary onPress={openBreak} icon="pause-outline"/></View><PremiumButton label="ENCERRAR SESSÃO" secondary onPress={endSession} icon="stop-circle-outline"/>
  </ScrollView>;
}

function Debrief({ save, openDiary }: { save:()=>void; openDiary:()=>void }) {
  const [state,setState]=useState<GameState>('B'); const [triggers,setTriggers]=useState<string[]>([]); const toggle=(x:string)=>setTriggers(v=>v.includes(x)?v.filter(t=>t!==x):[...v,x]);
  return <ScrollView contentContainerStyle={s.scroll}><View style={s.lead}><Label>POST-SESSION / DEBRIEF</Label><Serif style={s.leadTitle}>Primeiro descarregue. Depois analise.</Serif><Text style={s.body}>Resultado financeiro é opcional. Aqui o foco é execução, estado e aderência ao processo.</Text></View><View style={s.panel}><Label>ESTADO PREDOMINANTE</Label><View style={s.stateRow}>{(['A','B','C'] as GameState[]).map(x=><TouchableOpacity key={x} onPress={()=>setState(x)} style={[s.stateButton,state===x&&s.stateButtonActive]}><Text style={[s.stateText,state===x&&s.stateTextActive]}>{x}</Text></TouchableOpacity>)}</View></View><View style={s.panel}><Label>O QUE ALTEROU SUA EXECUÇÃO?</Label><View style={s.chips}>{warRoomTriggers.map(x=><TouchableOpacity key={x} onPress={()=>toggle(x)} style={[s.chip,triggers.includes(x)&&s.chipActive]}><Text style={[s.chipText,triggers.includes(x)&&s.chipTextActive]}>{x}</Text></TouchableOpacity>)}</View></View><PremiumButton label="OPEN BATTLE DIARY" secondary onPress={openDiary} icon="mic-outline"/><PremiumButton label="SAVE SESSION" onPress={save}/></ScrollView>;
}

export function SessionScreen({ phase,setPhase,openModule,openBreak,openCheckin }: { phase:Phase; setPhase:(p:Phase)=>void; openModule:(m:Module)=>void; openBreak:()=>void; openCheckin:()=>void }) {
  return <Backdrop uri={PHOTO.session} blur={7} overlay={0.8}><SafeAreaView style={s.flex}><Header title="SESSION" subtitle={phase==='ready'?'PREPARATION':phase==='active'?'LIVE PERFORMANCE':'POST-SESSION'}/>{phase==='ready'?<Ready onStart={()=>setPhase('active')}/>:phase==='active'?<Active endSession={()=>setPhase('debrief')} openAudio={()=>openModule('audio')} openBreak={openBreak} openCheckin={openCheckin}/>:<Debrief save={()=>setPhase('ready')} openDiary={()=>openModule('diary')}/>}</SafeAreaView></Backdrop>;
}

import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../src/theme';
import { Backdrop, PremiumButton, Serif } from '../src/ui';
import { s } from '../src/styles';
import { Module, Phase, Tab } from '../src/types';
import { HomeScreen } from '../src/screens/HomeScreen';
import { SessionScreen } from '../src/screens/SessionScreen';
import { TrainScreen } from '../src/screens/TrainScreen';
import { CoachScreen } from '../src/screens/CoachScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { BreakOverlay, CheckinOverlay, ModuleOverlay, SOSOverlay } from '../src/overlays';

function Landing({ enter }: { enter:()=>void }) {
  return <Backdrop uri={PHOTO.welcome} blur={4} overlay={0.55}><SafeAreaView style={s.landing}><View style={s.landingTop}><AppText style={s.brandSmall}>STACKUP HOLD'EM / PERFORMANCE DIVISION</AppText><View style={s.goldDot}/></View><View style={s.landingCenter}><AppText style={s.eyebrow}>THE MENTAL PERFORMANCE SYSTEM</AppText><Serif style={s.endurance}>ENDURANCE</Serif><View style={s.shortRule}/><AppText style={s.quote}>Controle o processo.{`\n`}Aceite a variância.{`\n`}Proteja a próxima decisão.</AppText><View style={s.mantras}>{['FOCUS','DISCIPLINE','RESILIENCE','BETTER DECISIONS','A LONGER GAME'].map(x=><AppText key={x} style={s.mantra}>{x}</AppText>)}</View></View><View style={s.landingBottom}><PremiumButton label="ENTER ENDURANCE" onPress={enter}/><AppText style={s.landingFoot}>PERFORMANCE · MENTAL GAME · ENDURANCE</AppText></View></SafeAreaView></Backdrop>;
}

function BottomNav({ tab,setTab,openSOS }: { tab:Tab; setTab:(t:Tab)=>void; openSOS:()=>void }) {
  const items:{key:Tab;icon:keyof typeof Ionicons.glyphMap;label:string}[]=[{key:'home',icon:'home-outline',label:'HOME'},{key:'session',icon:'timer-outline',label:'SESSION'},{key:'train',icon:'barbell-outline',label:'TRAIN'},{key:'coach',icon:'chatbubble-ellipses-outline',label:'COACH'},{key:'profile',icon:'person-outline',label:'PROFILE'}];
  return <View style={s.nav}>{items.map(i=><TouchableOpacity key={i.key} style={s.navItem} onPress={()=>setTab(i.key)}><Ionicons name={i.icon} size={20} color={tab===i.key?C.goldLight:C.dim}/><AppText style={[s.navText,tab===i.key&&s.navTextActive]}>{i.label}</AppText></TouchableOpacity>)}<TouchableOpacity style={s.navSOS} onPress={openSOS}><AppText style={s.sosSmall}>SOS</AppText></TouchableOpacity></View>;
}

export default function Index() {
  const [entered,setEntered]=useState(false); const [tab,setTab]=useState<Tab>('home'); const [phase,setPhase]=useState<Phase>('ready'); const [module,setModule]=useState<Module|null>(null); const [sos,setSos]=useState(false); const [breakOpen,setBreakOpen]=useState(false); const [checkin,setCheckin]=useState(false);
  if(!entered) return <Landing enter={()=>setEntered(true)}/>;
  return <View style={s.root}>{tab==='home'?<HomeScreen startSession={()=>{setTab('session');setPhase('ready')}} openModule={setModule}/>:null}{tab==='session'?<SessionScreen phase={phase} setPhase={setPhase} openModule={setModule} openBreak={()=>setBreakOpen(true)} openCheckin={()=>setCheckin(true)}/>:null}{tab==='train'?<TrainScreen openModule={setModule}/>:null}{tab==='coach'?<CoachScreen/>:null}{tab==='profile'?<ProfileScreen openDiary={()=>setModule('diary')}/>:null}<BottomNav tab={tab} setTab={setTab} openSOS={()=>setSos(true)}/>{module?<ModuleOverlay module={module} close={()=>setModule(null)}/>:null}{breakOpen?<BreakOverlay close={()=>setBreakOpen(false)}/>:null}{checkin?<CheckinOverlay close={()=>setCheckin(false)}/>:null}{sos?<SOSOverlay close={()=>setSos(false)} goCoach={()=>{setSos(false);setTab('coach')}}/>:null}</View>;
}

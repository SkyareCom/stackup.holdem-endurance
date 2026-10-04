import React, { useCallback, useState } from 'react';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { C, PHOTO } from '../src/theme';
import { AppText, Backdrop, PremiumButton, Serif } from '../src/ui';
import { s } from '../src/styles';
import { Module, Phase, Tab } from '../src/types';
import { HomeScreen } from '../src/screens/HomeScreen';
import { SessionScreen } from '../src/screens/SessionScreen';
import { TrainScreen } from '../src/screens/TrainScreen';
import { CoachScreen } from '../src/screens/CoachScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { BreakOverlay, CheckinOverlay, ModuleOverlay, SOSOverlay } from '../src/overlays';
import { LanguageSelector } from '../src/components/LanguageSelector';
import { useI18n, type TranslationKey } from '../src/i18n';
import { usePerformance } from '../src/performanceStore';

function Landing({ enter }: { enter:()=>void }) {
  const { t } = useI18n();
  const mantraKeys: TranslationKey[] = [
    'landing.focus',
    'landing.discipline',
    'landing.resilience',
    'landing.betterDecisions',
    'landing.longerGame',
  ];

  return (
    <Backdrop uri={PHOTO.welcome} blur={4} overlay={0.55}>
      <SafeAreaView style={s.landing}>
        <View style={s.landingTop}>
          <AppText style={s.brandSmall}>{t('brand.stackup')} / {t('landing.division')}</AppText>
          <View style={s.goldDot}/>
        </View>
        <View style={s.landingCenter}>
          <AppText style={s.eyebrow}>{t('landing.system')}</AppText>
          <Serif style={s.endurance}>ENDURANCE</Serif>
          <View style={s.shortRule}/>
          <AppText style={s.quote}>{t('landing.quote')}</AppText>
          <View style={s.mantras}>{mantraKeys.map((key)=><AppText key={key} style={s.mantra}>{t(key)}</AppText>)}</View>
        </View>
        <View style={s.landingBottom}>
          <LanguageSelector variant="landing"/>
          <PremiumButton label={t('landing.enter')} onPress={enter}/>
          <AppText style={s.landingFoot}>{t('landing.footer')}</AppText>
        </View>
      </SafeAreaView>
    </Backdrop>
  );
}

function BottomNav({ tab,setTab,openSOS }: { tab:Tab; setTab:(t:Tab)=>void; openSOS:()=>void }) {
  const { t } = useI18n();
  const items:{key:Tab;icon:keyof typeof Ionicons.glyphMap;activeIcon:keyof typeof Ionicons.glyphMap;labelKey:TranslationKey}[]=[
    {key:'home',icon:'home-outline',activeIcon:'home',labelKey:'nav.home'},
    {key:'session',icon:'stopwatch-outline',activeIcon:'stopwatch',labelKey:'nav.session'},
    {key:'train',icon:'barbell-outline',activeIcon:'barbell',labelKey:'nav.train'},
    {key:'coach',icon:'chatbubbles-outline',activeIcon:'chatbubbles',labelKey:'nav.coach'},
    {key:'profile',icon:'person-circle-outline',activeIcon:'person-circle',labelKey:'nav.profile'},
  ];
  return <View style={s.nav}>{items.map(i=><TouchableOpacity key={i.key} style={s.navItem} onPress={()=>setTab(i.key)}><View style={[s.navIconWrap,tab===i.key&&s.navIconWrapActive]}><Ionicons name={tab===i.key?i.activeIcon:i.icon} size={21} color={tab===i.key?C.goldLight:C.dim}/></View><AppText style={[s.navText,tab===i.key&&s.navTextActive]}>{t(i.labelKey)}</AppText></TouchableOpacity>)}<TouchableOpacity style={s.navSOS} onPress={openSOS}><AppText style={s.sosSmall}>SOS</AppText></TouchableOpacity></View>;
}

export default function Index() {
  const { activeSession } = usePerformance();
  const [entered,setEntered]=useState(false); const [tab,setTab]=useState<Tab>('home'); const [phase,setPhase]=useState<Phase>('ready'); const [module,setModule]=useState<Module|null>(null); const [sos,setSos]=useState(false); const [breakOpen,setBreakOpen]=useState(false); const [checkin,setCheckin]=useState(false);

  useFocusEffect(useCallback(()=>{
    const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(!entered) return false;
      if(sos){setSos(false);return true;}
      if(checkin){setCheckin(false);return true;}
      if(breakOpen){setBreakOpen(false);return true;}
      if(module){setModule(null);return true;}
      if(tab!=='home'){setTab('home');return true;}
      return false;
    });
    return ()=>subscription.remove();
  },[entered,sos,checkin,breakOpen,module,tab]));

  if(!entered) return <Landing enter={()=>setEntered(true)}/>;
  return <View style={s.root}>{tab==='home'?<HomeScreen openPhase={(target)=>{setTab('session');setPhase(target==='active'&&!activeSession?'ready':target==='debrief'&&!activeSession?'ready':target)}} openModule={setModule}/>:null}{tab==='session'?<SessionScreen phase={phase} setPhase={setPhase} openModule={setModule} openBreak={()=>setBreakOpen(true)} openCheckin={()=>setCheckin(true)}/>:null}{tab==='train'?<TrainScreen openModule={setModule}/>:null}{tab==='coach'?<CoachScreen phase={phase}/>:null}{tab==='profile'?<ProfileScreen openDiary={()=>setModule('diary')}/>:null}<BottomNav tab={tab} setTab={setTab} openSOS={()=>setSos(true)}/>{module?<ModuleOverlay module={module} close={()=>setModule(null)}/>:null}{breakOpen?<BreakOverlay close={()=>setBreakOpen(false)}/>:null}{checkin?<CheckinOverlay close={()=>setCheckin(false)}/>:null}{sos?<SOSOverlay close={()=>setSos(false)} goCoach={()=>{setSos(false);setTab('coach')}}/>:null}</View>;
}

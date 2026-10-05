import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Backdrop, Header, Label, Serif } from '../ui';
import { PHOTO } from '../theme';
import { s } from '../styles';
import { useI18n, type TranslationKey } from '../i18n';
import { usePerformance } from '../performanceStore';

export type CoachMoment='prepare'|'playing'|'finished'|'report'|'recover';

const moments:{id:CoachMoment;key:TranslationKey;body:TranslationKey}[]=[
 {id:'prepare',key:'coachEntry.prepare',body:'coachEntry.prepareBody'},
 {id:'playing',key:'coachEntry.playing',body:'coachEntry.playingBody'},
 {id:'finished',key:'coachEntry.finished',body:'coachEntry.finishedBody'},
 {id:'report',key:'coachEntry.report',body:'coachEntry.reportBody'},
 {id:'recover',key:'coachEntry.recover',body:'coachEntry.recoverBody'},
];

export function CoachEntryScreen({select}:{select:(m:CoachMoment)=>void}){
 const {t}=useI18n();const {profile}=usePerformance();const [intro,setIntro]=useState(true);
 return <Backdrop uri={PHOTO.focus}><SafeAreaView style={s.flex}><Header title="ENDURANCE" subtitle={t('coachEntry.subtitle')}/><ScrollView contentContainerStyle={s.scroll}>
  {intro?<View style={s.lead}><Label>{t('coachEntry.label')}</Label><Serif style={s.leadTitle}>{t('coachEntry.welcome')}</Serif><AppText style={s.body}>{t('coachEntry.intro')}</AppText><TouchableOpacity style={[s.guidedToolRow,{marginTop:16}]} onPress={()=>setIntro(false)}><View style={{flex:1}}><Serif style={s.guidedToolTitle}>{t('coachEntry.start')}</Serif><AppText style={s.guidedToolBody}>{t('coachEntry.startBody')}</AppText></View></TouchableOpacity></View>:
  <><View style={s.lead}><Label>{t('coachEntry.now')}</Label><Serif style={s.leadTitle}>{t('coachEntry.question')}</Serif><AppText style={s.body}>{t('coachEntry.questionBody')}</AppText></View>
  <View style={s.panel}>{moments.map(m=><TouchableOpacity key={m.id} style={s.guidedToolRow} onPress={()=>select(m.id)}><View style={{flex:1,minWidth:0}}><Serif style={s.guidedToolTitle}>{t(m.key)}</Serif><AppText style={s.guidedToolBody}>{t(m.body)}</AppText></View></TouchableOpacity>)}</View>
  <View style={s.panel}><Label>{t('coachEntry.lifestyle')}</Label><AppText style={s.body}>{t('coachEntry.lifestyleBody')}</AppText><AppText style={s.guidedToolBody}>{t('coachEntry.lifestyleSnapshot',{sleep:String(profile.lifestyle.sleepHours),meal:String(profile.lifestyle.hoursSinceMeal),move:String(profile.lifestyle.movementMinutes)})}</AppText></View></>}
 </ScrollView></SafeAreaView></Backdrop>;
}

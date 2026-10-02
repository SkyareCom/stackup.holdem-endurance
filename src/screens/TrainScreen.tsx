import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, Serif } from '../ui';
import { GuidedSection } from '../components/GuidedSection';
import { developmentGroups } from '../content';
import { usePerformance } from '../performanceStore';
import { s } from '../styles';
import { Module, moduleMeta } from '../types';
import { useI18n, type TranslationKey } from '../i18n';

type Need='focus'|'slow'|'recover'|'sleep';
const needs:{id:Need;key:TranslationKey;modules:Module[]}[]=[
  {id:'focus',key:'need.focus',modules:['gym','audio']},
  {id:'slow',key:'need.slow',modules:['audio','mindset']},
  {id:'recover',key:'need.recover',modules:['war','audio']},
  {id:'sleep',key:'need.sleep',modules:['lifestyle','audio']},
];

export function TrainScreen({ openModule }: { openModule:(m:Module)=>void }) {
  const { t } = useI18n();
  const { baseline }=usePerformance();
  const [need,setNeed]=useState<Need>('focus');
  const [selectedDevelopmentGroup,setSelectedDevelopmentGroup]=useState(0);
  const selected=needs.find(x=>x.id===need)??needs[0];
  const development=developmentGroups[selectedDevelopmentGroup];
  const reserve=baseline.confidence==='moderate'||baseline.confidence==='high'?Math.round(baseline.averageMentalEv*10):null;

  return (
    <Backdrop uri={PHOTO.focus} blur={12} overlay={0.84}>
      <SafeAreaView style={s.flex}>
        <Header title={t('train.title')} subtitle={t('train.subtitle')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <GuidedSection subtitle={t('train.need')} title={t('train.lead')} description={t('train.needBody')}>
            <View style={s.processGrid}>{needs.map(item=><TouchableOpacity key={item.id} onPress={()=>setNeed(item.id)} style={[s.processChip,need===item.id&&s.chipActive]}><AppText style={[s.chipText,need===item.id&&s.chipTextActive]}>{t(item.key)}</AppText></TouchableOpacity>)}</View>
          </GuidedSection>

          <View style={s.panel}>
            <Label>{t('train.recommendedForNeed')}</Label>
            {selected.modules.map(module=>{
              const meta=moduleMeta[module];
              return <TouchableOpacity key={module} style={s.trainingModuleRow} onPress={()=>openModule(module)}>
                <View style={s.moduleIcon}><Ionicons name={meta.icon} size={20} color={C.goldLight}/></View>
                <View style={s.flex}><Serif style={s.moduleTitle}>{t(meta.titleKey).toUpperCase()}</Serif><AppText style={s.moduleSub}>{t(meta.subtitleKey)}</AppText></View>
                <Ionicons name="chevron-forward" size={18} color={C.goldLight}/>
              </TouchableOpacity>;
            })}
          </View>

          <View style={s.profileSection}>
            <Label>{t('train.development')}</Label>
            <AppText style={s.body}>{t('train.developmentBody')}</AppText>
            <View style={s.panel}>
              <View style={s.rowBetween}>
                <TouchableOpacity style={s.close} onPress={()=>setSelectedDevelopmentGroup(i=>(i-1+developmentGroups.length)%developmentGroups.length)}><Ionicons name="chevron-back" size={22} color={C.goldLight}/></TouchableOpacity>
                <AppText style={s.goldText}>{selectedDevelopmentGroup+1} / {developmentGroups.length}</AppText>
                <TouchableOpacity style={s.close} onPress={()=>setSelectedDevelopmentGroup(i=>(i+1)%developmentGroups.length)}><Ionicons name="chevron-forward" size={22} color={C.goldLight}/></TouchableOpacity>
              </View>
              <Serif style={s.actionTitle}>{t(development.titleKey)}</Serif>
              <AppText style={s.body}>{t(development.bodyKey)}</AppText>
            </View>
          </View>

          <View style={s.profileSection}>
            <Label>{t('train.mentalReserve')}</Label>
            {reserve===null?<AppText style={s.body}>{t('train.reserveInsufficient')}</AppText>:<View style={s.readingCard}>
              <Serif style={s.heroNumber}>{reserve}</Serif>
              <View style={s.track}><View style={[s.fill,{width:`${reserve}%`}]} /></View>
              <AppText style={s.body}>{t('train.reserveMeaning')}</AppText>
            </View>}
          </View>

          <View style={s.guidedBlock}><Label>{t('evidence.title')}</Label><AppText style={s.body}>{t('evidence.body')}</AppText></View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

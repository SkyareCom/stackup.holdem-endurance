import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PHOTO, C } from '../theme';
import { AppText, Backdrop, GoldRule, Header, Label, Serif } from '../ui';
import { s } from '../styles';
import { Module } from '../types';
import { useI18n } from '../i18n';

function Metric({ label, value }: { label: string; value: number }) {
  return <View style={s.metric}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.metricValue}>{value}/5</AppText></View><View style={s.track}><View style={[s.fill,{width:`${value*20}%`}]} /></View></View>;
}

export function HomeScreen({ startSession, openModule }: { startSession: () => void; openModule: (m: Module) => void }) {
  const { t } = useI18n();

  return (
    <Backdrop uri={PHOTO.focus}>
      <SafeAreaView style={s.flex}>
        <Header title="ENDURANCE" subtitle={t('home.subtitle')} />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.heroPanel}>
            <View style={s.rowBetweenTop}>
              <View style={s.flex}><Label>{t('home.readiness')}</Label><Serif style={s.heroNumber}>82</Serif><AppText style={s.body}>{t('home.readinessBody')}</AppText></View>
              <View style={s.ring}><Serif style={s.grade}>A-</Serif><AppText style={s.ringLabel}>{t('home.baseline')}</AppText></View>
            </View>
            <GoldRule /><Metric label={t('home.energy')} value={4}/><Metric label={t('home.focus')} value={4}/><Metric label={t('home.tension')} value={2}/>
          </View>

          <TouchableOpacity activeOpacity={0.72} style={s.primaryAction} onPress={startSession}>
            <View style={s.flex}><Label>{t('home.primaryAction')}</Label><Serif style={s.primaryTitle}>{t('home.startSession')}</Serif><AppText style={s.body}>{t('home.startSessionBody')}</AppText></View>
            <Ionicons name="arrow-forward" size={23} color={C.goldLight}/>
          </TouchableOpacity>

          <View style={s.intelligence}>
            <View style={s.rowBetween}><Label>{t('home.intelligence')}</Label><AppText style={s.goldText}>02:55 → 03:30</AppText></View>
            <Serif style={s.intelligenceTitle}>{t('home.protectThirdBlock')}</Serif>
            <AppText style={s.body}>{t('home.intelligenceBody')}</AppText>
          </View>

          <View style={s.quickGrid}>
            <TouchableOpacity activeOpacity={0.72} style={s.quickCard} onPress={()=>openModule('audio')}><Ionicons name="headset-outline" size={24} color={C.goldLight}/><Label>{t('home.mentalAudio')}</Label><Serif style={s.quickTitle}>{t('home.lockIn')}</Serif><AppText style={s.quickCopy}>{t('home.quickFocus')}</AppText></TouchableOpacity>
            <TouchableOpacity activeOpacity={0.72} style={s.quickCard} onPress={()=>openModule('war')}><Ionicons name="analytics-outline" size={24} color={C.goldLight}/><Label>{t('home.warRoom')}</Label><Serif style={s.quickTitle}>{t('home.heatmap')}</Serif><AppText style={s.quickCopy}>{t('home.patternsTriggers')}</AppText></TouchableOpacity>
          </View>

          <View style={s.editorial}><Label>{t('home.decisionCue')}</Label><Serif style={s.editorialText}>“{t('home.decisionCueText')}”</Serif></View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

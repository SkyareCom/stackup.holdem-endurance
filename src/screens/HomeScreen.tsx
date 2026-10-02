import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PHOTO, C } from '../theme';
import { AppText, Backdrop, GoldRule, Header, Label, PremiumButton, Serif } from '../ui';
import { GuidedSection } from '../components/GuidedSection';
import { getHistoryGuidance, getReadinessGuidance } from '../guidance';
import { s } from '../styles';
import { Module } from '../types';
import { useI18n } from '../i18n';

function Metric({ label, value }: { label: string; value: number }) {
  return <View style={s.metric}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.metricValue}>{value}/5</AppText></View><View style={s.track}><View style={[s.fill,{width:`${value*20}%`}]} /></View></View>;
}

export function HomeScreen({ startSession, openModule }: { startSession: () => void; openModule: (m: Module) => void }) {
  const { t } = useI18n();
  const snapshot = { energy: 4, focus: 4, tension: 2 };
  const readiness = getReadinessGuidance(snapshot);
  const hasHistory = false;
  const history = getHistoryGuidance({ hasHistory, thirdBlockDrop: false });
  const focus = history ?? readiness;
  const hasHistoricalBreak = focus.actionId==='break-4';
  const actionTitle = hasHistoricalBreak ? t('home.prepareBreak') : t('home.startSession');
  const actionBody = hasHistoricalBreak ? t('home.recommendedActionBody') : t('home.startSessionBody');

  return (
    <Backdrop uri={PHOTO.focus}>
      <SafeAreaView style={s.flex}>
        <Header title="ENDURANCE" subtitle={t('home.subtitle')} />
        <ScrollView contentContainerStyle={s.scroll}>
          <GuidedSection
            subtitle={t('home.stateToday')}
            title={t('home.readinessTitle')}
            description={t('home.readinessBody')}
          >
            <View style={s.heroPanel}>
              <View style={s.rowBetweenTop}>
                <View style={s.flex}><Label>{t('home.readiness')}</Label><Serif style={s.heroNumber}>82</Serif></View>
                <View style={s.ring}><Serif style={s.grade}>A-</Serif><AppText style={s.ringLabel}>{t('home.baseline')}</AppText></View>
              </View>
              <GoldRule />
              <Metric label={t('home.energy')} value={snapshot.energy}/>
              <Metric label={t('home.focus')} value={snapshot.focus}/>
              <Metric label={t('home.tension')} value={snapshot.tension}/>
            </View>
          </GuidedSection>

          <GuidedSection
            subtitle={t('home.meaning')}
            title={t('home.meaningTitle')}
            description={t(readiness.reasonKey)}
            result={t(readiness.bodyKey)}
          />

          <GuidedSection
            subtitle={t('home.focusOfDay')}
            title={t(focus.titleKey)}
            description={t(focus.bodyKey)}
          >
            {hasHistory?<>
              <View style={s.guidedInline}>
                <Label>{t('home.intelligence')}</Label>
                <AppText style={s.goldText}>{t('home.historyWindow')}</AppText>
              </View>
              <AppText style={s.body}>{t(focus.reasonKey)}</AppText>
            </>:<AppText style={s.body}>{t('common.insufficientData')}</AppText>}
          </GuidedSection>

          <GuidedSection
            subtitle={t('home.recommendedAction')}
            title={actionTitle}
            description={actionBody}
          >
            <AppText style={s.goldText}>{t('home.primaryAction')}</AppText>
            <PremiumButton label={t('home.startWithPlan')} onPress={startSession}/>
          </GuidedSection>

          <GuidedSection
            subtitle={t('home.toolsForThis')}
            title={t('home.toolsTitle')}
            description={t('home.toolsBody')}
          >
            {focus.actionId==='break-4'?<TouchableOpacity style={s.guidedToolRow} onPress={()=>openModule('audio')}>
              <Ionicons name="pause-circle-outline" size={24} color={C.goldLight}/>
              <View style={s.flex}>
                <Label>{t('home.break4Tool')}</Label>
                <Serif style={s.guidedToolTitle}>{t('home.break4Title')}</Serif>
                <AppText style={s.guidedToolBody}>{t('home.break4Body')}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.goldLight}/>
            </TouchableOpacity>:null}
            <TouchableOpacity style={s.guidedToolRow} onPress={()=>openModule('audio')}>
              <Ionicons name="headset-outline" size={24} color={C.goldLight}/>
              <View style={s.flex}>
                <Label>{t('home.mentalAudio')}</Label>
                <Serif style={s.guidedToolTitle}>{t('home.lockIn')}</Serif>
                <AppText style={s.guidedToolBody}>{t('home.lockInBody')}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.goldLight}/>
            </TouchableOpacity>
          </GuidedSection>

          <GuidedSection
            subtitle={t('home.decisionCue')}
            title={t('home.decisionCueTitle')}
            description={t('home.decisionCueText')}
          >
            <AppText style={s.body}>{t('home.decisionCueWhy')}</AppText>
          </GuidedSection>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

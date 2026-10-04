import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { GuidedSection } from '../components/GuidedSection';
import {
  calculateReadiness,
  classifyTiltRisk,
  deriveMentalState,
  getSessionAction,
  type MentalState,
  type SessionAction,
  type TiltRisk,
} from '../performanceEngine';
import { usePerformance } from '../performanceStore';
import { buildPerformanceCare } from '../performanceCare';
import { s } from '../styles';
import { Module } from '../types';
import { useI18n, type TranslationKey } from '../i18n';

const riskKey:Record<TiltRisk,TranslationKey>={
  low:'risk.low',medium:'risk.medium',critical:'risk.critical',
};
const stateKey:Record<MentalState,TranslationKey>={
  centered:'mentalState.centered',alert:'mentalState.alert',vulnerable:'mentalState.vulnerable',
  dysregulated:'mentalState.dysregulated',tilt:'mentalState.tilt',
};
const actionKey:Record<SessionAction,TranslationKey>={
  continue:'action.continue','check-in':'action.check-in','break-4':'action.break-4',
  contain:'action.contain','stop-session':'action.stop-session',
};

export function HomeScreen({ startSession, openModule: _openModule }: { startSession: () => void; openModule: (m: Module) => void }) {
  const { t } = useI18n();
  const { latestCheckin,activeSession,sessions,baseline,profile } = usePerformance();
  const dailyCare=buildPerformanceCare(profile.lifestyle);
  const carePriority=dailyCare.find(x=>x.priority!==\'ready\')??dailyCare[0];

  if(!latestCheckin){
    return <Backdrop uri={PHOTO.focus}>
      <SafeAreaView style={s.flex}>
        <Header title="ENDURANCE" subtitle={t('home.subtitle')} />
        <ScrollView contentContainerStyle={s.scroll}>
          <GuidedSection
            subtitle={t('home.stateToday')}
            title={t('home.noCheckinTitle')}
            description={t('home.noCheckinBody')}
          >
            <View style={s.guidedBlock}>
              <Label>{t('coachJourney.notice')}</Label>
              <AppText style={s.body}>{t('coachJourney.noticeBody')}</AppText>
            </View>
            <PremiumButton label={t('home.checkinNow')} onPress={startSession}/>
          </GuidedSection>
          <View style={s.panel}>
            <Label>{t('home.historySummary')}</Label>
            <Serif style={s.actionTitle}>{sessions.length}</Serif>
            <AppText style={s.body}>{sessions.length?t('profile.developmentBody'):t('common.insufficientData')}</AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>;
  }

  const readinessIndex=calculateReadiness(latestCheckin);
  const tiltRisk=classifyTiltRisk(latestCheckin);
  const minutes=activeSession?Math.max(0,Math.floor((Date.now()-activeSession.startedAt)/60000)):0;
  const lastRuntime=activeSession?.checkins[activeSession.checkins.length-1];
  const mentalState=deriveMentalState({readinessIndex,tiltRisk,sessionMinutes:minutes,focus:lastRuntime?.focus??latestCheckin.mentalDrive,tension:lastRuntime?.tension??latestCheckin.tension,impulse:lastRuntime?.impulse??latestCheckin.impulse,fatigue:lastRuntime?.fatigue??latestCheckin.fatigue});
  const action=getSessionAction({
    mode:activeSession?.plan.mode??'cash',
    canLeave:activeSession?.plan.canLeave??true,
    tiltRisk,
    fatigue:lastRuntime?.fatigue??latestCheckin.fatigue,
    focus:lastRuntime?.focus??latestCheckin.mentalDrive,
    tension:lastRuntime?.tension??latestCheckin.tension,
    minFocus:profile.stopRules.minFocus,
    maxTension:profile.stopRules.maxTension,
  });

  return (
    <Backdrop uri={PHOTO.focus}>
      <SafeAreaView style={s.flex}>
        <Header title="ENDURANCE" subtitle={t('home.subtitle')} />
        <ScrollView contentContainerStyle={s.scroll}>
          <GuidedSection
            subtitle={t('home.latestCheckin')}
            title={t('home.readinessTitle')}
          >
            <View style={s.heroPanel}>
              <View style={s.rowBetween}>
                <View><Label>{t('pregrind.readiness')}</Label><Serif style={s.heroNumber}>{readinessIndex}</Serif></View>
                <View><Label>{t('home.risk')}</Label><Serif style={s.actionTitle}>{t(riskKey[tiltRisk])}</Serif></View>
              </View>
              <View style={s.rule}/>
              <View style={s.rowBetween}>
                <View><Label>{t('home.mentalState')}</Label><AppText style={s.body}>{t(stateKey[mentalState])}</AppText></View>
                <View><Label>{t('profile.confidence')}</Label><AppText style={s.body}>{t(({
                  none:'confidence.none',low:'confidence.low',moderate:'confidence.moderate',high:'confidence.high',
                } as const)[baseline.confidence])}</AppText></View>
              </View>
            </View>
          </GuidedSection>

          <GuidedSection
            subtitle={t('coachJourney.decide')}
            title={t('coachJourney.nextDecision')}
            description={t('coachJourney.nextDecisionBody')}
          />

          <GuidedSection
            subtitle={t('home.nextAction')}
            title={activeSession?t(actionKey[action]):t('pregrind.title')}
            description={activeSession?t('session.protectTempoBody'):t('pregrind.reframeBody')}
          >
            <PremiumButton label={activeSession?t('nav.session'):t('home.checkinNow')} onPress={startSession}/>
          </GuidedSection>

          <GuidedSection
            subtitle="PERFORMANCE CARE"
            title={carePriority.title}
            description={carePriority.action}
          />

          <GuidedSection
            subtitle={t('home.decisionCue')}
            title={t('home.decisionCueTitle')}
            description={t('home.decisionCueText')}
          />
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

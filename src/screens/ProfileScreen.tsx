import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { LanguageSelector } from '../components/LanguageSelector';
import { buildDevelopmentSnapshot, buildSportPsychologySnapshot, buildTiltProfile, type Temperament, type TiltTrigger } from '../performanceEngine';
import { usePerformance } from '../performanceStore';
import { buildPerformanceCare, PERFORMANCE_CARE_EVIDENCE } from '../performanceCare';
import { useI18n, type TranslationKey } from '../i18n';

const temperaments:{id:Temperament;key:TranslationKey}[]=[
  {id:'impulsive',key:'temperament.impulsive'},{id:'passive',key:'temperament.passive'},
  {id:'perfectionist',key:'temperament.perfectionist'},{id:'analytical',key:'temperament.analytical'},
];
const triggerKeys:Record<TiltTrigger,TranslationKey>={
  'bad-beat':'trigger.badBeat','own-error':'trigger.ownError',anger:'trigger.anger',rush:'trigger.rush',
  fear:'trigger.fear',euphoria:'trigger.euphoria',fatigue:'trigger.fatigue',autopilot:'trigger.autopilot',
  revenge:'trigger.revenge',personal:'trigger.personal',
};

function SmallScale({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}) {
  return <View style={s.scaleBlock}><View style={s.rowBetween}><Label>{label}</Label><AppText style={s.goldText}>{value}/10</AppText></View>
    <View style={s.scoreGrid}>{[0,2,4,6,8,10].map(n=><TouchableOpacity key={n} onPress={()=>onChange(n)} style={[s.scoreCell,value===n&&s.chipActive]}><AppText style={[s.chipText,value===n&&s.chipTextActive]}>{n}</AppText></TouchableOpacity>)}</View>
  </View>;
}

export function ProfileScreen({ openDiary }: { openDiary:()=>void }) {
  const { t } = useI18n();
  const router = useRouter();
  const { profile,updateProfile,updateExtraGrind,updateLifestyle,updateStopRules,sessions,baseline,clearHistory }=usePerformance();
  const developmentSnapshot=buildDevelopmentSnapshot(sessions);
  const tiltProfile=buildTiltProfile(sessions);
  const sportPsychology=buildSportPsychologySnapshot(sessions);
  const analyticsUsable=baseline.confidence!=='none';
  const [analyticsExpanded,setAnalyticsExpanded]=useState(false);
  const careActions=buildPerformanceCare(profile.lifestyle);

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.88}>
      <SafeAreaView style={s.flex}>
        <Header title={t('profile.title')} subtitle={t('profile.stackupId')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.profileSection}>
            <Label>{t('profile.base')}</Label>
            <View style={s.panel}>
              <Label>{t('profile.temperament')}</Label>
              <View style={s.processGrid}>{temperaments.map(item=><TouchableOpacity key={item.id} onPress={()=>updateProfile({temperament:item.id})} style={[s.processChip,profile.temperament===item.id&&s.chipActive]}><AppText style={[s.chipText,profile.temperament===item.id&&s.chipTextActive]}>{t(item.key)}</AppText></TouchableOpacity>)}</View>
            </View>
            <View style={s.panel}>
              <Label>{t('profile.extraGrind')}</Label>
              <SmallScale label={t('profile.sleep')} value={profile.extraGrind.sleep} onChange={sleep=>updateExtraGrind({sleep})}/>
              <SmallScale label={t('profile.personalStress')} value={profile.extraGrind.personalStress} onChange={personalStress=>updateExtraGrind({personalStress})}/>
              <SmallScale label={t('profile.financialStress')} value={profile.extraGrind.financialStress} onChange={financialStress=>updateExtraGrind({financialStress})}/>
              <SmallScale label={t('pregrind.nutrition')} value={profile.extraGrind.nutrition} onChange={nutrition=>updateExtraGrind({nutrition})}/>
              <SmallScale label={t('pregrind.hydration')} value={profile.extraGrind.hydration} onChange={hydration=>updateExtraGrind({hydration})}/>
              <SmallScale label={t('pregrind.activity')} value={profile.extraGrind.physicalActivity} onChange={physicalActivity=>updateExtraGrind({physicalActivity})}/>
            </View>
            <View style={s.panel}>
              <Label>{t('profile.stopRules')}</Label>
              <View style={s.guidedBlock}><Label>{t('profile.maxDuration')}</Label><View style={s.processGrid}>{[120,180,240].map(v=><TouchableOpacity key={v} onPress={()=>updateStopRules({maxDurationMinutes:v})} style={[s.processChip,profile.stopRules.maxDurationMinutes===v&&s.chipActive]}><AppText style={[s.chipText,profile.stopRules.maxDurationMinutes===v&&s.chipTextActive]}>{v}</AppText></TouchableOpacity>)}</View></View>
              <View style={s.guidedBlock}><Label>{t('profile.maxReentries')}</Label><View style={s.processGrid}>{[0,1,2].map(v=><TouchableOpacity key={v} onPress={()=>updateStopRules({maxReentries:v})} style={[s.processChip,profile.stopRules.maxReentries===v&&s.chipActive]}><AppText style={[s.chipText,profile.stopRules.maxReentries===v&&s.chipTextActive]}>{v}</AppText></TouchableOpacity>)}</View></View>
              <View style={s.guidedBlock}><Label>{t('profile.minFocus')}</Label><View style={s.processGrid}>{[3,4,5].map(v=><TouchableOpacity key={v} onPress={()=>updateStopRules({minFocus:v})} style={[s.processChip,profile.stopRules.minFocus===v&&s.chipActive]}><AppText style={[s.chipText,profile.stopRules.minFocus===v&&s.chipTextActive]}>{v}</AppText></TouchableOpacity>)}</View></View>
              <View style={s.guidedBlock}><Label>{t('profile.maxTension')}</Label><View style={s.processGrid}>{[6,7,8].map(v=><TouchableOpacity key={v} onPress={()=>updateStopRules({maxTension:v})} style={[s.processChip,profile.stopRules.maxTension===v&&s.chipActive]}><AppText style={[s.chipText,profile.stopRules.maxTension===v&&s.chipTextActive]}>{v}</AppText></TouchableOpacity>)}</View></View>
              <TouchableOpacity onPress={()=>updateStopRules({noStakeIncrease:!profile.stopRules.noStakeIncrease})} style={[s.option,profile.stopRules.noStakeIncrease&&s.optionActive]}><AppText style={[s.optionText,profile.stopRules.noStakeIncrease&&s.optionTextActive]}>{t('profile.noStakeIncrease')}</AppText></TouchableOpacity>
            </View>
          </View>

          <View style={s.profileSection}>
            <Label>PERFORMANCE CARE</Label>
            <AppText style={s.body}>Seu corpo também joga. O ENDURANCE cruza recuperação, alimentação, hidratação e movimento para proteger a qualidade das próximas decisões.</AppText>
            <View style={s.panel}>
              {careActions.map((item,index)=><View key={item.priority} style={index?s.guidedBlock:undefined}>
                <View style={s.rowBetween}><Serif style={s.actionTitle}>{item.title}</Serif><AppText style={s.goldText}>{item.severity==='high'?'PRIORIDADE':item.severity==='attention'?'ATENÇÃO':'OK'}</AppText></View>
                <AppText style={s.body}>{item.action}</AppText>
              </View>)}
            </View>
            <View style={s.panel}>
              <Label>CHECK-IN LIFESTYLE / HOJE</Label>
              <SmallScale label="HORAS DE SONO" value={Math.round(profile.lifestyle.sleepHours)} onChange={sleepHours=>updateLifestyle({sleepHours})}/>
              <SmallScale label="QUALIDADE DO SONO" value={profile.lifestyle.sleepQuality} onChange={sleepQuality=>updateLifestyle({sleepQuality})}/>
              <SmallScale label="HIDRATAÇÃO" value={profile.lifestyle.hydration} onChange={hydration=>updateLifestyle({hydration})}/>
              <SmallScale label="QUALIDADE DA ALIMENTAÇÃO" value={profile.lifestyle.mealQuality} onChange={mealQuality=>updateLifestyle({mealQuality})}/>
              <SmallScale label="HORAS DESDE A ÚLTIMA REFEIÇÃO" value={profile.lifestyle.hoursSinceMeal} onChange={hoursSinceMeal=>updateLifestyle({hoursSinceMeal})}/>
              <SmallScale label="MOVIMENTO HOJE / MIN ÷ 6" value={Math.round(profile.lifestyle.movementMinutes/6)} onChange={v=>updateLifestyle({movementMinutes:v*6})}/>
              <SmallScale label="HORAS SENTADO" value={profile.lifestyle.sittingHours} onChange={sittingHours=>updateLifestyle({sittingHours})}/>
              <SmallScale label="CAFEÍNA / 50 MG" value={Math.min(10,Math.round(profile.lifestyle.caffeineMg/50))} onChange={v=>updateLifestyle({caffeineMg:v*50,caffeineHoursAgo:v?profile.lifestyle.caffeineHoursAgo:24})}/>
              <TouchableOpacity onPress={()=>updateLifestyle({painOrIllness:!profile.lifestyle.painOrIllness})} style={[s.option,profile.lifestyle.painOrIllness&&s.optionActive]}><AppText style={[s.optionText,profile.lifestyle.painOrIllness&&s.optionTextActive]}>DOR, MAL-ESTAR OU DOENÇA HOJE: {profile.lifestyle.painOrIllness?'SIM':'NÃO'}</AppText></TouchableOpacity>
            </View>
            <View style={s.panel}>
              <Label>BASE DE PERFORMANCE</Label>
              <AppText style={s.body}>{PERFORMANCE_CARE_EVIDENCE.sleep}</AppText>
              <AppText style={s.body}>{PERFORMANCE_CARE_EVIDENCE.movement}</AppText>
              <AppText style={s.body}>{PERFORMANCE_CARE_EVIDENCE.nutrition}</AppText>
              <AppText style={s.body}>{PERFORMANCE_CARE_EVIDENCE.hydration}</AppText>
              <AppText style={s.body}>{PERFORMANCE_CARE_EVIDENCE.safety}</AppText>
            </View>
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.evolution')}</Label>
            {sessions.length?<View style={s.panel}>
              <View style={s.rowBetween}><View><Label>{t('profile.avgReadiness')}</Label><Serif style={s.actionTitle}>{baseline.averageReadiness}</Serif></View><View><Label>{t('profile.avgMentalEv')}</Label><Serif style={s.actionTitle}>{baseline.averageMentalEv.toFixed(1)}</Serif></View></View>
              <View style={s.rowBetween}><View><Label>{t('profile.avgDuration')}</Label><AppText style={s.body}>{baseline.averageDurationMinutes}</AppText></View><View><Label>{t('profile.confidence')}</Label><AppText style={s.goldText}>{t(({
                none:'confidence.none',low:'confidence.low',moderate:'confidence.moderate',high:'confidence.high',
              } as const)[baseline.confidence])}</AppText></View></View>
            </View>:<>
              <AppText style={s.body}>{t('profile.evolutionInsufficient')}</AppText>
              <AppText style={s.body}>{t('profile.evolutionCollect')}</AppText>
            </>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.development')}</Label>
            <AppText style={s.body}>{t('profile.developmentBody')}</AppText>
            {sessions.length?<View style={s.panel}>
              <View style={s.rowBetween}><Label>{t('development.discipline.title')}</Label><AppText style={s.goldText}>{developmentSnapshot.discipline}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('development.focus.title')}</Label><AppText style={s.goldText}>{developmentSnapshot.focus}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('development.resilience.title')}</Label><AppText style={s.goldText}>{developmentSnapshot.resilience}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('development.logic.title')}</Label><AppText style={s.goldText}>{developmentSnapshot.logic}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('development.lifestyle.title')}</Label><AppText style={s.goldText}>{developmentSnapshot.lifestyle}/10</AppText></View>
            </View>:<AppText style={s.body}>{t('common.insufficientData')}</AppText>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('sportPsych.title')}</Label>
            <AppText style={s.body}>{t('sportPsych.body')}</AppText>
            {sessions.length?<View style={s.panel}>
              <View style={s.rowBetween}><Label>{t('sportPsych.attention')}</Label><AppText style={s.goldText}>{sportPsychology.attentionStability}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('sportPsych.impulse')}</Label><AppText style={s.goldText}>{sportPsychology.impulseRegulation}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('sportPsych.pressure')}</Label><AppText style={s.goldText}>{sportPsychology.pressureRegulation}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('sportPsych.process')}</Label><AppText style={s.goldText}>{sportPsychology.processAdherence}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('sportPsych.fatigue')}</Label><AppText style={s.goldText}>{sportPsychology.mentalFatigueLoad}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('sportPsych.adversity')}</Label><AppText style={s.goldText}>{sportPsychology.adversityResponse}/10</AppText></View>
              <View style={s.rowBetween}><Label>{t('resilience.recoveryTime')}</Label><AppText style={s.goldText}>{sportPsychology.recoveryEfficiency===null?'—':sportPsychology.recoveryEfficiency+' min'}</AppText></View>
              <View style={s.rule}/>
              <View style={s.rowBetween}><Label>{t('profile.confidence')}</Label><AppText style={s.goldText}>{t(({
                none:'confidence.none',low:'confidence.low',moderate:'confidence.moderate',high:'confidence.high',
              } as const)[sportPsychology.confidence])}</AppText></View>
              <AppText style={s.body}>{t('sportPsych.caution')}</AppText>
            </View>:<AppText style={s.body}>{t('common.insufficientData')}</AppText>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.patterns')}</Label>
            {sessions.length?<View style={s.panel}>
              <Label>{t('profile.tiltDNA')}</Label>
              <AppText style={s.body}>{t('profile.tiltDNABody')}</AppText>
              {tiltProfile.length?tiltProfile.slice(0,3).map(item=><View key={item.trigger} style={s.rowBetween}><AppText style={s.body}>{t(triggerKeys[item.trigger])}</AppText><AppText style={s.goldText}>{item.count}</AppText></View>):<AppText style={s.body}>{t('profile.patternsCollect')}</AppText>}
              <TouchableOpacity style={s.coachContextToggle} onPress={()=>setAnalyticsExpanded(v=>!v)}><AppText style={s.coachContextToggleText}>{t(analyticsExpanded?'profile.hideAnalytics':'profile.showAnalytics')}</AppText><Ionicons name={analyticsExpanded?'chevron-up':'chevron-down'} size={18} color={C.goldLight}/></TouchableOpacity>
              {analyticsExpanded?<View style={s.contextList}>
                <AppText style={s.body}>{t('profile.correlationBody')}</AppText>
                <View style={s.rowBetween}><Label>{t('profile.resultCorrelation')}</Label><AppText style={s.goldText}>{analyticsUsable&&baseline.resultCorrelation!==null?baseline.resultCorrelation.toFixed(2):'—'}</AppText></View>
                <View style={s.rowBetween}><Label>{t('profile.sleepCorrelation')}</Label><AppText style={s.goldText}>{analyticsUsable&&baseline.sleepToMentalEvCorrelation!==null?baseline.sleepToMentalEvCorrelation.toFixed(2):'—'}</AppText></View>
                <View style={s.rowBetween}><Label>{t('profile.stressCorrelation')}</Label><AppText style={s.goldText}>{analyticsUsable&&baseline.stressToMentalEvCorrelation!==null?baseline.stressToMentalEvCorrelation.toFixed(2):'—'}</AppText></View>
                <View style={s.rowBetween}><Label>{t('profile.readinessCorrelation')}</Label><AppText style={s.goldText}>{analyticsUsable&&baseline.readinessToMentalEvCorrelation!==null?baseline.readinessToMentalEvCorrelation.toFixed(2):'—'}</AppText></View>
                {!analyticsUsable?<AppText style={s.body}>{t('profile.analyticsInsufficient')}</AppText>:baseline.resultCorrelation===null?<AppText style={s.body}>{t('profile.correlationInsufficient')}</AppText>:null}
              </View>:null}
            </View>:<>
              <AppText style={s.body}>{t('profile.patternsInsufficient')}</AppText>
              <AppText style={s.body}>{t('profile.patternsCollect')}</AppText>
            </>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.history')}</Label>
            <View style={s.settingRow}><Ionicons name="timer-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>{t('profile.historySessions')}</AppText><AppText style={s.settingSub}>{sessions.length}</AppText></View></View>
            <View style={s.settingRow}><Ionicons name="pulse-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>{t('profile.historyCheckins')}</AppText><AppText style={s.settingSub}>{sessions.reduce((n,x)=>n+x.checkins.length,0)}</AppText></View></View>
            <TouchableOpacity style={s.settingRow} onPress={openDiary}><Ionicons name="book-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>{t('profile.diary')}</AppText><AppText style={s.settingSub}>{t('profile.diaryBody')}</AppText></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></TouchableOpacity>
            {sessions.length?<PremiumButton label={t('profile.clearHistory')} secondary danger onPress={clearHistory}/>:null}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.settings')}</Label>
            <View style={s.panel}><Label>{t('profile.language')}</Label><AppText style={s.body}>{t('profile.languageBody')}</AppText><LanguageSelector variant="profile"/></View>
            <TouchableOpacity style={s.settingRow} onPress={()=>router.push('/privacy')}><Ionicons name="shield-checkmark-outline" size={20} color={C.goldLight}/><View style={s.flex}><AppText style={s.settingTitle}>{t('profile.privacy')}</AppText><AppText style={s.settingSub}>{t('profile.privacyBody')}</AppText></View><Ionicons name="chevron-forward" size={18} color={C.dim}/></TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

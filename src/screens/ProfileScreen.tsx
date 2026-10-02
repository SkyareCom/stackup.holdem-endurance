import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n } from '../i18n';

export function ProfileScreen({ openDiary }: { openDiary:()=>void }) {
  const { t } = useI18n();
  const router = useRouter();
  const hasEvolutionHistory=false;
  const hasPatternHistory=false;

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.88}>
      <SafeAreaView style={s.flex}>
        <Header title={t('profile.title')} subtitle={t('profile.stackupId')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.profileSection}>
            <Label>{t('profile.evolution')}</Label>
            {hasEvolutionHistory?null:<>
              <AppText style={s.body}>{t('profile.evolutionInsufficient')}</AppText>
              <AppText style={s.body}>{t('profile.evolutionCollect')}</AppText>
            </>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.patterns')}</Label>
            {hasPatternHistory?<AppText style={s.body}>{t('profile.patternsBody')}</AppText>:<>
              <AppText style={s.body}>{t('profile.patternsInsufficient')}</AppText>
              <AppText style={s.body}>{t('profile.patternsCollect')}</AppText>
            </>}
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.history')}</Label>
            <View style={s.settingRow}>
              <Ionicons name="timer-outline" size={20} color={C.goldLight}/>
              <View style={s.flex}><AppText style={s.settingTitle}>{t('profile.historySessions')}</AppText><AppText style={s.settingSub}>{t('profile.historySessionsBody')}</AppText></View>
            </View>
            <View style={s.settingRow}>
              <Ionicons name="pulse-outline" size={20} color={C.goldLight}/>
              <View style={s.flex}><AppText style={s.settingTitle}>{t('profile.historyCheckins')}</AppText><AppText style={s.settingSub}>{t('profile.historyCheckinsBody')}</AppText></View>
            </View>
            <TouchableOpacity style={s.settingRow} onPress={openDiary}>
              <Ionicons name="book-outline" size={20} color={C.goldLight}/>
              <View style={s.flex}><AppText style={s.settingTitle}>{t('profile.diary')}</AppText><AppText style={s.settingSub}>{t('profile.diaryBody')}</AppText></View>
              <Ionicons name="chevron-forward" size={18} color={C.dim}/>
            </TouchableOpacity>
            <View style={s.settingRow}>
              <Ionicons name="flash-outline" size={20} color={C.goldLight}/>
              <View style={s.flex}><AppText style={s.settingTitle}>{t('profile.historyTests')}</AppText><AppText style={s.settingSub}>{t('profile.historyTestsBody')}</AppText></View>
            </View>
          </View>

          <View style={s.profileSection}>
            <Label>{t('profile.settings')}</Label>
            <View style={s.panel}>
              <Label>{t('profile.language')}</Label>
              <AppText style={s.body}>{t('profile.languageBody')}</AppText>
              <LanguageSelector variant="profile"/>
            </View>
            <TouchableOpacity style={s.settingRow} onPress={()=>router.push('/privacy')}>
              <Ionicons name="shield-checkmark-outline" size={20} color={C.goldLight}/>
              <View style={s.flex}><AppText style={s.settingTitle}>{t('profile.privacy')}</AppText><AppText style={s.settingSub}>{t('profile.privacyBody')}</AppText></View>
              <Ionicons name="chevron-forward" size={18} color={C.dim}/>
            </TouchableOpacity>
            <View style={s.panel}>
              <Label>{t('profile.plan')}</Label>
              <Serif style={s.plan}>{t('profile.planName')}</Serif>
              <AppText style={s.body}>{t('profile.planBody')}</AppText>
              <PremiumButton label={t('profile.viewFull')} secondary/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

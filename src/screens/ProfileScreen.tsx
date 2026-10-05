import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n } from '../i18n';

export function ProfileScreen({ openDiary }: { openDiary:()=>void }) {
  const { t } = useI18n();

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.88}>
      <SafeAreaView style={s.flex}>
        <Header title={t('profile.title')} subtitle={t('profile.stackupId')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.lead}>
            <Label>{t('profile.progression')}</Label>
            <Serif style={s.profileLevel}>{t('profile.level')}</Serif>
            <AppText style={s.body}>{t('profile.consistency')}</AppText>
            <View style={s.track}><View style={[s.fill,{width:'68%'}]}/></View>
          </View>
          <View style={s.stats}>
            <View style={s.stat}>
              <Label>{t('profile.sessions')}</Label>
              <Serif style={s.statValue}>125</Serif>
              <AppText style={s.goldText}>{t('profile.thisMonth')}</AppText>
            </View>
            <View style={s.stat}>
              <Label>{t('profile.discipline')}</Label>
              <Serif style={s.statValue}>88</Serif>
              <AppText style={s.goldText}>+6%</AppText>
            </View>
          </View>
          <View style={s.panel}>
            <Label>{t('profile.plan')}</Label>
            <Serif style={s.plan}>{t('profile.planName')}</Serif>
            <AppText style={s.body}>{t('profile.planBody')}</AppText>
            <PremiumButton label={t('profile.viewFull')} secondary/>
          </View>
          <View style={s.panel}>
            <AppText style={s.body}>{t('profile.languageBody')}</AppText>
            <LanguageSelector variant="profile"/>
          </View>
          <TouchableOpacity activeOpacity={0.72} style={[s.settingRow,s.interactiveRow]} onPress={openDiary}>
            <Ionicons name="book-outline" size={20} color={C.goldLight}/>
            <View style={s.flex}>
              <AppText style={s.settingTitle}>{t('profile.diary')}</AppText>
              <AppText style={s.settingSub}>{t('profile.diaryBody')}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.dim}/>
          </TouchableOpacity>
          <View style={s.settingRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={C.goldLight}/>
            <View style={s.flex}>
              <AppText style={s.settingTitle}>{t('profile.privacy')}</AppText>
              <AppText style={s.settingSub}>{t('profile.privacyBody')}</AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.dim}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

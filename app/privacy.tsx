import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LanguageSelector } from '../src/components/LanguageSelector';
import { useI18n } from '../src/i18n';
import { s } from '../src/styles';
import { C, PHOTO } from '../src/theme';
import { AppText, Backdrop, Label, Serif } from '../src/ui';

export default function PrivacyScreen() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.9}>
      <SafeAreaView style={s.flex}>
        <View style={s.overlayHeader}>
          <View style={s.flex}>
            <Label>{t('privacy.subtitle')}</Label>
            <Serif style={s.overlayTitle}>{t('privacy.title')}</Serif>
          </View>
          <TouchableOpacity onPress={()=>router.back()} style={s.close}>
            <Ionicons name="close" size={25} color={C.ivory}/>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.overlayScroll}>
          <View style={s.moduleContent}>
            <View style={s.guidedSection}>
              <Label>{t('privacy.scope')}</Label>
              <AppText style={s.body}>{t('privacy.scopeBody')}</AppText>
              <AppText style={s.goldText}>{t('privacy.updated')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.dataOnDevice')}</Label>
              <AppText style={s.body}>{t('privacy.localOnlyBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.networkResources')}</Label>
              <AppText style={s.body}>{t('privacy.pexelsBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.coachAndVoice')}</Label>
              <AppText style={s.body}>{t('privacy.noRemoteAiBody')}</AppText>
              <AppText style={s.body}>{t('privacy.noMicBody')}</AppText>
              <AppText style={s.body}>{t('privacy.systemSpeechBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.security')}</Label>
              <AppText style={s.body}>{t('privacy.securityBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.retention')}</Label>
              <AppText style={s.body}>{t('privacy.retentionBody')}</AppText>
              <AppText style={s.body}>{t('privacy.deletionBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.future')}</Label>
              <AppText style={s.body}>{t('privacy.futureBody')}</AppText>
            </View>

            <View style={s.guidedBlock}>
              <Label>{t('privacy.contact')}</Label>
              <AppText style={s.body}>{t('privacy.contactBody')}</AppText>
            </View>

            <LanguageSelector variant="profile"/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

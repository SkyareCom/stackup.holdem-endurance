import React from 'react';
import { View } from 'react-native';
import { AppText, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { useI18n } from '../i18n';

export function TestIntro({
  title,
  measures,
  importance,
  instructions,
  duration,
  startLabel,
  onStart,
}: {
  title: string;
  measures: string;
  importance: string;
  instructions: string;
  duration: string;
  startLabel: string;
  onStart: () => void;
}) {
  const { t } = useI18n();
  return (
    <View style={s.testIntro}>
      <Serif style={s.overlayHeadline}>{title.toUpperCase()}</Serif>
      <View style={s.guidedBlock}><Label>{t('testIntro.measures')}</Label><AppText style={s.body}>{measures}</AppText></View>
      <View style={s.guidedBlock}><Label>{t('testIntro.importance')}</Label><AppText style={s.body}>{importance}</AppText></View>
      <View style={s.guidedBlock}><Label>{t('testIntro.instructions')}</Label><AppText style={s.body}>{instructions}</AppText></View>
      <View style={s.guidedBlock}><Label>{t('testIntro.duration')}</Label><AppText style={s.goldText}>{duration}</AppText></View>
      <PremiumButton label={startLabel.toUpperCase()} onPress={onStart}/>
    </View>
  );
}

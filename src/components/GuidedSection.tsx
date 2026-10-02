import React from 'react';
import { View } from 'react-native';
import { AppText, Label, PremiumButton, Serif } from '../ui';
import { s } from '../styles';
import { useI18n } from '../i18n';

export function GuidedSection({
  subtitle,
  title,
  description,
  what,
  how,
  result,
  actionLabel,
  onAction,
  children,
}: {
  subtitle: string;
  title: string;
  description?: string;
  what?: string;
  how?: string;
  result?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <View style={s.guidedSection}>
      <Label>{subtitle.toUpperCase()}</Label>
      <Serif style={s.guidedTitle}>{title.toUpperCase()}</Serif>
      {description ? <AppText style={s.guidedDescription}>{description}</AppText> : null}
      {what ? <View style={s.guidedBlock}><Label>{t('common.whatItIs')}</Label><AppText style={s.body}>{what}</AppText></View> : null}
      {how ? <View style={s.guidedBlock}><Label>{t('common.howToUse')}</Label><AppText style={s.body}>{how}</AppText></View> : null}
      {result ? <View style={s.guidedBlock}><Label>{t('common.yourReading')}</Label><AppText style={s.body}>{result}</AppText></View> : null}
      {children}
      {actionLabel ? <PremiumButton label={actionLabel.toUpperCase()} onPress={onAction}/> : null}
    </View>
  );
}

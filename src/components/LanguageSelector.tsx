import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useI18n, type Locale, type TranslationKey } from '../i18n';
import { AppText } from '../ui';
import { s } from '../styles';

const localeOrder: Locale[] = ['pt', 'en', 'es'];
const labelKeys: Record<Locale, TranslationKey> = {
  pt: 'language.portuguese',
  en: 'language.english',
  es: 'language.spanish',
};

export function LanguageSelector({ variant }: { variant: 'landing' | 'profile' }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <View style={[s.languageSelector, variant === 'profile' && s.languageSelectorProfile]}>
      <AppText style={s.languageTitle}>{t('language.title')}</AppText>
      <View style={s.languageOptions}>
        {localeOrder.map((option) => {
          const active = option === locale;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setLocale(option)}
              style={[s.languageOption, active && s.languageOptionActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <AppText style={[s.languageOptionText, active && s.languageOptionTextActive]}>
                {t(labelKeys[option])}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

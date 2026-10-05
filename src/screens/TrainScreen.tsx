import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, Serif } from '../ui';
import { s } from '../styles';
import { Module, moduleMeta } from '../types';
import { useI18n } from '../i18n';

export function TrainScreen({ openModule }: { openModule:(m:Module)=>void }) {
  const { t } = useI18n();
  const keys:Module[]=['war','behavior','gym','lifestyle','audio'];

  return (
    <Backdrop uri={PHOTO.focus} blur={12} overlay={0.84}>
      <SafeAreaView style={s.flex}>
        <Header title={t('train.title')} subtitle={t('train.subtitle')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.lead}>
            <Label>{t('train.architecture')}</Label>
            <Serif style={s.leadTitle}>{t('train.lead')}</Serif>
          </View>
          {keys.map((key,i)=>{
            const m=moduleMeta[key];
            return (
              <TouchableOpacity activeOpacity={0.72} accessibilityRole="button" key={key} style={[s.moduleRow,s.interactiveRow]} onPress={()=>openModule(key)}>
                <AppText style={s.moduleN}>0{i+1}</AppText>
                <View style={s.moduleIcon}><Ionicons name={m.icon} size={20} color={C.goldLight}/></View>
                <View style={s.flex}>
                  <Serif style={s.moduleTitle}>{t(m.titleKey)}</Serif>
                  <AppText style={s.moduleSub}>{t(m.subtitleKey)}</AppText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.goldLight}/>
              </TouchableOpacity>
            );
          })}
          <View style={s.panel}>
            <Label>{t('train.mentalReserve')}</Label>
            <Serif style={s.reserve}>74%</Serif>
            <View style={s.track}><View style={[s.fill,{width:'74%'}]}/></View>
            <AppText style={s.body}>{t('train.reserveBody')}</AppText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

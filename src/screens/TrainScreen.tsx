import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, Backdrop, Header, Label, Serif } from '../ui';
import { GuidedSection } from '../components/GuidedSection';
import { trainingGroups } from '../content';
import { s } from '../styles';
import { Module, moduleMeta } from '../types';
import { useI18n } from '../i18n';

export function TrainScreen({ openModule }: { openModule:(m:Module)=>void }) {
  const { t } = useI18n();

  return (
    <Backdrop uri={PHOTO.focus} blur={12} overlay={0.84}>
      <SafeAreaView style={s.flex}>
        <Header title={t('train.title')} subtitle={t('train.subtitle')}/>
        <ScrollView contentContainerStyle={s.scroll}>
          <GuidedSection
            subtitle={t('train.architecture')}
            title={t('train.lead')}
            description={t('train.guidedIntro')}
          />

          {trainingGroups.map((group)=>(
            <View key={group.id} style={s.trainingGroup}>
              <Label>{t(group.titleKey)}</Label>
              <Serif style={s.trainingGroupTitle}>{t(group.titleKey).toUpperCase()}</Serif>
              <AppText style={s.body}>{t(group.descriptionKey)}</AppText>

              {group.modules.map((module)=>{
                const meta=moduleMeta[module.id];
                return (
                  <TouchableOpacity key={module.id} style={s.trainingModuleRow} onPress={()=>openModule(module.id)}>
                    <View style={s.moduleIcon}><Ionicons name={meta.icon} size={20} color={C.goldLight}/></View>
                    <View style={s.flex}>
                      <Serif style={s.moduleTitle}>{t(meta.titleKey).toUpperCase()}</Serif>
                      <AppText style={s.moduleSub}>{t(module.whatKey)}</AppText>
                      <View style={s.trainingMetaRow}>
                        <AppText style={s.goldText}>{t(module.whenKey)}</AppText>
                        <AppText style={s.moduleSub}>{t(module.durationKey)}</AppText>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={C.goldLight}/>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <GuidedSection
            subtitle={t('train.mentalReserve')}
            title="74%"
            description={t('train.reserveBody')}
            result={t('train.reserveMeaning')}
          >
            <View style={s.track}><View style={[s.fill,{width:'74%'}]}/></View>
          </GuidedSection>
        </ScrollView>
      </SafeAreaView>
    </Backdrop>
  );
}

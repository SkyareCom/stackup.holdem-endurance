import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, AppTextInput, Backdrop, Header, Label, Serif } from '../ui';
import { s } from '../styles';
import { useI18n, type Locale, type TranslationKey } from '../i18n';
import type { Phase } from '../types';

type ChatMessage = { role:'you'|'ai'; text:string; locale?:Locale };

const quickPromptKeys: TranslationKey[] = [
  'coach.quick.accelerated',
  'coach.quick.focus',
  'coach.quick.tired',
  'coach.quick.reset',
  'coach.quick.review',
];

export function CoachScreen({ phase='ready' }: { phase?:Phase }) {
  const { t, locale } = useI18n();
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<ChatMessage[]>([]);

  const send=()=>{
    const v=input.trim();
    if(!v)return;
    setMessages(m=>[...m,{role:'you',text:v},{role:'ai',text:t('coach.reply'),locale}]);
    setInput('');
  };

  const phaseKey:TranslationKey=phase==='active'?'coach.phaseActive':phase==='debrief'?'coach.phaseDebrief':'coach.phaseReady';

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.87}>
      <SafeAreaView style={s.flex}>
        <Header title={t('coach.title')} subtitle={t('coach.subtitle')}/>
        <ScrollView contentContainerStyle={s.coachScroll}>
          <View style={s.panel}>
            <Label>{t('coach.activeContext')}</Label>
            <Serif style={s.contextTitle}>{t('coach.contextTitle')}</Serif>
            <AppText style={s.body}>{t('coach.contextNoHistory')}</AppText>
            <View style={s.contextList}>
              <View style={s.contextRow}><Label>{t('coach.contextReadiness')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextPhase')}</Label><AppText style={s.contextValue}>{t(phaseKey)}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextCheckins')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextTrigger')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextTraining')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextHomeRecommendation')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
            </View>
          </View>
          <View style={s.coachQuickPanel}>
            <Label>{t('coach.quickActions')}</Label>
            <View style={s.coachQuickGrid}>
              {quickPromptKeys.map((key,index)=>
                <TouchableOpacity key={key} style={[s.coachQuickAction,index===quickPromptKeys.length-1&&s.coachQuickActionWide]} onPress={()=>setInput(t(key))}>
                  <AppText style={s.chipText}>{t(key).toUpperCase()}</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {messages.length===0
            ?<View style={s.coachEmptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={C.goldLight}/>
              <AppText style={s.coachEmptyText}>{t('coach.emptyPrompt')}</AppText>
            </View>
            :messages.map((m,i)=>
              <View key={i} style={[s.bubble,m.role==='you'?s.bubbleYou:s.bubbleAi]}>
                <AppText style={s.chatText}>{m.text}</AppText>
              </View>
            )}
        </ScrollView>
        <View style={s.composer}>
          <TouchableOpacity style={s.voice}>
            <Ionicons name="mic" size={18} color={C.goldLight}/>
            <AppText style={s.voiceText}>{t('coach.holdToTalk')}</AppText>
          </TouchableOpacity>
          <View style={s.inputRow}>
            <AppTextInput value={input} onChangeText={setInput} placeholder={t('coach.placeholder')} placeholderTextColor={C.dim} style={s.input}/>
            <TouchableOpacity style={s.send} onPress={send}><Ionicons name="arrow-up" size={19} color={C.ink}/></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Backdrop>
  );
}

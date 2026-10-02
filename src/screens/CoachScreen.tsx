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

const primaryQuickPromptKeys: TranslationKey[] = [
  'coach.quick.accelerated',
  'coach.quick.focus',
  'coach.quick.tired',
  'coach.quick.reset',
];

export function CoachScreen({ phase='ready' }: { phase?:Phase }) {
  const { t, locale } = useI18n();
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const [contextExpanded,setContextExpanded]=useState(false);

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
            <View style={s.coachPhaseRow}>
              <View style={s.contextRow}><Label>{t('coach.contextReadiness')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextPhase')}</Label><AppText style={s.contextValue}>{t(phaseKey)}</AppText></View>
            </View>
            <TouchableOpacity style={s.coachContextToggle} onPress={()=>setContextExpanded(v=>!v)}>
              <AppText style={s.coachContextToggleText}>{t(contextExpanded?'coach.hideContext':'coach.showContext')}</AppText>
              <Ionicons name={contextExpanded?'chevron-up':'chevron-down'} size={18} color={C.goldLight}/>
            </TouchableOpacity>
            {contextExpanded?<View style={s.contextList}>
              <View style={s.contextRow}><Label>{t('coach.contextCheckins')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextTrigger')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextTraining')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
              <View style={s.contextRow}><Label>{t('coach.contextHomeRecommendation')}</Label><AppText style={s.contextValue}>{t('coach.contextUnavailable')}</AppText></View>
            </View>:null}
          </View>
          <View style={s.coachQuickPanel}>
            <Label>{t('coach.quickActions')}</Label>
            <View style={s.coachQuickGrid}>
              {primaryQuickPromptKeys.map((key)=>
                <TouchableOpacity key={key} style={s.coachQuickAction} onPress={()=>setInput(t(key))}>
                  <AppText style={s.chipText}>{t(key).toUpperCase()}</AppText>
                </TouchableOpacity>
              )}
              {phase==='debrief'?<TouchableOpacity style={[s.coachQuickAction,s.coachQuickActionWide]} onPress={()=>setInput(t('coach.quick.review'))}>
                <AppText style={s.chipText}>{t('coach.quick.review').toUpperCase()}</AppText>
              </TouchableOpacity>:null}
            </View>
            {messages.length===0?<AppText style={s.coachHint}>{t('coach.emptyPrompt')}</AppText>:null}
          </View>
          {messages.map((m,i)=>
            <View key={i} style={[s.bubble,m.role==='you'?s.bubbleYou:s.bubbleAi]}>
              <AppText style={s.chatText}>{m.text}</AppText>
            </View>
          )}
        </ScrollView>
        <View style={s.composer}>
          <View style={s.inputRow}>
            <AppTextInput value={input} onChangeText={setInput} placeholder={t('coach.placeholder')} placeholderTextColor={C.dim} style={s.input}/>
            <TouchableOpacity style={s.send} onPress={send}><Ionicons name="arrow-up" size={19} color={C.ink}/></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Backdrop>
  );
}

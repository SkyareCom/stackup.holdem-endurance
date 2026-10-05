import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { AppText, AppTextInput, Backdrop, Header, Label, Serif } from '../ui';
import { s } from '../styles';
import { useI18n, type Locale, type TranslationKey } from '../i18n';

type ChatMessage = { role:'you'|'ai'; text:string; locale?:Locale };

const quickPromptKeys: TranslationKey[] = [
  'coach.quick.tilted',
  'coach.quick.tired',
  'coach.quick.focus',
  'coach.quick.reset',
];

export function CoachScreen() {
  const { t, locale } = useI18n();
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<ChatMessage[]>([]);

  const send=()=>{
    const v=input.trim();
    if(!v)return;
    setMessages(m=>[...m,{role:'you',text:v},{role:'ai',text:t('coach.reply'),locale}]);
    setInput('');
  };

  const sampleMessages: ChatMessage[] = [
    {role:'you',text:t('coach.sampleUser')},
    {role:'ai',text:t('coach.sampleReply'),locale},
  ];

  return (
    <Backdrop uri={PHOTO.focus} blur={14} overlay={0.87}>
      <SafeAreaView style={s.flex}>
        <Header title={t('coach.title')} subtitle={t('coach.subtitle')}/>
        <ScrollView contentContainerStyle={s.coachScroll}>
          <View style={s.panel}>
            <Label>{t('coach.activeContext')}</Label>
            <Serif style={s.contextTitle}>{t('coach.contextTitle')}</Serif>
            <AppText style={s.body}>{t('coach.contextBody')}</AppText>
          </View>
          <View style={s.chips}>
            {quickPromptKeys.map((key)=>
              <TouchableOpacity activeOpacity={0.68} key={key} style={s.chip} onPress={()=>setInput(t(key))}>
                <AppText style={s.chipText}>{t(key).toUpperCase()}</AppText>
              </TouchableOpacity>
            )}
          </View>
          {[...sampleMessages,...messages].map((m,i)=>
            <View key={i} style={[s.bubble,m.role==='you'?s.bubbleYou:s.bubbleAi]}>
              <AppText style={s.chatText}>{m.text}</AppText>
            </View>
          )}
        </ScrollView>
        <View style={s.composer}>
          <View style={s.voiceDisabled}>
            <Ionicons name="mic" size={18} color={C.goldLight}/>
            <AppText style={s.voiceText}>{t('coach.holdToTalk')}</AppText>
          </View>
          <View style={s.inputRow}>
            <AppTextInput value={input} onChangeText={setInput} placeholder={t('coach.placeholder')} placeholderTextColor={C.dim} style={s.input}/>
            <TouchableOpacity activeOpacity={0.68} style={s.send} onPress={send}><Ionicons name="arrow-up" size={19} color={C.ink}/></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Backdrop>
  );
}

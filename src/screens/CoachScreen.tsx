import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, PHOTO } from '../theme';
import { Backdrop, Header, Label, Serif } from '../ui';
import { s } from '../styles';

export function CoachScreen() {
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<{role:'you'|'ai';text:string}[]>([{role:'you',text:'Perdi dois potes grandes e estou acelerando.'},{role:'ai',text:'Você não precisa recuperar os potes. Recupere o tempo da sua decisão.'}]);
  const send=()=>{const v=input.trim();if(!v)return;setMessages(m=>[...m,{role:'you',text:v},{role:'ai',text:'Primeiro recupere baseline. Pressa é sinal de estado, não informação sobre o range.'}]);setInput('')};
  return <Backdrop uri={PHOTO.focus} blur={14} overlay={0.87}><SafeAreaView style={s.flex}><Header title="COACH" subtitle="ENDURANCE INTELLIGENCE"/><ScrollView contentContainerStyle={s.coachScroll}><View style={s.panel}><Label>ACTIVE CONTEXT</Label><Serif style={s.contextTitle}>Seu estado faz parte da mão.</Serif><Text style={s.body}>B-Game detectado. Energia em queda. Irritação registrada há 19 minutos. Reduza urgência antes de ajustar estratégia.</Text></View><View style={s.chips}>{['Estou tiltado','Estou cansado','Perdi o foco','Preciso resetar'].map(x=><TouchableOpacity key={x} style={s.chip} onPress={()=>setInput(x)}><Text style={s.chipText}>{x.toUpperCase()}</Text></TouchableOpacity>)}</View>{messages.map((m,i)=><View key={i} style={[s.bubble,m.role==='you'?s.bubbleYou:s.bubbleAi]}><Text style={s.chatText}>{m.text}</Text></View>)}</ScrollView><View style={s.composer}><TouchableOpacity style={s.voice}><Ionicons name="mic" size={18} color={C.goldLight}/><Text style={s.voiceText}>SEGURE PARA FALAR</Text></TouchableOpacity><View style={s.inputRow}><TextInput value={input} onChangeText={setInput} placeholder="Fale com o Coach..." placeholderTextColor={C.dim} style={s.input}/><TouchableOpacity style={s.send} onPress={send}><Ionicons name="arrow-up" size={19} color={C.ink}/></TouchableOpacity></View></View></SafeAreaView></Backdrop>;
}
